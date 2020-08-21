import React from 'react';
import {
  PlatformStateContext,
  AccountStorageMutation,
  AccountStorageQuery,
  Button,
  HeadingText
} from 'nr1';
import StatColumn from './StatColumn';
import { getJourneys } from '../../journeyConfig';
import JourneyPicker from './JourneyPicker';
import { FunnelComponent } from 'nr1-funnel-component';
import NewJourney from '../components/new-journey/new-journey';
import AccountPicker from '../components/account-picker';
import { v4 as uuidv4 } from 'uuid';

const journeyConfig = getJourneys();

const EXAMPLE_JOURNEY = {
  accountId: 1606862,
  funnel: { event: 'PageView', measure: 'session' },
  id: 'b3a115f1-065b-4743-81bd-1de1c10dd9a4',
  kpis: [
    {
      bound: 'higherViolation',
      description:
        'If the error rate is higher that 3%, mark that as a notable.',
      label: 'Error rate',
      ref: 'errorRate',
      value: '3.0'
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
      altNrql: {
        key: 'JavaScriptError',
        value: "appName = 'WebPortal'"
      },
      label: 'All Users',
      nrqlWhere: "appName = 'WebPortal'"
    },
    {
      id: 1,
      label: 'Columbus',
      nrqlWhere: "appName = 'WebPortal' and city = 'Columbus'"
    },
    {
      id: 2,
      altNrql: {
        key: 'JavaScriptError',
        value: "appName = 'WebPortal' and userAgentName = 'IE'"
      },
      label: 'Internet Explorer',
      nrqlWhere: "appName = 'WebPortal' and userAgentName = 'IE'"
    }
  ],
  stats: [
    {
      label: 'Page views',
      ref: 'clickCount',
      type: 'integer',
      value: {
        display: 'integer',
        nrql: "SELECT count(*) FROM PageView WHERE appName = 'WebPortal'"
      }
    },
    {
      label: 'Sessions',
      ref: 'sessionCount',
      type: 'integer',
      value: {
        display: 'integer',
        nrql:
          "FROM PageView SELECT uniqueCount(session) WHERE appName = 'WebPortal'"
      }
    },
    {
      label: 'Error count',
      ref: 'errorCount',
      type: 'integer',
      value: {
        display: 'integer',
        eventName: 'JavaScriptError',
        nrql: "SELECT count(*) FROM JavaScriptError WHERE appName = 'WebPortal'"
      }
    },
    {
      label: 'Error rate',
      ref: 'errorRate',
      type: 'decimal',
      value: {
        calculation: { rate: ['errorCount', 'clickCount'] },
        display: 'percentage'
      }
    },
    {
      label: 'Avg perf',
      ref: 'averageDuration',
      type: 'decimal',
      value: {
        display: 'seconds',
        nrql:
          "FROM PageView SELECT average(duration) WHERE appName = 'WebPortal'"
      }
    },
    {
      label: '99th perc',
      ref: 'nnthPercentile',
      type: 'percentile',
      value: {
        display: 'seconds',
        nrql:
          "FROM PageView SELECT percentile(duration, 99) WHERE appName = 'WebPortal'"
      }
    }
  ],
  steps: [
    {
      id: 0,
      altNrql: {
        key: 'JavaScriptError',
        value: "requestUri = '/' or requestUri = '/index.html'"
      },
      label: 'Homepage',
      nrqlWhere:
        "pageUrl = 'http://webportal.telco.nrdemo.com/' OR pageUrl = 'http://webportal.telco.nrdemo.com/index.html'"
    },
    {
      id: 1,
      altNrql: {
        key: 'JavaScriptError',
        value: "requestUri like '/browse/plans%'"
      },
      label: 'Plans',
      nrqlWhere:
        "pageUrl like 'http://webportal.telco.nrdemo.com/browse/plans%'"
    },
    {
      id: 2,
      altNrql: {
        key: 'JavaScriptError',
        value: "requestUri like '/shoppingcart%'"
      },
      label: 'Cart',
      nrqlWhere: "pageUrl = 'http://webportal.telco.nrdemo.com/shoppingcart'"
    },
    {
      id: 3,
      altNrql: {
        key: 'JavaScriptError',
        value: "requestUri like '/checkout%'"
      },
      label: 'Checkout',
      nrqlWhere: "pageUrl = 'http://webportal.telco.nrdemo.com/checkout'"
    }
  ],
  title: 'Demo Journey 1'
};

const CUSTOMER_JOURNEY_CONFIGS = 'CUSTOMER_JOURNEY_CONFIGS';
// const CUSTOMER_JOURNEY_CONFIGS_ID = 'CUSTOMER_JOURNEY_CONFIGS_V1';

