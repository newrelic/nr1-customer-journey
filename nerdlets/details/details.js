import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  GridItem,
  ChartGroup,
  BillboardChart,
  LineChart,
  HeadingText,
  BlockText
} from 'nr1';
import { timeRangeToNrql } from '@newrelic/nr1-community';

export default class Details extends React.Component {
  static propTypes = {
    platformUrlState: PropTypes.object.isRequired,
    nerdletUrlState: PropTypes.object.isRequired
  };

  render() {
    const { platformUrlState, nerdletUrlState } = this.props;
    const sinceStatement = timeRangeToNrql(platformUrlState);
    const agoStatement = sinceStatement.split('SINCE')[1];
    const { selectedColumn, selectedJourney, selectedStep } = nerdletUrlState;
    const journey = selectedJourney;
    const column = journey.series.find(s => s.id === selectedColumn);
    const step = journey.steps.find(s => s.id === selectedStep);
    let { stats, kpis } = journey;

    stats = stats.filter(s => {
      return s.value.nrql;
    });

    if (kpis) {
      kpis = kpis
        .filter(kpi => stats.find(s => s.ref === kpi.ref))
        .map(kpi => {
          kpi.stat = stats.find(s => s.ref === kpi.ref);
          kpi.nrql = `${kpi.stat.value.nrql} AND (${column.nrqlWhere}) AND (${
            step.nrqlWhere
          }) ${
            kpi.altNrql ? `AND (${kpi.altNrql}) ` : ''
          } ${sinceStatement} COMPARE WITH ${agoStatement}`;
          return kpi;
        });
    }

    return (
      <ChartGroup>
        <Grid style={{ margin: '20px' }}>
          <GridItem columnSpan={12}>
            <HeadingText
              type="heading-3"
              className="detailPaneHeader customerJourneyBreadcrumbs"
            >
              <span className="customerJourneyBreadcrumb">{journey.title}</span>
              <span className="customerJourneyBreadcrumb">{column.label}</span>
              <span className="customerJourneyBreadcrumb">{step.label}</span>
            </HeadingText>
          </GridItem>
          {kpis && (
            <GridItem columnSpan={12}>
              <HeadingText>KPI's</HeadingText>
            </GridItem>
          )}
          {kpis &&
            kpis.map((kpi, i) => {
              return (
                <GridItem key={i} columnSpan={4} className="chartContainer">
                  <HeadingText type="heading-3">{kpi.label}</HeadingText>
                  <BillboardChart
                    accountId={journey.accountId}
                    query={kpi.nrql}
                    className="chart"
                  />
                  <BlockText>{kpi.description}</BlockText>
                </GridItem>
              );
            })}
          <GridItem columnSpan={12}>
            <HeadingText className="timeSeriesHeading">
              Timeseries Data
            </HeadingText>
            <BlockText className="timePeriodText">
              {timeRangeToNrql(platformUrlState)}
            </BlockText>
          </GridItem>
          {stats.map((stat, i) => {
            let query = null;
            if (stat.value.nrql.eventName === step.altNrql.key) {
              query = `${stat.value.nrql} AND (${step.altNrql.value}) AND (${column.nrqlWhere}) TIMESERIES ${sinceStatement} COMPARE WITH ${agoStatement}`;
            } else {
              query = `${stat.value.nrql} AND (${step.nrqlWhere}) AND (${column.nrqlWhere}) TIMESERIES ${sinceStatement} COMPARE WITH ${agoStatement}`;
            }
            return (
              <GridItem key={i} columnSpan={4} className="chartContainer">
                <HeadingText type="heading-3">{stat.label}</HeadingText>
                <LineChart
                  accountId={journey.accountId}
                  query={query}
                  className="chart"
                />
              </GridItem>
            );
          })}
        </Grid>
      </ChartGroup>
    );
  }
}
