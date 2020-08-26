# Journey configuration

The `journey configuration` is an array of objects that contain the following. See the [`examples`](examples) directory for more... examples of the files. Configuration is stored in `AccountStorage`.

| Name | Valid Values | Required by Parent | Description |
|---|---|---|---|
| id | numeric or uuid | true | Unique identifier for the Journey Config object. |
| title | string | true | The label that appears in the drop down in the upper left of the Journey Config Nerdlet. |
| accountId | numeric | true | The New Relic account identifier, used for scoping NRQL queries, etc. |
| funnel | JS Object | true | Specifies the `event` and `measure` for the NRQL funnel queries that make up the steps (rows) of the FunnelComponent visualization. |
| funnel.event | string | true | NRDB event used in the `FROM` portion of the NRQL query of the funnel. |
| funnel.measure | string | true | The attribute that is the focus of the NRDB funnel query. ex: `session` in `FROM PageView SELECT funnel(session, <WHERE clause>, <WHERE clause 2>)` |
| kpis | JS Array of Objects | false | List of performance measurements tied to the `stats` array by the `ref` value. |
| kpis[].ref | string | true | Reference that matches one of the values from the `stats[x].ref` values. |
| kpis[].label | string | true | Name of the KPI. |
| kpis[].description | string | false | Text describing the KPI. |
| kpis[].value | numeric | true | Value of the measurement. |
| kpis[].bound | [higherViolation, lowerViolation, higherTarget, lowerTarget, percentage] | true | Rule that governs the way the KPI is calculated, interpretted, and displayed in the UI. |
| series | JS Array of Objects | true/false | The series of columns (or cohorts) that are to be compared with one another in the rows (steps) of the visualization. |
| series[].id | numeric or uuid | true | Unique identifier. |
| series[].label | string | true | Label/name of the series. |
| series[].nrqlWhere | string | true | NRQL WHERE clause that defines this series / cohort. |
| series[].altNrql | JS Object | dependent on Stat configuration | A JS Object keyed by the name of an NRDB event. This data allows Stats to be configured (below in the `stats` array) that do not come from the primary  NRDB event. For instance, if you're calculating Error Rate, you might need to consult the `JavaScriptError` event, even though much of the funnel focuses on an event like `PageView`. See the [examples](examples) for further interrogation. |
| series[].altNrql.key | string | false | Refers to `stats[].value.eventName` which is NRDB event. |
| series[].altNrql.value | string | false | NRQL fragment used in WHERE clause. |
| steps | JS Array of Objects | true | The set of rows that comprise the `NRQL` Where clauses of the funnel query. |
| steps[].id | numeric or uuid | true | Unique identifier. |
| steps[].label | string | true | Label/name of the step. |
| steps[].nrqlWhere | string | true | NRQL WHERE clause that defines this step. |
| steps[].altNrql | JS Object | dependent on Stat configuration | A JS Object keyed by the name of an NRDB event. This data allows Stats to be configured (below in the `stats` array) that do not come from the primary  NRDB event. For instance, if you're calculating Error Rate, you might need to consult the `JavaScriptError` event, even though much of the funnel focuses on an event like `PageView`. See the [examples](examples) for further interrogation. |
| steps[].altNrql.key | string | false | Refers to `stats[].value.eventName` which is NRDB event. |
| steps[].altNrql.value | string | false | NRQL fragment used in WHERE clause. |
| stats | JS Array of Objects | true | The individual measures for a given column (Series) and row (Step). |
| stats[].id | numeric or uuid | true | Unique identifier |
| stats[].ref | string | true | Think of this like the variable name for use through the application in things like the calculations feature. As such, it need to be unique within a given journey. |
| stats[].label | string | true | Label/name of the measure. |
| stats[].type | [percentile, decimal, integer] | true | This defines how the stat will be processed and displayed. Decimals are rounded to 2 decimal pts. Integers are formatted into thousands. Percentile receive specific rules in the processing as well as custom display |
| stats[].value | JS Object | true | The object that contains the processing rules for a given Stat. It may be based on a NRQL query or a calculation based on other Stat objects. |
| stats[].value.nrql | string | false | Full NRQL statement to calculate a single value. |
| stats[].value.eventName | string | false | If this measure/stat is based on a different NRDB event then the one defined in funnel.event, this is where we declare that. This information is used to append the needed WHERE clauses from the `series` and `steps` to this stat. |
| stats[].value.display | [integer, seconds, percentage] | true | How should the output be formatted. |
| stats[].value.calculation | JS Object | false | If this Stat is a calculation - the mathematical result of two other stat values - this is where the rules for that calculation will be defined. First `ref (numerator)` value will be divided by the second `ref (denominator)` value. |
| stats[].value.calculation.numerator | string | false | Refers to `stats[].ref` and is a numerator |
| stats[].value.calculation.denominator | string | false | Refers to `stats[].ref` and is a denominator |

## About kpis

## About kpis[].bound

## About series

## About steps

## About stats[].value

## About stats[].value.calculation

