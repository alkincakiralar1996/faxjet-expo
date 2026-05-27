#!/usr/bin/env node
// Set App Store version copyright via ASC API.
// Usage: node asc/set-copyright.mjs "2026 Pyxa Studio"

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const BUNDLE_ID = 'com.pyxastudio.faxjet';
const KEY_ID = 'P8CL9DH6FK';
const ISSUER_ID = '99e6e86b-ca15-4aaa-9086-136b93c84393';
const P8_PATH = '/Users/alkincakiralar/Desktop/prevena/scripts/keys/AuthKey_P8CL9DH6FK.p8';
const API_BASE = 'https://api.appstoreconnect.apple.com';

const COPYRIGHT = process.argv[2] || '2026 Pyxa Studio';

function b64url(buf) {
  return Buffer.from(buf).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function jwt() {
  const header = { alg: 'ES256', kid: KEY_ID, typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = { iss: ISSUER_ID, iat: now, exp: now + 1200, aud: 'appstoreconnect-v1' };
  const pkey = fs.readFileSync(P8_PATH, 'utf8');
  const data = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`;
  const sig = crypto.createSign('SHA256').update(data).sign({ key: pkey, dsaEncoding: 'ieee-p1363' });
  return `${data}.${b64url(sig)}`;
}

async function api(path, init = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${jwt()}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${init.method || 'GET'} ${path} → ${res.status}\n${text}`);
  }
  return res.status === 204 ? null : res.json();
}

const appsRes = await api(`/v1/apps?filter[bundleId]=${BUNDLE_ID}`);
const app = appsRes.data[0];
if (!app) throw new Error(`App not found: ${BUNDLE_ID}`);

const versionsRes = await api(`/v1/apps/${app.id}/appStoreVersions?filter[appStoreState]=PREPARE_FOR_SUBMISSION&limit=1`);
const version = versionsRes.data[0];
if (!version) throw new Error('No editable version found');

console.log(`App: ${app.attributes.name}`);
console.log(`Version: ${version.attributes.versionString} (${version.id})`);
console.log(`Setting copyright: "${COPYRIGHT}"`);

await api(`/v1/appStoreVersions/${version.id}`, {
  method: 'PATCH',
  body: JSON.stringify({
    data: {
      type: 'appStoreVersions',
      id: version.id,
      attributes: { copyright: COPYRIGHT },
    },
  }),
});

console.log('✓ Updated.');
