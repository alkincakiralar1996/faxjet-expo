#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';

const KEY_ID = 'P8CL9DH6FK';
const ISSUER_ID = '99e6e86b-ca15-4aaa-9086-136b93c84393';
const P8_PATH = '/Users/alkincakiralar/Desktop/prevena/scripts/keys/AuthKey_P8CL9DH6FK.p8';
const APP_ID = '6773434191';

function b64url(b) {
  return Buffer.from(b).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
}
function jwt() {
  const h = { alg: 'ES256', kid: KEY_ID, typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const p = { iss: ISSUER_ID, iat: now, exp: now + 1200, aud: 'appstoreconnect-v1' };
  const data = `${b64url(JSON.stringify(h))}.${b64url(JSON.stringify(p))}`;
  const sig = crypto.createSign('SHA256').update(data).sign({
    key: fs.readFileSync(P8_PATH, 'utf8'),
    dsaEncoding: 'ieee-p1363',
  });
  return `${data}.${b64url(sig)}`;
}
const token = jwt();

const versions = ['v1', 'v2', 'v3'];
const types = [
  'appDataUsages',
  'appPrivacy',
  'appPrivacies',
  'appPrivacyConfig',
  'appPrivacyConfigs',
  'appPrivacyDetails',
  'appPrivacyResponses',
  'appPrivacyChoices',
  'appDataCollection',
  'appDataCollections',
  'appDataCategories',
  'appCategoryUsages',
  'appPrivacyManifestRecords',
  'appPrivacyManifest',
];

for (const v of versions) {
  for (const t of types) {
    const p = `/${v}/${t}?filter[app]=${APP_ID}&limit=1`;
    const res = await fetch(`https://api.appstoreconnect.apple.com${p}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status !== 404) {
      const body = await res.text();
      console.log(`${res.status}\t${p}\t${body.slice(0, 200)}`);
    }
  }
}
console.log('done');