export default class Wrapper extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedJourney: journeyConfig[0].id,
      isFormOpen: false,
      selectedAccountId: undefined,
      journeys: [],
      currentJourney: undefined
    };

    this.setJourney = this.setJourney.bind(this);
  }

  setJourney(journey) {
    this.setState({ selectedJourney: journey });
  }

  renderStepsClass() {
    const numberOfSteps = journeyConfig[0].steps.length;

    if (numberOfSteps === 3) {
      return 'three-step-visualization';
    } else if (numberOfSteps === 5) {
      return 'five-step-visualization';
    } else if (numberOfSteps === 6) {
      return 'six-step-visualization';
    } else if (numberOfSteps === 7) {
      return 'seven-step-visualization';
    } else if (numberOfSteps === 8) {
      return 'eight-step-visualization';
    } else if (numberOfSteps === 9) {
      return 'nine-step-visualization';
    } else if (numberOfSteps === 10) {
      return 'ten-step-visualization';
    } else {
      return '';
    }
  }

  loadData = async () => {
    const { selectedAccountId } = this.state;
    const { data } = await AccountStorageQuery.query({
      accountId: selectedAccountId,
      collection: CUSTOMER_JOURNEY_CONFIGS
    });
    console.log(
      'Wrapper -> loadData -> data',
      JSON.stringify(data[0].document)
    );

    this.setState({
      journeys: data,
      currentJourney: data.length > 0 ? data[0].id : undefined
    });
  };

  handleAccountSelect = async accountId => {
    // await AccountStorageMutation.mutate({
    //   documentId: 'CUSTOMER_JOURNEY_CONFIGS_V1',
    //   accountId: 1606862,
    //   collection: CUSTOMER_JOURNEY_CONFIGS,
    //   actionType: AccountStorageMutation.ACTION_TYPE.DELETE_DOCUMENT
    // });

    this.setState(
      {
        selectedAccountId: accountId
      },
      () => {
        this.loadData();
      }
    );
  };

  handleFormOpen = () => {
    this.setState({ isFormOpen: true });
  };

  handleOnSave = async journey => {
    const { selectedAccountId } = this.state;
    journey.accountId = selectedAccountId;
    if (!journey.id) {
      journey.id = uuidv4();
    }

    await AccountStorageMutation.mutate({
      accountId: selectedAccountId,
      actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
      collection: CUSTOMER_JOURNEY_CONFIGS,
      documentId: journey.id,
      document: journey
    });

    this.setState({ isFormOpen: false, journeyToBeEdited: undefined });

    this.loadData();
  };

  handleJourneyChange = selectedJourney => {
    this.setState({
      currentJourney: selectedJourney
    });
  };

  handleOnEdit = journey => {
    this.setState({
      journeyToBeEdited: journey,
      isFormOpen: true
    });
  };

  handleCancel = () => {
    this.setState({ isFormOpen: false, journeyToBeEdited: undefined });
  };

  render() {
    const {
      isFormOpen,
      journeys,
      currentJourney,
      journeyToBeEdited
    } = this.state;

    const journey = journeys.find(journey => journey.id === currentJourney)
      ?.document;

    return (
      <div className="customer-journey">
        <div className="customer-journey__toolbar">
          <div>
            <AccountPicker accountChangedCallback={this.handleAccountSelect} />
          </div>
          {!isFormOpen && (
            <Button
              onClick={this.handleFormOpen}
              type={Button.TYPE.PRIMARY}
              iconType={Button.ICON_TYPE.DOCUMENTS__DOCUMENTS__NOTES__A_ADD}
            >
              Add new Journey
            </Button>
          )}
        </div>
        <div className="main-container">
          <div className="left-sidebar">
            <HeadingText
              className="left-sidebar__heading"
              type={HeadingText.TYPE.HEADING_3}
            >
              JOURNEYS
            </HeadingText>
            <ul className="left-sidebar__list">
              {journeys.map(({ id, document, document: { title } }) => (
                <li
                  className={`list__item ${
                    currentJourney === id ? 'list__item--active' : ''
                  }`}
                  key={id}
                  onClick={() => this.handleJourneyChange(id)}
                >
                  <p>{title}</p>
                  <Button
                    className="edit-button"
                    sizeType={Button.SIZE_TYPE.SMALL}
                    type={Button.TYPE.NORMAL}
                    onClick={() => this.handleOnEdit(document)}
                  >
                    EDIT
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <PlatformStateContext.Consumer>
            {platformUrlState =>
              isFormOpen ? (
                <NewJourney
                  handleCancel={this.handleCancel}
                  handleOnSave={this.handleOnSave}
                  journey={journeyToBeEdited}
                />
              ) : (
                journey && (
                  <div>
                    <div className="customerJourneyContent">
                      <div className="visualizationContainer">
                        <h3 className="columnHeader">Click Rate</h3>
                        <div
                          className={`statCell visualizationCell ${this.renderStepsClass()}`}
                        >
                          <FunnelComponent
                            launcherUrlState={platformUrlState}
                            {...EXAMPLE_JOURNEY}
                            // {...journey}
                          />
                        </div>
                      </div>
                      {EXAMPLE_JOURNEY.series.map((series, i) => {
                        return (
                          <StatColumn
                            key={i}
                            column={series}
                            // config={journey}
                            config={EXAMPLE_JOURNEY}
                            platformUrlState={platformUrlState}
                          />
                        );
                      })}
                    </div>
                  </div>
                )
              )
            }
          </PlatformStateContext.Consumer>
        </div>
      </div>
    );
  }
}
