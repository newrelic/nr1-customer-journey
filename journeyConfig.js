const getJourneys = (entity) => {

}

const journeyConfig = [{
  id: 0,
  title: "Frontier Journey",
  accountId: 439634,
  funnel: {
    event: "Transaction",
    measure: "RopeID"
  },
  series: [
    {
      id: 0,
      label: "All Users",
      nrql: "appName='fr-redventures-frontier-sti-api'"
    },
    {
      id: 1,
      label: "Digital Cart",
      nrql: "appName='fr-redventures-frontier-sti-api' and ApplicationProfileID = '2071'"
    },
    {
      id: 2,
      label: "Telesales",
      nrql: "appName='fr-redventures-frontier-sti-api' and ApplicationProfileID = '2009'"
    }
  ],
  steps: [
    {
      id: 0,
      label: "Serviceable True",
      nrql:
        "name='WebTransaction/MVC/ServiceCheck/Post/{serviceCheck}'",
      altNrql: {
        // JavaScriptError: " requestUri = '/' or requestUri = '/index.html' "
      }
    },
    {
      id: 1,
      label: "Addons",
      nrql: "name='WebTransaction/MVC/AddOns/Post/{ropeData}'",
      altNrql: {
        // JavaScriptError: " requestUri like '/browse/plans%' "
      }
    },
    {
      id: 2,
      label: "Credit",
      nrql: "name='WebTransaction/MVC/CreditCheck/Post/{ropeData}'",
      altNrql: {
        // JavaScriptError: " requestUri like '/shoppingcart%' "
      }
    },
    {
      id: 3,
      label: "Order Submit",
      nrql: "name='WebTransaction/MVC/Order/Post/{ropeData}'",
      altNrql: {
        // JavaScriptError: " requestUri like '/checkout%' "
      }
    }
  ],
  stats: [{
    label: "Availability",
    ref: "stepAvailability",
    type: "decimal",
    value: {
      nrql: "SELECT percentage(count(*), WHERE error is NULL) FROM Transaction WHERE appName='fr-redventures-frontier-sti-api'",
      display: "percentage"
    }
  },
  {
    // label: "Page views",
    label: "Trans Count",
    ref: "transactionCount",
    type: "integer",
    value: {
      nrql: "SELECT count(*) FROM Transaction WHERE appName='fr-redventures-frontier-sti-api'",
      display: "integer"
    }
  },
  {
    label: "Error count",
    ref: "errorCount",
    type: "integer",
    value: {
      eventName: "Transaction Error",
      nrql: "SELECT count(*) from Transaction WHERE appName = 'fr-redventures-frontier-sti-api' AND error IS NOT NULL",
      display: "integer"
    }
  },
  {
    label: "Error rate",
    ref: "errorRate",
    type: "decimal",
    value: {
      calculation: { rate: ["errorCount", "transactionCount"] },
      display: "percentage"
    }
  },
    // {
    //   label: "Avg perf",
    //   ref: "averageDuration",
    //   type: "decimal",
    //   value: {
    //     nrql: "FROM PageView SELECT average(duration) WHERE appName = 'WebPortal'",
    //     display: "seconds"
    //   }
    // },
    // {
    //   label: "99th perc",
    //   ref: "nnthPercentile",
    //   type: "percentile",
    //   value: {
    //     nrql: "FROM PageView SELECT percentile(duration, 99) WHERE appName = 'WebPortal'",
    //     display: "seconds"
    //   }
    // }
  ]
}];
export default journeyConfig;