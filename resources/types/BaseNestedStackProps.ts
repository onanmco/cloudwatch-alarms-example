import { NestedStackProps } from "aws-cdk-lib";

export default interface BaseNestedStackProps extends NestedStackProps {
  envName: string;
  appName: string;
}