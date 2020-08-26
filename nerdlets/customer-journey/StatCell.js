import React from 'react';
import PropTypes from 'prop-types';
import DataPoint from './DataPoint';
import { NerdGraphQuery, navigation } from 'nr1';
import get from 'lodash.get';
import has from 'lodash.has';
import { timeRangeToNrql, NerdGraphError } from '@newrelic/nr1-community';

function getValue(rs) {
  if (rs) {
    const keys = Object.keys(rs).filter(k => k !== 'comparison');
    return rs[keys[0]];
  }
  return null;
}

export default class StatCell extends React.Component {
  static propTypes = {
    stats: PropTypes.array.isRequired,
    step: PropTypes.object.isRequired,
    column: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    platformUrlState: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.statCellContainer = React.createRef();
  }

  openDetails = () => {
    const { config, column, step } = this.props;
    navigation.openStackedNerdlet({
      id: 'details',
      urlState: {
        selectedJourney: config,
        selectedColumn: column.id,
        selectedStep: step.id
      }
    });
  };

  getComponentHeight = () => {
    const elementHeight = this.statCellContainer.current.offsetHeight;
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
      );

    return elementHeight + verticalMargin;
  };

  render() {
    const { config, stats, step, column, platformUrlState } = this.props;
    const kpis = config.kpis || null;
    const sinceStmt = timeRangeToNrql(platformUrlState);
    const queryBody = `${stats
      .map(stat => {
        const requiresAltNrql =
          stat.value.eventName && stat.value.eventName !== config.funnel.event;

        const altStepNrql =
          requiresAltNrql &&
          step.altNrql &&
          step.altNrql.key === stat.value.eventName
            ? step.altNrql.value
            : null;

        const altColumnNrql =
          requiresAltNrql &&
          column.altNrql &&
          column.altNrql.key === stat.value.eventName
            ? column.altNrql.value
            : null;

        if (stat.value.nrql) {
          if (requiresAltNrql) {
            if (altStepNrql && altColumnNrql) {
              return `${stat.ref}:nrql(query: "${stat.value.nrql} AND (${altColumnNrql}) AND (${altStepNrql}) ${sinceStmt}") {
                  results
                }`;
            } else {
              // we failed to provide the needed altNrql, so the result is incalculable.
              return '';
            }
          } else {
            return `${stat.ref}:nrql(query: "${stat.value.nrql} AND (${column.nrqlWhere}) AND (${step.nrqlWhere}) ${sinceStmt}") {
                  results
              }`;
          }
        } else {
          return '';
        }
      })
      .join('')}`;

    if (!queryBody) {
      return (
        <p>There was an error with constructing query. Check configuration</p>
      );
    }

    const query = `{
      actor {
        account(id: ${config.accountId}) {
          ${queryBody}
        }
      }
    }`;

    return (
      <div
        className="standardStatCell"
        ref={this.statCellContainer}
        onClick={this.openDetails}
      >
        <h5 className="pageTitle">{step.label}</h5>
        <NerdGraphQuery query={query}>
          {({ loading, data, error }) => {
            if (loading) {
              return (
                <div className="skeletonContainer">
                  {stats.map((s, i) => {
                    return (
                      <div key={i} className="standardDataPoint skeleton">
                        <h5 className="value" />
                        <span className="label" />
                      </div>
                    );
                  })}
                </div>
              );
            }
            if (error) {
              return <NerdGraphError error={error} />;
            }
            const values = {};
            return (
              <>
                {stats
                  .filter(s => !has(s.value, 'calculation'))
                  .map((stat, i) => {
                    const kpi = kpis
                      ? kpis.find(kpi => kpi.ref === stat.ref)
                      : null;
                    const value = getValue(
                      get(data, `actor.account["${stat.ref}"].results[0]`)
                    );
                    const compareWith = getValue(
                      get(data, `actor.account["${stat.ref}"].results[1]`)
                    );
                    values[stat.ref] = value;
                    return (
                      <DataPoint
                        value={value}
                        compareWith={compareWith}
                        label={stat.label}
                        key={i}
                        stat={stat}
                        kpi={kpi}
                      />
                    );
                  })}
                {stats
                  .filter(s => s.value.calculation)
                  .map((stat, i) => {
                    const {
                      numerator: numeratorField,
                      denominator: denominatorField
                    } = stat.value.calculation;
                    const kpi = kpis
                      ? kpis.find(kpi => kpi.ref === stat.ref)
                      : null;
                    // debugger;
                    const numerator = values[numeratorField];
                    const denominator = values[denominatorField];
                    let value = null;
                    if (denominator) {
                      value = numerator / denominator;
                      if (stat.value.display === 'percentage') {
                        value = value * 100;
                      }
                      values[stat.ref] = value;
                    } else {
                      values[stat.ref] = null;
                    }
                    // console.debug([rate, stat.ref, value, kpi]);
                    return (
                      <DataPoint
                        value={value}
                        label={stat.label}
                        key={i}
                        kpi={kpi}
                        stat={stat}
                      />
                    );
                  })}
              </>
            );
          }}
        </NerdGraphQuery>
      </div>
    );
  }
}
