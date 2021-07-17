# s3 + cloudfront + 独自ドメインでのウェブサイトホスティング

`settings/` に `<ドメイン名>.yaml` を置く

```sh
npm install
npx cdk diff --context env=<ドメイン名>
npx cdk deploy --context env=<ドメイン名>
```

