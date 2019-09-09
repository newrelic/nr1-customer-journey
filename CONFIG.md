# Configure the `journeyConfig.js`

The `journeyConfig` is an array of objects that contain the following. SEee the `examples` directory for more... examples.

| Name  | Valid Values  | Required by Parent  | Description  |
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
| kpis[].bound | [higher,lower, percentage] | true | Rule that governs the way the KPI is calculated or interpretted. |
| kpis[].bound | [higher,lower, percentage] | true | Rule that governs the way the KPI is calculated or interpretted. |
| series | JS Array of Objects | true/false |  |
| series[].id | numeric or uuid | true |  |
| series[].label | string | true |  |
| series[].nrql | string | true |  |
| steps | JS Array of Objects | true |  |
| steps[].id | numeric or uuid | true |  |
| steps[].label | string | true |  |
| steps[].nrql | string | true |  |
| steps[].altNrql | string | false |  |
| stats | JS Array of Objects | true |  |
| stats[].id | numeric or uuid | true |  |
| stats[].ref | string | true |  |
| stats[].label | string | true |  |
| steps[].type | string | true |  |
| steps[].value | JS Object | true |  |
| steps[].value.nrql | string | false |  |
| steps[].value.eventName | string | false |  |
| steps[].value.display | string | false |  |
| steps[].value.calculation | string | false |  |
| steps[].value.calculation.rate | JS Array of 2 strings referencing other `stats[].ref` values for a calculation. | true |  |

## About kpis

## About kpis[].bound

## About series

## About steps

## About stats[].value

## About stats[].value.calculation

