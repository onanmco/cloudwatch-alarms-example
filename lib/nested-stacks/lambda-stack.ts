import { NestedStack } from "aws-cdk-lib";
import { Architecture, IFunction, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import path from "path";
import BaseNestedStackProps from "../../resources/types/BaseNestedStackProps";

interface LambdaStackProps extends BaseNestedStackProps {}

export class LambdaStack extends NestedStack {
  private readonly sampleFunction: IFunction;

  public getSampleFunction(): IFunction {
    return this.sampleFunction;
  }

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const { envName, appName } = props;

    this.sampleFunction = new NodejsFunction(this, "sample-function", {
      architecture: Architecture.X86_64,
      runtime: Runtime.NODEJS_16_X,
      functionName: `${envName}-${appName}-sample-function`,
      entry: path.join(__dirname, "../../resources/functions/sample-function/app.ts"),
      handler: "lambdaHandler",
    });
  }
}