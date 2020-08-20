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
            {/* <JourneyPicker
              journeys={journeyConfig}
              journey={journey}
              setJourney={this.setJourney}
            /> */}
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
                            {...journey}
                          />
                        </div>
                      </div>
                      {journey.series.map((series, i) => {
                        return (
                          <StatColumn
                            key={i}
                            column={series}
                            config={journey}
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
