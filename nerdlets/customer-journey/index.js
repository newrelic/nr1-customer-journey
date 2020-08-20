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

  handleAccountSelect = async accountId => {
    this.setState({});

    const { data } = await AccountStorageQuery.query({
      accountId,
      collection: CUSTOMER_JOURNEY_CONFIGS
    });
    console.log('Wrapper -> data', data);

    this.setState({
      selectedAccountId: accountId,
      journeys: data,
      currentJourney: data.length > 0 ? data[0].id : undefined
    });
  };

  handleFormOpen = () => {
    this.setState(prevState => ({
      isFormOpen: !prevState.isFormOpen
    }));
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
  };

  handleJourneyChange = selectedJourney => {
    this.setState({
      currentJourney: selectedJourney
    });
  };

  render() {
    const {
      selectedJourney,
      isFormOpen,
      selectedAccountId,
      journeys,
      currentJourney
    } = this.state;

    console.log('render -> currentJourney', currentJourney);

    const journey = selectedJourney
      ? journeyConfig.find(j => j.id === selectedJourney.id)
      : journeyConfig[0];

    return (
      <div className="customer-journey">
        <div className="customer-journey__toolbar">
          <div>
            <AccountPicker accountChangedCallback={this.handleAccountSelect} />
            <JourneyPicker
              journeys={journeyConfig}
              journey={journey}
              setJourney={this.setJourney}
            />
          </div>
          <Button
            onClick={this.handleFormOpen}
            type={Button.TYPE.PRIMARY}
            iconType={Button.ICON_TYPE.DOCUMENTS__DOCUMENTS__NOTES__A_ADD}
          >
            Add new Journey
          </Button>
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
              {journeys.map(({ id, document: { title } }) => (
                <li
                  className={`list__item ${
                    currentJourney === id ? 'list__item--active' : ''
                  }`}
                  key={id}
                  onClick={() => this.handleJourneyChange(id)}
                >
                  {title}
                </li>
              ))}
            </ul>
          </div>
          <PlatformStateContext.Consumer>
            {platformUrlState =>
              isFormOpen ? (
                <NewJourney
                  handleOnSave={this.handleOnSave}
                  accountId={selectedAccountId}
                />
              ) : (
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
            }
          </PlatformStateContext.Consumer>
        </div>
      </div>
    );
  }
}
