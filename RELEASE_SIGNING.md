# Release Signing & APK Build (Solana Mobile dApp Store)

## 1) Generate release keystore (one-time)

From `yun-seeker/android/app`:

```bash
keytool -genkeypair \
  -v \
  -storetype PKCS12 \
  -keystore upload-keystore.jks \
  -alias upload \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

Keep this file safe. Do not lose it.

## 2) Configure key.properties

```bash
cd /home/jmr0ck_jm/.openclaw/workspace/yun-seeker/android
cp key.properties.example key.properties
```

Set real values in `android/key.properties`:

- `storeFile=app/upload-keystore.jks`
- `storePassword=...`
- `keyAlias=upload`
- `keyPassword=...`

## 3) Build signed release APK

```bash
cd /home/jmr0ck_jm/.openclaw/workspace/yun-seeker
npm run build:apk
```

Expected output:

- `android/app/build/outputs/apk/release/app-release.apk`

## 4) Verify signing (recommended)

```bash
apksigner verify --verbose android/app/build/outputs/apk/release/app-release.apk
```

## 5) Submission checklist highlights

- Release APK is signed with your release key (not debug)
- `versionCode` increments for each update
- `versionName` updated for release tag
- App icon/screenshots/description ready in Publisher Portal
- Publisher account/KYC/KYB complete

