import React from 'react';
import PropTypes from 'prop-types';
import StatColumn from './StatColumn';
import journeyConfig from '../../journeyConfig';
import { FunnelComponent } from 'nr1-funnel-component';
//import testdata from "nr1-funnel-component/src/components/FunnelComponent/testdata";
import { Form, FormGroup, Label, Input } from 'reactstrap';

export default class CustomerJourney extends React.Component {
  static propTypes = {
    launcherUrlState: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    //console.debug([props, journeyConfig]); //eslint-disable-line
    this.state = {
      selectedJourney: null,
    };
  }

  render() {
    const { selectedJourney } = this.state;
    const { timeRange } = this.props.launcherUrlState;
    const journey = selectedJourney
      ? journeyConfig.find(j => j.id == selectedJourney)
      : journeyConfig[0];
    //console.debug(journey);

    return (
      <div className="customerJourneyContainer">
        <div className="journeySelectFormContainer">
          <Form className="journeySelectForm">
            <FormGroup>
              <Label>Select journey</Label>
              <Input
                type="select"
                onChange={e => {
                  console.log(e);
                  this.setState({ selectedJourney: e.target.value });
                }}
              >
                <option>----</option>
                {journeyConfig.map((config, i) => {
                  return (
                    <option key={i} value={config.id}>
                      {config.title}
                    </option>
                  );
                })}
              </Input>
            </FormGroup>
          </Form>
        </div>
        <div className="customerJourneyContent">
          <div className="visualizationContainer">
            <h3 className="columnHeader">Click Rate</h3>
            <div className="statCell visualizationCell">
              <FunnelComponent
                launcherUrlState={this.props.launcherUrlState}
                {...journey}
              />
            </div>
          </div>
          {journey.series.map((series, i) => {
            //console.log([series, journey, timeRange]);
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
