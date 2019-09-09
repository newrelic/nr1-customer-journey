import React from 'react'
import PropTypes from 'prop-types'
import DataPoint from './DataPoint'
import { NerdGraphQuery, BlockText, navigation } from 'nr1';
import gql from 'graphql-tag';

function getValue(rs) {
  const keys = Object.keys(rs).filter(k => k != 'comparison');
  return rs[keys[0]];
}

export default class StatCell extends React.Component {
  static propTypes = {
    stats: PropTypes.array.isRequired,
    step: PropTypes.object.isRequired,
    column: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    timeRange: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      totalElementHeight: 0
    }
    this.statCellContainer = React.createRef()
    this.getComponentHeight = this.getComponentHeight.bind(this)
    this.openDetails = this.openDetails.bind(this)
  }

  openDetails() {
    const { config, column, step } = this.props
    navigation.openStackedNerdlet({
      id: "d60ec361-a8a3-4cda-a9ab-65a6a2d647c1.details",
      urlState: {
        selectedJourney: config.id,
        selectedColumn: column.id,
        selectedStep: step.id
      }
    })
  }

  getComponentHeight() {
    const elementHeight = this.statCellContainer.current.offsetHeight
    const verticalMargin =
      parseInt(
        window
          .getComputedStyle(this.statCellContainer.current)
          .marginBottom.slice(0, -2)
      ) +
      parseInt(
        window
          .getComputedStyle(this.statCellContainer.current)
          .marginTop.slice(0, -2)
      )

    return elementHeight + verticalMargin
  }

  componentDidMount() {
    this.setState({ totalElementHeight: this.getComponentHeight() })
  }

  render() {
    const { config, stats, step, column, timeRange } = this.props;
    const kpis = config.kpis || null;
    let q = `{
            actor {
            account(id: ${config.accountId}) {
              ${stats
        .map(stat => {
          const altStep = stat.value.eventName && step.altNrql && Object.keys(step.altNrql).find(k => k == stat.value.eventName);
          const durationInMinutes  = timeRange.duration / 1000 / 60;
          if (stat.value.nrql) {
            if (altStep) {
              return `${stat.ref}:nrql(query: "${stat.value.nrql} AND (${column.nrql}) AND (${altStep ? step.altNrql[stat.value.eventName] : step.nrql}) SINCE ${durationInMinutes} MINUTES AGO COMPARE WITH ${durationInMinutes*2} MINUTES AGO") {
                            results
                        }`;
            } else {
              return `${stat.ref}:nrql(query: "${stat.value.nrql} AND (${column.nrql}) AND (${altStep ? step.altNrql[stat.value.eventName] : step.nrql}) SINCE ${durationInMinutes} MINUTES AGO COMPARE WITH ${durationInMinutes*2} MINUTES AGO") {
                            results
                        }`;
            }
          } else {
            return ""
          }
        })
        .join("")}
            }
          }
        }`
    // console.log(q);
    q = gql`${q}`
    return (
      <div
        className="standardStatCell"
        ref={this.statCellContainer}
        onClick={this.openDetails}
      >
        <h5 className="pageTitle">{step.label}</h5>
        <NerdGraphQuery query={q}>
          {({ loading, data, error }) => {
            //console.debug([loading, error, data, kpis]); //eslint-disable-line
            if (loading) {
              return (
                <div className="skeletonContainer">
                  {stats.map((s, i) => {
                    return (
                      <div key={i} className="standardDataPoint skeleton">
                        <h5 className="value" />
                        <span className="label" />
                      </div>
                    )
                  })}
                </div>
              )
            }
            if (error) {
              return <BlockText>{JSON.stringify(error)}</BlockText>
            }
            const values = {}
            return (
              <React.Fragment>
                {stats
                  .filter(s => s.value.calculation == null)
                  .map((stat, i) => {
                    const kpi = kpis ? kpis.find(kpi => kpi.ref == stat.ref) : null;
                    const value = getValue(data.actor.account[stat.ref].results[0]);
                    const compareWith = getValue(data.actor.account[stat.ref].results[1]);
                    values[stat.ref] = value
                    return (
                      <DataPoint
                        value={value}
                        compareWith={compareWith}
                        label={stat.label}
                        key={i}
                        stat={stat}
                        kpi={kpi}
                      />
                    )
                  })}
                {stats
                  .filter(s => s.value.calculation)
                  .map((stat, i) => {
                    const { rate } = stat.value.calculation
                    const kpi = kpis ? kpis.find((kpi) => kpi.ref == stat.ref) : null;
                    let value = values[rate[0]] / values[rate[1]]
                    if (stat.value.display == "percentage") {
                      value = value * 100
                    }
                    values[stat.ref] = value
                    //console.debug([rate, stat.ref, value]);
                    return (
                      <DataPoint
                        value={value}
                        label={stat.label}
                        key={i}
                        kpi={kpi}
                        stat={stat}
                      />
                    )
                  })}
              </React.Fragment>
            )
          }}
        </NerdGraphQuery>
      </div>
    )
  }
}