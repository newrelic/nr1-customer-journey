import React from 'react';
import PropTypes from 'prop-types';
import { NerdGraphQuery, LineChart, HeadingText, BlockText } from "nr1";
import journeyConfig from '../../journeyConfig';
import gql from 'graphql-tag';
import SlaCell from './SlaCell';

function getValue(rs) {
  const keys = Object.keys(rs).filter(k => k != 'comparison');
  return rs[keys[0]];
}

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
    let { stats, kpis } = journey;
    //debugger;
    stats = stats.filter(s => s.value.nrql);
    if (step.kpis) {
      kpis = step.kpis;
    }
    let kpisQuery = null;
    if (kpis) {
      kpis = kpis.filter(kpi => stats.find(s => s.ref == kpi.ref) != null)
        .map(kpi => {
          const stat = stats.find(s => s.ref == kpi.ref);
          const nrql = stat ? stat.value.nrql : null;
          const altStep = stat.value.eventName && step.altNrql && Object.keys(step.altNrql).find(k => k == stat.value.eventName);
          const altNrql = step.altNrql[altStep];
          return (
            {
              stat,
              kpi,
              nrql,
              altNrql,
            }
          )
        }
      );
      const durationInMinutes  = this.props.launcherUrlState.timeRange.duration / 1000 / 60;
      kpisQuery = `{
        actor {
          account(id: ${journey.accountId}) {
            ${kpis.map(kpi => {
              const altStep = (kpi.altNrql) ? `AND (${kpi.altNrql})` : '';
              return `${kpi.kpi.ref}:nrql(query: "${kpi.nrql} AND (${column.nrql}) ${altStep} SINCE ${durationInMinutes} MINUTES AGO COMPARE WITH ${durationInMinutes*2} MINUTES AGO") {
              results
            }`;
              })
              .join("")}
          }
        }
      }`;
      console.debug(kpisQuery);
      kpisQuery = gql(kpisQuery);
    }

    return (
      <React.Fragment>
        <HeadingText type='heading3' className="detailPaneHeader customerJourneyBreadcrumbs">
          <span className="customerJourneyBreadcrumb">{journey.title}</span>
          <span className="customerJourneyBreadcrumb">{column.label}</span>
          <span className="customerJourneyBreadcrumb">{step.label}</span>
        </HeadingText>
        {kpis &&
          <React.Fragment>
            <HeadingText type="heading3" className="slasHeader">SLAs</HeadingText>
            <div className="chartGrid">
              <NerdGraphQuery query={kpisQuery}>
                {({ loading, data, error }) => {
                  console.debug("Details KPI's", {loading, error, data});
                  if (loading) {
                    return (
                      <div className="skeletonContainer">
                        {kpis.map((s, i) => {
                          return (
                            <div key={i} className="largeDataPoint skeleton">
                              <h5 className="value" />
                              <span className="label" />
                            </div>
                          )
                        })}
                      </div>
                    )
                  }
                  if (error) {
                    return <BlockText>{JSON.stringify(error)}</BlockText>;
                  }
                  return (
                    kpis.map((kpi, i) => {
                      const value = getValue(data.actor.account[kpi.kpi.ref].results[0]);
                      const compareWith = getValue(data.actor.account[kpi.kpi.ref].results[1]);
                      return (
                          <SlaCell
                            key={i}
                            value={value}
                            compareWith={compareWith}
                            kpi={kpi.kpi}
                            stat={kpi.stat}
                          />
                      )
                    })
                  )

                }}
              </NerdGraphQuery>
            </div>
          </React.Fragment>
        }
        <div className="chartGrid">
          {stats.map((stat, i) => {
            const query =
              stat.value.nrql +
              ` AND (${step.nrql}) AND (${
              column.nrql
              }) TIMESERIES SINCE ${durationInMinutes} MINUTES AGO COMPARE WITH ${durationInMinutes *
              2} MINUTES AGO`
            // console.log(query);
            return (
              <div key={i} className="chart">
                <HeadingText type="heading4" className="chartName">
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
