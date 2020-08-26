const journeyConfig = [
  {
    id: 0,
    title: 'Demo Journey',
    accountId: 1,
    funnel: {
      event: 'PageView',
      measure: 'session'
    },
    kpis: [
      {
        label: 'Error Rate',
        ref: 'errorRate',
        value: 3.0,
        bound: 'higherViolation',
        description:
          'If the error rate is higher that 3%, mark that as a notable.'
      },
      {
        label: 'Page views',
        ref: 'clickCount',
        value: 10,
        bound: 'percentage',
        description: 'If the percentage change is plus or minus 10%, flag that.'
      },
      {
        label: 'Page Load Avg.',
        ref: 'averageDuration',
        value: 1,
        bound: 'lowerTarget',
        description: "We're targeting sub-second load times."
      }
    ],
    series: [
      {
        id: 0,
        label: 'All Users',
        nrqlWhere: "appName = 'Alerting UI - Production'",
        altNrql: {
          key: 'JavaScriptError',
          value: " appName = 'Alerting UI - Production' "
        }
      },
      {
        id: 1,
        label: 'Indianapolis',
        nrqlWhere:
          "appName = 'Alerting UI - Production' and city = 'Indianapolis' "
      },
      {
        id: 2,
        label: 'Firefox',
        nrqlWhere:
          " appName = 'Alerting UI - Production' and userAgentName = 'Firefox' ",
        altNrql: {
          key: 'JavaScriptError',
          value:
            " appName = 'Alerting UI - Production' and userAgentName = 'Firefox' "
        }
      }
    ],
    steps: [
      {
        id: 0,
        label: 'Accounts',
        nrqlWhere: "pageUrl like 'https://alerts.newrelic.com/accounts/%'",
        altNrql: {
          key: 'JavaScriptError',
          value: " requestUri like '/accounts/%' "
        }
      },
      {
        id: 1,
        label: 'Incidents',
        nrqlWhere:
          "pageUrl like 'https://alerts.newrelic.com/accounts/%/incidents'",
        altNrql: {
          key: 'JavaScriptError',
          value: " requestUri like '/accounts/%/incidents' "
        }
      },
      {
        id: 2,
        label: 'Incident Details',
        nrqlWhere:
          "pageUrl = 'https://alerts.newrelic.com/accounts/1351150/incidents/%'",
        altNrql: {
          key: 'JavaScriptError',
          value: " requestUri like '/accounts/%/incidents/%%' "
        }
      }
    ],
    stats: [
      {
        label: 'Page views',
        ref: 'clickCount',
        type: 'integer',
        value: {
          nrql:
            "SELECT count(*) FROM PageView WHERE appName = 'Alerting UI - Production'",
          display: 'integer'
        }
      },
      {
        label: 'Sessions',
        ref: 'sessionCount',
        type: 'integer',
        value: {
          nrql:
            "FROM PageView SELECT uniqueCount(session) WHERE appName = 'Alerting UI - Production'",
          display: 'integer'
        }
      },
      {
        label: 'Error count',
        ref: 'errorCount',
        type: 'integer',
        value: {
          eventName: 'JavaScriptError',
          nrql:
            "SELECT count(*) FROM JavaScriptError WHERE appName = 'Alerting UI - Production'",
          display: 'integer'
        }
      },
      {
        label: 'Error rate',
        ref: 'errorRate',
        type: 'decimal',
        value: {
          calculation: {
            numerator: 'errorCount',
            denominator: 'clickCount'
          },
          display: 'percentage'
        }
      },
      {
        label: 'Avg perf',
        ref: 'averageDuration',
        type: 'decimal',
        value: {
          nrql:
            "FROM PageView SELECT average(duration) WHERE appName = 'Alerting UI - Production'",
          display: 'seconds'
        }
      },
      {
        label: '99th perc',
        ref: 'nnthPercentile',
        type: 'percentile',
        value: {
          nrql:
            "FROM PageView SELECT percentile(duration, 99) WHERE appName = 'Alerting UI - Production'",
          display: 'seconds'
        }
      }
    ]
  }
];
export const getJourneys = () => {
  return journeyConfig;
};
