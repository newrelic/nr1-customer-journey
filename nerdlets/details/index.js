import React from 'react';
import PropTypes from 'prop-types';
import { NerdGraphQuery, LineChart, HeadingText, BarChart, Spinner, BlockText } from "nr1";
import journeyConfig from '../../journeyConfig';
import gql from 'graphql-tag';
import SlaCell from './SlaCell'

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
    let kpis = null;
    let kpisQuery = null;
    if (typeof step.kpis !== 'undefined') {
      kpis = step.kpis.filter(k => k.ref);
      kpis = kpis.map((kpi, i) => {
        const stat = stats.find(s => s.ref == kpi.ref);
        const nrql = stat.value.nrql;
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
      });
      kpisQuery = `{
      actor {
      account(id: ${journey.accountId}) {
        ${kpis
          .map(kpi => {
            const altStep = (kpi.altNrql) ? `AND (${kpi.altNrql})` : '';
            return `${kpi.kpi.ref}:nrql(query: "${kpi.nrql} AND (${column.nrql}) ${altStep} SINCE 30 MINUTES AGO") {
            results
        }`;
          })
          .join("")}
      }
    }
  }`;
      console.log(kpisQuery);
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
          <>
            <HeadingText type="heading3" className="slasHeader">SLAs</HeadingText>
            <div className="chartGrid">
              <NerdGraphQuery query={kpisQuery}>
                {({ loading, data, error }) => {
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
                      const rs = data.actor.account[kpi.kpi.ref].results[0];
                      const keys = Object.keys(rs);
                      const value = rs[keys[0]];
                      return (
                          <SlaCell
                            key={i}
                            currentValue={value}
                            kpi={kpi.kpi}
                            stat={kpi.stat}
                          />
                      )
                    })
                  )

                }}
              </NerdGraphQuery>
            </div>
          </>
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
