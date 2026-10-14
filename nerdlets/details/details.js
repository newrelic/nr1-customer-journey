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
import { timeRangeToNrql } from '@newrelic/nr-labs-components';

const Details = ({ platformUrlState, nerdletUrlState }) => {
  const sinceStatement = timeRangeToNrql(platformUrlState);
  const agoStatement = sinceStatement.split('SINCE')[1];
  const {
    selectedColumn,
    selectedJourney: journey,
    selectedStep
  } = nerdletUrlState;
  const column = journey.series.find(s => s.id === selectedColumn);
  const step = journey.steps.find(s => s.id === selectedStep);
  const stats = journey.stats.filter(s => s.value.nrql);

  const kpis = journey.kpis
    ?.filter(kpi => stats.find(s => s.ref === kpi.ref))
    .map(kpi => {
      const stat = stats.find(s => s.ref === kpi.ref);
      return {
        ...kpi,
        stat,
        nrql: `${stat.value.nrql} AND (${column.nrqlWhere}) AND (${
          step.nrqlWhere
        }) ${
          kpi.altNrql ? `AND (${kpi.altNrql}) ` : ''
        } ${sinceStatement} COMPARE WITH ${agoStatement}`
      };
    });

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
            <HeadingText>{"KPI's"}</HeadingText>
          </GridItem>
        )}
        {kpis &&
          kpis.map((kpi, i) => (
            <GridItem key={i} columnSpan={4} className="chartContainer">
              <HeadingText type="heading-3">{kpi.label}</HeadingText>
              <BillboardChart
                accountId={journey.accountId}
                query={kpi.nrql}
                className="chart"
              />
              <BlockText>{kpi.description}</BlockText>
            </GridItem>
          ))}
        <GridItem columnSpan={12}>
          <HeadingText className="timeSeriesHeading">
            Timeseries Data
          </HeadingText>
          <BlockText className="timePeriodText">{sinceStatement}</BlockText>
        </GridItem>
        {stats.map((stat, i) => {
          const stepWhere =
            stat.value.eventName && stat.value.eventName === step.altNrql?.key
              ? step.altNrql.value
              : step.nrqlWhere;
          const query = `${stat.value.nrql} AND (${stepWhere}) AND (${column.nrqlWhere}) TIMESERIES ${sinceStatement} COMPARE WITH ${agoStatement}`;
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
};

Details.propTypes = {
  platformUrlState: PropTypes.object.isRequired,
  nerdletUrlState: PropTypes.object.isRequired
};

export default Details;
