import { NestedStack } from "aws-cdk-lib";
import { ITopic, Topic } from "aws-cdk-lib/aws-sns";
import { EmailSubscription } from "aws-cdk-lib/aws-sns-subscriptions";
import { Construct } from "constructs";
import BaseNestedStackProps from "../../resources/types/BaseNestedStackProps";

interface SnsStackProps extends BaseNestedStackProps {
  emails: string[];
}

export class SnsStack extends NestedStack {
  private readonly alarmTopic: ITopic;

  public getAlarmTopic(): ITopic {
    return this.alarmTopic;
  }

  constructor(scope: Construct, id: string, props: SnsStackProps) {
    super(scope, id, props);

    const { envName, appName } = props;

    this.alarmTopic = new Topic(this, "alarm-topic", {
      displayName: `${envName}-${appName}-alarm-topic`,
      topicName: `${envName}-${appName}-alarm-topic`
    });

    props.emails.forEach(email => this.alarmTopic.addSubscription(new EmailSubscription(email)));
  }
}