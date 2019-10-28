const journeyConfig = [
  {
    id: 0,
    title: 'Frontier Journey',
    accountId: 439634,
    funnel: {
      event: 'Transaction',
      measure: 'RopeID'
    },
    series: [
      {
        id: 0,
        label: 'All Users',
        nrqlWhere: "appName='fr-redventures-frontier-sti-api'"
      },
      {
        id: 1,
        label: 'Digital Cart',
        nrqlWhere:
          "appName='fr-redventures-frontier-sti-api' and ApplicationProfileID = '2071'"
      },
      {
        id: 2,
        label: 'Telesales',
        nrqlWhere:
          "appName='fr-redventures-frontier-sti-api' and ApplicationProfileID = '2009'"
      }
    ],
    kpis: [
      {
        label: 'Availability',
        ref: 'stepAvailability',
        value: 90.0,
        bound: 'lowerViolation',
        description:
          'Serviceability Availability Percentage is Percent of Transactions without errors or response codes 2005, 1002, Nack 22, or -1'
      },
      {
        label: 'Minimum Transactions',
        ref: 'transactionCount',
        value: 100,
        bound: 'lowerViolation',
        description:
          "Lets look into why we'd have less than 100 service transactions"
      }
    ],
    steps: [
      {
        id: 0,
        label: 'Serviceable True',
        nrqlWhere: "name='WebTransaction/MVC/ServiceCheck/Post/{serviceCheck}'",
        altNrql: {
          Availability:
            "ServiceabilityResponseCode NOT IN('2005', '1002', 'NACK022','-1')"
          // JavaScriptError: " requestUri = '/' or requestUri = '/index.html' "
        }
      },
      {
        id: 1,
        label: 'Addons',
        nrqlWhere: "name='WebTransaction/MVC/AddOns/Post/{ropeData}'",
        altNrql: {
          // JavaScriptError: " requestUri like '/browse/plans%' "
        }
      },
      {
        id: 2,
        label: 'Credit',
        nrqlWhere: "name='WebTransaction/MVC/CreditCheck/Post/{ropeData}'",
        altNrql: {
          Availability:
            "CreditResponseCode NOT IN('3021', '1002', '3016', '1001', '3009', '3024', '1084')"
          // JavaScriptError: " requestUri like '/shoppingcart%' "
        }
      },
      {
        id: 3,
        label: 'Order Submit',
        nrqlWhere: "name='WebTransaction/MVC/Order/Post/{ropeData}'",
        altNrql: {
          Availability:
            "errorMessage NOT IN('Response Description: Order Processing Error: Payment contains invalid information, please verify credit card billing address and account number.','Response Description: Order Processing Error: Payment Declined')"
          // JavaScriptError: " requestUri like '/checkout%' "
        }
      }
    ],
    stats: [
      {
        label: 'Availability',
        ref: 'stepAvailability',
        type: 'decimal',
        value: {
          eventName: 'Availability',
          nrql:
            "SELECT percentage(count(*), WHERE error is NULL) FROM Transaction WHERE appName='fr-redventures-frontier-sti-api'",
          display: 'percentage'
        }
      },
      {
        label: 'Trans Count',
        ref: 'transactionCount',
        type: 'integer',
        value: {
          nrql:
            "SELECT count(*) FROM Transaction WHERE appName='fr-redventures-frontier-sti-api'",
          display: 'integer'
        }
      },
      {
        label: 'Error count',
        ref: 'errorCount',
        type: 'integer',
        value: {
          eventName: 'Transaction Error',
          nrql:
            "SELECT count(*) from Transaction WHERE appName = 'fr-redventures-frontier-sti-api' AND error IS NOT NULL",
          display: 'integer'
        }
      },
      {
        label: 'Error rate',
        ref: 'errorRate',
        type: 'decimal',
        value: {
          calculation: { rate: ['errorCount', 'transactionCount'] },
          display: 'percentage'
        }
      }
    ]
  }
];

export const getJourneys = entity => {
  return journeyConfig;
};
