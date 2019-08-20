import React from 'react';
import PropTypes from 'prop-types';
import { LineChart, HeadingText } from "nr1";
import journeyConfig from '../../journeyConfig';

export default class Details extends React.Component {
  static propTypes = {
    launcherUrlState: PropTypes.object.isRequired,
    nerdletUrlState: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    console.debug("Journey Details", props);
  }

  render() {
    const { duration } = this.props.launcherUrlState.timeRange;
    const durationInMinutes = duration / 60 / 1000;
    const { selectedColumn, selectedJourney, selectedStep } = this.props.nerdletUrlState;
    const journey = journeyConfig.find(j => j.id == selectedJourney);
    const column = journey.series.find(s => s.id == selectedColumn);
    const step = journey.steps.find(s => s.id == selectedStep);
    let { stats } = journey;
    stats = stats.filter(s => s.value.nrql);
    return (
      <React.Fragment>
        <HeadingText type='heading3' className="detailPaneHeader customerJourneyBreadcrumbs">
          <span className="customerJourneyBreadcrumb">{journey.title}</span>
          <span className="customerJourneyBreadcrumb">{column.label}</span>
          <span className="customerJourneyBreadcrumb">{step.label}</span>
        </HeadingText>
        <div className="chartGrid">
          {stats.map((stat, i) => {
            const query =
              stat.value.nrql +
              ` AND (${step.nrql}) AND (${
              column.nrql
              }) TIMESERIES SINCE ${durationInMinutes} MINUTES AGO COMPARE WITH ${durationInMinutes *
              2} MINUTES AGO`
            console.debug(query)
            return (
              <div key={i} className="chart">
                <HeadingText type="heading5" className="chartName">
                  {stat.label}
                </HeadingText>
                <LineChart accountId={journey.accountId} query={query} />
              </div>
            )
          })}
        </div>
      </React.Fragment>
    )
    //return <div></div>
  }
}
