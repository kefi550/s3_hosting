import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as S3Hosting from '../lib/s3-hosting-stack';

//test('Empty Stack', () => {
//    const app = new cdk.App();
//    // WHEN
//    const stack = new S3Hosting.S3HostingStack(app, 'MyTestStack');
//    // THEN
//    expectCDK(stack).to(matchTemplate({
//      "Resources": {}
//    }, MatchStyle.EXACT))
//});
