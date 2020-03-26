import React from 'react';
import PropTypes from 'prop-types';
import StatColumn from './StatColumn';
import { getJourneys } from '../../journeyConfig';
import JourneyPicker from './JourneyPicker';
import { FunnelComponent } from 'nr1-funnel-component';

const journeyConfig = getJourneys();

export default class CustomerJourney extends React.Component {
  static propTypes = {
    launcherUrlState: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    // console.debug([props, journeyConfig]); //eslint-disable-line

    this.state = {
      selectedJourney: this.props.launcherUrlState.selectedJourney
        ? this.props.launcherUrlState.selectedJourney
        : journeyConfig[0].id
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
    const { timeRange } = this.props.launcherUrlState;
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
        <div className="customerJourneyContent">
          <div className="visualizationContainer">
            <h3 className="columnHeader">Click Rate</h3>
            <div
              className={`statCell visualizationCell ${this.renderStepsClass()}`}
            >
              <FunnelComponent
                launcherUrlState={this.props.launcherUrlState}
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
                timeRange={timeRange}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
