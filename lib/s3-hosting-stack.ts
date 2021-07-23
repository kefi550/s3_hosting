import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as cf from "@aws-cdk/aws-cloudfront";
import * as iam from "@aws-cdk/aws-iam";
import * as r53 from "@aws-cdk/aws-route53";
import * as r53Targets from "@aws-cdk/aws-route53-targets";
import * as crypto from "crypto";

export interface S3HostingStackProps extends cdk.StackProps {
  readonly domainName: string;
  readonly hostedZoneName: string;
  readonly acmCertificateArn: string;
}

export class S3HostingStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: S3HostingStackProps) {
    super(scope, id, props);
    const domainName = props.domainName;
    const hostedZoneName = props.hostedZoneName;
    const acmCertificateArn = props.acmCertificateArn;

    const bucket = new s3.Bucket(this, `${this.stackName}-bucket`, {
      bucketName: `${this.stackName}-origin-bucket`,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      accessControl: s3.BucketAccessControl.PRIVATE,
      websiteIndexDocument: "index.html",
      versioned: true,
    });

    const distribution = new cf.CloudFrontWebDistribution(
      this,
      `${this.stackName}-distribution`,
      {
        priceClass: cf.PriceClass.PRICE_CLASS_100,
        originConfigs: [
          {
            customOriginSource: {
              domainName: bucket.bucketWebsiteDomainName,
              originProtocolPolicy: cf.OriginProtocolPolicy.HTTP_ONLY,
              originHeaders: {
                Referer: crypto
                  .createHash("md5")
                  .update(this.stackId)
                  .digest("hex"),
              },
            },
            behaviors: [
              {
                isDefaultBehavior: true,
              },
            ],
          },
        ],
        viewerCertificate: {
          aliases: [domainName],
          props: {
            acmCertificateArn: acmCertificateArn,
            sslSupportMethod: cf.SSLMethod.SNI,
          },
        },
        errorConfigurations: [
          {
            errorCode: 404,
            responseCode: 200,
            responsePagePath: "/404.html",
          },
        ],
      }
    );

    const bucketPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["s3:GetObject"],
      resources: [`${bucket.bucketArn}/*`],
      principals: [new iam.Anyone()],
      conditions: {
        StringEquals: {
          "aws:Referer": crypto
            .createHash("md5")
            .update(this.stackId)
            .digest("hex"),
        },
      },
    });
    bucket.addToResourcePolicy(bucketPolicy);

    const hostedZone = r53.HostedZone.fromLookup(this, "hosted-zone", {
      domainName: hostedZoneName,
    });
    const target = new r53Targets.CloudFrontTarget(distribution);
    const aliasRecord = new r53.ARecord(this, `${this.stackName}-record`, {
      target: r53.RecordTarget.fromAlias(
        new r53Targets.CloudFrontTarget(distribution)
      ),
      zone: hostedZone,
      recordName: domainName,
    });
  }
}
