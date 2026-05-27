#!/usr/bin/env node
// Set Content Rights declaration on the FaxJet app.
// FaxJet transmits user-supplied documents only — no third-party content.

import crypto from 'node:crypto';
import fs from 'node:fs';

const BUNDLE_ID = 'com.pyxastudio.faxjet';
const KEY_ID = 'P8CL9DH6FK';
const ISSUER_ID = '99e6e86b-ca15-4aaa-9086-136b93c84393';
const P8_PATH = '/Users/alkincakiralar/Desktop/prevena/scripts/keys/AuthKey_P8CL9DH6FK.p8';
const API_BASE = 'https://api.appstoreconnect.apple.com';

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
    throw new Error(`${init.method || 'GET'} ${path} → ${res.status}\n${await res.text()}`);
  }
  return res.status === 204 ? null : res.json();
}

const apps = await api(`/v1/apps?filter[bundleId]=${BUNDLE_ID}`);
const app = apps.data[0];
console.log(`App: ${app.attributes.name} (${app.id})`);

await api(`/v1/apps/${app.id}`, {
  method: 'PATCH',
  body: JSON.stringify({
    data: {
      type: 'apps',
      id: app.id,
      attributes: { contentRightsDeclaration: 'DOES_NOT_USE_THIRD_PARTY_CONTENT' },
    },
  }),
});

console.log('✓ Content rights: DOES_NOT_USE_THIRD_PARTY_CONTENT');
