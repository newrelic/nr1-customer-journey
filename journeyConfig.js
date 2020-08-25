const journeyConfig = [
  {
    id: 0,
    title: 'Demo Journey 1',
    accountId: 1606862,
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
        value: 5.0,
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
        nrqlWhere: "appName = 'WebPortal'",
        altNrql: {
          key: 'JavaScriptError',
          value: " appName = 'WebPortal' "
        }
      },
      {
        id: 1,
        label: 'Columbus',
        nrqlWhere: "appName = 'WebPortal' and city = 'Columbus' "
      },
      {
        id: 2,
        label: 'Internet Explorer',
        nrqlWhere: " appName = 'WebPortal' and userAgentName = 'IE' ",
        altNrql: {
          key: 'JavaScriptError',
          value: " appName = 'WebPortal' and userAgentName = 'IE' "
        }
      }
    ],
    steps: [
      {
        id: 0,
        label: 'Homepage',
        nrqlWhere:
          "pageUrl = 'http://webportal.telco.nrdemo.com/' OR pageUrl = 'http://webportal.telco.nrdemo.com/index.html'",
        altNrql: {
          key: 'JavaScriptError',
          value: " requestUri = '/' or requestUri = '/index.html' "
        }
      },
      {
        id: 1,
        label: 'Plans',
        nrqlWhere:
          "pageUrl like 'http://webportal.telco.nrdemo.com/browse/plans%'",
        altNrql: {
          key: 'JavaScriptError',
          value: " requestUri like '/browse/plans%' "
        }
      },
      {
        id: 2,
        label: 'Cart',
        nrqlWhere: "pageUrl = 'http://webportal.telco.nrdemo.com/shoppingcart'",
        altNrql: {
          key: 'JavaScriptError',
          value: " requestUri like '/shoppingcart%' "
        }
      },
      {
        id: 3,
        label: 'Checkout',
        nrqlWhere: "pageUrl = 'http://webportal.telco.nrdemo.com/checkout'",
        altNrql: {
          key: 'JavaScriptError',
          value: " requestUri like '/checkout%' "
        }
      }
    ],
    stats: [
      {
        label: 'Page views',
        ref: 'clickCount',
        type: 'integer',
        value: {
          nrql: "SELECT count(*) FROM PageView WHERE appName = 'WebPortal'",
          display: 'integer'
        }
      },
      {
        label: 'Sessions',
        ref: 'sessionCount',
        type: 'integer',
        value: {
          nrql:
            "FROM PageView SELECT uniqueCount(session) WHERE appName = 'WebPortal'",
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
            "SELECT count(*) FROM JavaScriptError WHERE appName = 'WebPortal'",
          display: 'integer'
        }
      },
      {
        label: 'Error rate',
        ref: 'errorRate',
        type: 'decimal',
        value: {
          calculation: {
            nominator: 'errorCount',
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
            "FROM PageView SELECT average(duration) WHERE appName = 'WebPortal'",
          display: 'seconds'
        }
      },
      {
        label: '99th perc',
        ref: 'nnthPercentile',
        type: 'percentile',
        value: {
          nrql:
            "FROM PageView SELECT percentile(duration, 99) WHERE appName = 'WebPortal'",
          display: 'seconds'
        }
      }
    ]
  },

  {
    id: 1,
    title: 'Demo Journey 2',
    accountId: 1606862,
    funnel: {
      event: 'PageView',
      measure: 'session'
    },
    series: [
      {
        id: 0,
        label: 'All Users',
        nrqlWhere: "appName = 'WebPortal'",
        altNrql: {
          key: 'JavaScriptError',
          value: " appName = 'WebPortal' "
        }
      },
      {
        id: 1,
        label: 'Columbus',
        nrqlWhere: "appName = 'WebPortal' and city = 'Columbus' "
      },
      {
        id: 2,
        label: 'Internet Explorer',
        nrqlWhere: " appName = 'WebPortal' and userAgentName = 'IE' ",
        altNrql: {
          key: 'JavaScriptError',
          value: " appName = 'WebPortal' and userAgentName = 'IE' "
        }
      }
    ],
    steps: [
      {
        id: 0,
        label: 'Homepage',
        nrqlWhere:
          "pageUrl = 'http://webportal.telco.nrdemo.com/' OR pageUrl = 'http://webportal.telco.nrdemo.com/index.html'",
        altNrql: {
          key: 'JavaScriptError',
          value: " requestUri = '/' or requestUri = '/index.html' "
        }
      },
      {
        id: 1,
        label: 'Plans',
        nrqlWhere:
          "pageUrl like 'http://webportal.telco.nrdemo.com/browse/plans%'",
        altNrql: {
          key: 'JavaScriptError',
          value: " requestUri like '/browse/plans%' "
        }
      },
      {
        id: 2,
        label: 'Cart',
        nrqlWhere: "pageUrl = 'http://webportal.telco.nrdemo.com/shoppingcart'",
        altNrql: {
          key: 'JavaScriptError',
          value: " requestUri like '/shoppingcart%' "
        }
      },
      {
        id: 3,
        label: 'Checkout',
        nrqlWhere: "pageUrl = 'http://webportal.telco.nrdemo.com/checkout'",
        altNrql: {
          key: 'JavaScriptError',
          value: " requestUri like '/checkout%' "
        }
      }
    ],
    stats: [
      {
        label: 'Page views',
        ref: 'clickCount',
        type: 'integer',
        value: {
          nrql: "SELECT count(*) FROM PageView WHERE appName = 'WebPortal'",
          display: 'integer'
        }
      },
      {
        label: 'Sessions',
        ref: 'sessionCount',
        type: 'integer',
        value: {
          nrql:
            "FROM PageView SELECT uniqueCount(session) WHERE appName = 'WebPortal'",
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
            "SELECT count(*) FROM JavaScriptError WHERE appName = 'WebPortal'",
          display: 'integer'
        }
      },
      {
        label: 'Error rate',
        ref: 'errorRate',
        type: 'decimal',
        value: {
          calculation: {
            nominator: 'errorCount',
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
            "FROM PageView SELECT average(duration) WHERE appName = 'WebPortal'",
          display: 'seconds'
        }
      },
      {
        label: '99th perc',
        ref: 'nnthPercentile',
        type: 'percentile',
        value: {
          nrql:
            "FROM PageView SELECT percentile(duration, 99) WHERE appName = 'WebPortal'",
          display: 'seconds'
        }
      }
    ]
  }
];
export const getJourneys = () => {
  return journeyConfig;
};
