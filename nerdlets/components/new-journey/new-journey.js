import React, { Component } from 'react';
import ActiveSteps from './active-steps';
import { StepOne, StepTwo, StepThree, StepFour, StepFive } from './steps-forms';

export default class NewJourney extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentStep: 0,
      initialValues: {
        title: undefined,
        funnel: {
          event: undefined,
          measure: undefined
        },
        accountId: 1606862,
        stats: [],
        steps: [],
        series: [],
        kpis: []
      }
    };
    //   initialValues: {
    //     title: 'Demo Journey 2',
    //     funnel: {
    //       event: 'PageView',
    //       measure: 'session'
    //     },
    //     accountId: 1606862,
    //     stats: [
    //       {
    //         label: 'Page views',
    //         ref: 'clickCount',
    //         type: 'integer',
    //         value: {
    //           nrql: "SELECT count(*) FROM PageView WHERE appName = 'WebPortal'",
    //           display: 'integer'
    //         }
    //       },
    //       {
    //         label: 'Sessions',
    //         ref: 'sessionCount',
    //         type: 'integer',
    //         value: {
    //           nrql:
    //             "FROM PageView SELECT uniqueCount(session) WHERE appName = 'WebPortal'",
    //           display: 'integer'
    //         }
    //       },
    //       {
    //         label: 'Error count',
    //         ref: 'errorCount',
    //         type: 'integer',
    //         value: {
    //           eventName: 'JavaScriptError',
    //           nrql:
    //             "SELECT count(*) FROM JavaScriptError WHERE appName = 'WebPortal'",
    //           display: 'integer'
    //         }
    //       },
    //       {
    //         label: 'Error rate',
    //         ref: 'errorRate',
    //         type: 'decimal',
    //         value: {
    //           calculation: { rate: ['errorCount', 'clickCount'] },
    //           display: 'percentage'
    //         }
    //       },
    //       {
    //         label: 'Avg perf',
    //         ref: 'averageDuration',
    //         type: 'decimal',
    //         value: {
    //           nrql:
    //             "FROM PageView SELECT average(duration) WHERE appName = 'WebPortal'",
    //           display: 'seconds'
    //         }
    //       },
    //       {
    //         label: '99th perc',
    //         ref: 'nnthPercentile',
    //         type: 'percentile',
    //         value: {
    //           nrql:
    //             "FROM PageView SELECT percentile(duration, 99) WHERE appName = 'WebPortal'",
    //           display: 'seconds'
    //         }
    //       }
    //     ],
    //     steps: [
    //       {
    //         id: 0,
    //         label: 'Homepage',
    //         nrqlWhere:
    //           "pageUrl = 'http://webportal.telco.nrdemo.com/' OR pageUrl = 'http://webportal.telco.nrdemo.com/index.html'",
    //         altNrql: {
    //           JavaScriptError:
    //             " requestUri = '/' or requestUri = '/index.html' "
    //         }
    //       },
    //       {
    //         id: 1,
    //         label: 'Plans',
    //         nrqlWhere:
    //           "pageUrl like 'http://webportal.telco.nrdemo.com/browse/plans%'",
    //         altNrql: {
    //           JavaScriptError: " requestUri like '/browse/plans%' "
    //         }
    //       },
    //       {
    //         id: 2,
    //         label: 'Cart',
    //         nrqlWhere:
    //           "pageUrl = 'http://webportal.telco.nrdemo.com/shoppingcart'",
    //         altNrql: {
    //           JavaScriptError: " requestUri like '/shoppingcart%' "
    //         }
    //       },
    //       {
    //         id: 3,
    //         label: 'Checkout',
    //         nrqlWhere: "pageUrl = 'http://webportal.telco.nrdemo.com/checkout'",
    //         altNrql: {
    //           JavaScriptError: " requestUri like '/checkout%' "
    //         }
    //       }
    //     ],
    //     series: [
    //       {
    //         id: 0,
    //         label: 'All Users',
    //         nrqlWhere: "appName = 'WebPortal'",
    //         altNrql: {
    //           JavaScriptError: " appName = 'WebPortal' "
    //         }
    //       },
    //       {
    //         id: 1,
    //         label: 'Columbus',
    //         nrqlWhere: "appName = 'WebPortal' and city = 'Columbus' "
    //       },
    //       {
    //         id: 2,
    //         label: 'Internet Explorer',
    //         nrqlWhere: " appName = 'WebPortal' and userAgentName = 'IE' ",
    //         altNrql: {
    //           JavaScriptError:
    //             " appName = 'WebPortal' and userAgentName = 'IE' "
    //         }
    //       }
    //     ],
    //     kpis: [
    //       {
    //         label: 'Error Rate',
    //         ref: 'errorRate',
    //         value: 3.0,
    //         bound: 'higherViolation',
    //         description:
    //           'If the error rate is higher that 3%, mark that as a notable.'
    //       },
    //       {
    //         label: 'Page views',
    //         ref: 'clickCount',
    //         value: 5.0,
    //         bound: 'percentage',
    //         description:
    //           'If the percentage change is plus or minus 10%, flag that.'
    //       },
    //       {
    //         label: 'Page Load Avg.',
    //         ref: 'averageDuration',
    //         value: 1,
    //         bound: 'lowerTarget',
    //         description: "We're targeting sub-second load times."
    //       }
    //     ]
    //   }
    // };
  }

  handlePrevClick = () => {
    this.setState(prevState => {
      if (prevState.currentStep === 0) {
        return {
          currentStep: prevState.currentStep
        };
      }

      return {
        currentStep: prevState.currentStep - 1
      };
    });
  };

  handleNextClick = () => {
    this.setState(prevState => {
      if (prevState.currentStep === 4) {
        return {
          currentStep: prevState.currentStep
        };
      }

      return {
        currentStep: prevState.currentStep + 1
      };
    });
  };

  renderSteps = () => {
    const { currentStep, initialValues } = this.state;

    let Component = null;
    switch (currentStep) {
      case 0:
        Component = StepOne;
        break;
      case 1:
        Component = StepTwo;
        break;
      case 2:
        Component = StepThree;
        break;
      case 3:
        Component = StepFour;
        break;
      case 4:
        Component = StepFive;
        break;
      default:
    }

    return (
      <Component
        initialValues={initialValues}
        currentStep={currentStep}
        handlePrevClick={this.handlePrevClick}
        handleNextClick={this.handleNextClick}
      />
    );
  };

  render() {
    const { currentStep } = this.state;
    return (
      <div className="new-journey">
        <h3>Create New Journey</h3>
        <ActiveSteps currentStep={currentStep} />
        {this.renderSteps()}
      </div>
    );
  }
}

NewJourney.propTypes = {};
