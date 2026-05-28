# FaxJet — Agent Notes

## ⛔ DO NOT USE EAS (hard rule)

The user has explicitly forbidden Expo Application Services (EAS) for this
project — no `eas build`, no `eas submit`, no EAS-managed credentials.
**All iOS builds are done locally.** If you ever reach for `eas ...`, stop.

(`eas.json` may exist for config reference only — it is NOT to be used to run
cloud builds.)

## iOS build → TestFlight (local, fully non-interactive)

CocoaPods on this machine needs a UTF-8 locale or `pod install` crashes with
`Encoding::CompatibilityError (ASCII-8BIT)`. **Always prefix pod/xcodebuild
commands with `LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8`.** Use Homebrew's pod
(`/opt/homebrew/bin/pod`, 1.16.2).

Pipeline:

```bash
# 1. Regenerate native project (managed workflow, no committed ios/)
npx expo prebuild -p ios --clean

# 2. Pods (UTF-8 required)
cd ios && LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8 pod install && cd ..

# 3. Archive — automatic signing via ASC API key (no Apple ID login)
cd ios && LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8 xcodebuild \
  -workspace FaxJet.xcworkspace -scheme FaxJet -configuration Release \
  -destination 'generic/platform=iOS' -archivePath /tmp/FaxJet.xcarchive \
  -allowProvisioningUpdates \
  -authenticationKeyPath /Users/alkincakiralar/.appstoreconnect/private_keys/AuthKey_P8CL9DH6FK.p8 \
  -authenticationKeyID P8CL9DH6FK \
  -authenticationKeyIssuerID 99e6e86b-ca15-4aaa-9086-136b93c84393 \
  DEVELOPMENT_TEAM=MR267Y7WGW CODE_SIGN_STYLE=Automatic archive

# 4. Export IPA (method app-store-connect, /tmp/exportOptions.plist)
cd ios && LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8 xcodebuild -exportArchive \
  -archivePath /tmp/FaxJet.xcarchive -exportOptionsPlist /tmp/exportOptions.plist \
  -exportPath /tmp/FaxJetExport -allowProvisioningUpdates \
  -authenticationKeyPath /Users/alkincakiralar/.appstoreconnect/private_keys/AuthKey_P8CL9DH6FK.p8 \
  -authenticationKeyID P8CL9DH6FK \
  -authenticationKeyIssuerID 99e6e86b-ca15-4aaa-9086-136b93c84393

# 5. Upload to TestFlight (App Store Connect API key — no password/2FA)
xcrun altool --upload-app -f /tmp/FaxJetExport/FaxJet.ipa -t ios \
  --apiKey P8CL9DH6FK --apiIssuer 99e6e86b-ca15-4aaa-9086-136b93c84393
```

## Identifiers / credentials

- Bundle id: `com.pyxastudio.faxjet`
- Apple Team / Seed ID: `MR267Y7WGW`
- ASC API key: `P8CL9DH6FK`, issuer `99e6e86b-ca15-4aaa-9086-136b93c84393`
  (`.p8` lives in `~/.appstoreconnect/private_keys/` and `~/.ascelerate/`)
- Bump `ios.buildNumber` in `app.json` for each new TestFlight build.

## App Store Connect tooling

- `ascelerate` CLI manages ASC metadata, media (screenshots), IAP/subs,
  certs, bundle ids. Already authed with the key above.
- App Privacy nutrition label: `fastlane ios upload_privacy` (needs Apple ID).

## Backend (sibling repo: ../jetfax-nextjs)

- Next.js 16 on Vercel, Neon Postgres (Drizzle ORM). Admin at `/admin`
  (`admin` / `123456`). Deploy: `git push` + `vercel --prod`.
- `proxy.ts` gates `/admin` + `/api/admin`. Drizzle schema push:
  `set -a; . ./.env.local; set +a && npm run db:push`.

## Phase status

Mock fax send + subscription remain optimistic/local. The only two
integrations still pending: real Telnyx transmission and RevenueCat
subscription management.
