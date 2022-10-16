import { Duration, NestedStack } from "aws-cdk-lib";
import { Alarm, ComparisonOperator, Metric, Unit } from "aws-cdk-lib/aws-cloudwatch";
import { SnsAction } from "aws-cdk-lib/aws-cloudwatch-actions";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { FilterPattern, LogGroup } from "aws-cdk-lib/aws-logs";
import { ITopic } from "aws-cdk-lib/aws-sns";
import { Construct } from "constructs";
import BaseNestedStackProps from "../../resources/types/BaseNestedStackProps";

interface CloudWatchStackProps extends BaseNestedStackProps {
  sampleFunction: IFunction;
  alarmTopic: ITopic;
}

export class CloudWatchStack extends NestedStack {
  constructor(scope: Construct, id: string, props: CloudWatchStackProps) {
    super(scope, id, props);

    const { envName, appName } = props;
    
    const logGroup = new LogGroup(this, "log-group", {
        logGroupName: `/aws/lambda/${props.sampleFunction.functionName}`
      });

    const metric = new Metric({
      metricName: `${envName}-${appName}-custom-error-metric`,
      namespace: `${envName}-${appName}-error-metrics`,
      period: Duration.minutes(1),
      statistic: "sum",
      unit: Unit.NONE
    });

    logGroup.addMetricFilter("metric-filter", {
      filterPattern: FilterPattern.stringValue("$.errorType", "=", "CustomError"),
      metricName: metric.metricName,
      metricNamespace: metric.namespace,
      metricValue: "1"
    })

    const alarm = new Alarm(this, "custom-error-alarm", {
      alarmName: `${envName}-${appName}-custom-error-alarm`,
      alarmDescription: "Send notifications when applications produce CustomError.",
      metric: metric,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
      threshold: 0,
      datapointsToAlarm: 1,
      evaluationPeriods: 1,
      actionsEnabled: true
    });

    alarm.addAlarmAction(new SnsAction(props.alarmTopic));
  }
}