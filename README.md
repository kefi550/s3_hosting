# s3 + cloudfront + 独自ドメインでのウェブサイトホスティング

`settings/` に `<ドメイン名>.yaml` を置く

```sh
npm install
npm run cdk diff -- --context env=<ドメイン名>
npm run cdk deploy -- --context env=<ドメイン名>
```

