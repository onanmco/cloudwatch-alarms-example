import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CloudWatchStack } from './nested-stacks/cloudwatch-stack';
import { LambdaStack } from './nested-stacks/lambda-stack';
import { SnsStack } from './nested-stacks/sns-stack';

export class MainStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const envName = this.node.tryGetContext("env-name");
    const appName = this.node.tryGetContext("app-name");
    const emails = (this.node.tryGetContext("emails") as string)
      .split(",")
      .map(email => email.trim());

    const lambdaStack = new LambdaStack(this, "lambda-stack", {
      envName,
      appName,
      description: "Creates a sample function that produces a CustomError."
    });

    const snsStack = new SnsStack(this, "sns-stack", {
      envName,
      appName,
      emails,
      description: "Creates an SNS Topic to send received messages to e-mail recipients."
    });

    const cloudwatchStack = new CloudWatchStack(this, "cloudwatch-stack", {
      envName,
      appName,
      sampleFunction: lambdaStack.getSampleFunction(),
      alarmTopic: snsStack.getAlarmTopic(),
      description: "Creates CloudWatch metric filter and alarm and associates the SNS topic with the alarm."
    });
  }
}
