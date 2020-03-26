import React from 'react';
import { PlatformStateContext } from 'nr1';
import StatColumn from './StatColumn';
import { getJourneys } from '../../journeyConfig';
import JourneyPicker from './JourneyPicker';
import { FunnelComponent } from 'nr1-funnel-component';

const journeyConfig = getJourneys();

export default class Wrapper extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      selectedJourney: journeyConfig[0].id
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

  render() {
    const { selectedJourney } = this.state;
    const journey = selectedJourney
      ? journeyConfig.find(j => j.id === selectedJourney.id)
      : journeyConfig[0];

    return (
      <div className="customerJourneyContainer">
        <div className="journeySelectFormContainer">
          <JourneyPicker
            journeys={journeyConfig}
            journey={journey}
            setJourney={this.setJourney}
          />
        </div>
        <PlatformStateContext.Consumer>
          {platformUrlState => (
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
          )}
        </PlatformStateContext.Consumer>
      </div>
    );
  }
}
