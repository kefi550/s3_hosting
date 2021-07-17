#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { S3HostingStack, S3HostingStackProps } from "../lib/s3-hosting-stack";

const app = new cdk.App();
const accountEnvironment: cdk.Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};
const env: string = app.node.tryGetContext("env");
const props: S3HostingStackProps = app.node.tryGetContext(env);
if (!env) {
  throw new Error("Usage: cdk {cmd} --context env={domainName}");
}
new S3HostingStack(app, "blog-kefiwild-com-hosting", {
  env: accountEnvironment,
  ...props,
});
