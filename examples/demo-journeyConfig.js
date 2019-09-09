const getJourneys = (entity) => {

}

const journeyConfig = [{
  id: 0,
  title: "Demo Journey",
  accountId: 1606862,
  funnel: {
    event: "PageView",
    measure: "session"
  },
  series: [
    {
      id: 0,
      label: "All Users",
      nrql: "appName = 'WebPortal'"
    },
    {
      id: 1,
      label: "Columbus",
      nrql: "appName = 'WebPortal' and city = 'Columbus'"
    },
    {
      id: 2,
      label: "Internet Explorer",
      nrql: "appName = 'WebPortal' and userAgentName = 'IE'"
    }
  ],
  steps: [
    {
      id: 0,
      label: "Homepage",
      nrql:
        "pageUrl = 'http://webportal.telco.nrdemo.com/' OR pageUrl = 'http://webportal.telco.nrdemo.com/index.html'",
      altNrql: {
        JavaScriptError: " requestUri = '/' or requestUri = '/index.html' "
      },
      kpis: [
        {
          name: "Error Rate",
          ref: "errorRate",
          value: 3.0,
          bound: "higher",
          description: "Serviceability Availability Percentage is Percent of Transactions without errors or response codes 2005, 1002, Nack 22, or -1",
        },
        {
          name: "Avg. Duration",
          ref: "averageDuration",
          value: 3.0,
          bound: "higher",
          description: "Lets look into why we'd have less than 100 service transactions",
        }
      ],
    },
    {
      id: 1,
      label: "Plans",
      nrql: "pageUrl like 'http://webportal.telco.nrdemo.com/browse/plans%'",
      altNrql: {
        JavaScriptError: " requestUri like '/browse/plans%' "
      }
    },
    {
      id: 2,
      label: "Cart",
      nrql: "pageUrl = 'http://webportal.telco.nrdemo.com/shoppingcart'",
      altNrql: {
        JavaScriptError: " requestUri like '/shoppingcart%' "
      }
    },
    {
      id: 3,
      label: "Checkout",
      nrql: "pageUrl = 'http://webportal.telco.nrdemo.com/checkout'",
      altNrql: {
        JavaScriptError: " requestUri like '/checkout%' "
      }
    }
  ],
  stats: [{
    label: "Page views",
    ref: "clickCount",
    type: "integer",
    value: {
      nrql: "SELECT count(*) from PageView WHERE appName = 'WebPortal'",
      display: "integer"
    }
  },
  {
    label: "Error count",
    ref: "errorCount",
    type: "integer",
    value: {
      eventName: "JavaScriptError",
      nrql: "SELECT count(*) from JavaScriptError WHERE appName = 'WebPortal'",
      display: "integer"
    }
  },
  {
    label: "Error rate",
    ref: "errorRate",
    type: "decimal",
    value: {
      calculation: { rate: ["errorCount", "clickCount"]},
      display: "percentage"
    }
  },
  {
    label: "Avg perf",
    ref: "averageDuration",
    type: "decimal",
    value: {
      nrql: "FROM PageView SELECT average(duration) WHERE appName = 'WebPortal'",
      display: "seconds"
    }
  },
  {
    label: "99th perc",
    ref: "nnthPercentile",
    type: "percentile",
    value: {
      nrql: "FROM PageView SELECT percentile(duration, 99) WHERE appName = 'WebPortal'",
      display: "seconds"
    }
  }]
}];
export default journeyConfig;