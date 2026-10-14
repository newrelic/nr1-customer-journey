import React from 'react';
import PropTypes from 'prop-types';
import DataPoint from './DataPoint';
import { NerdGraphQuery, navigation } from 'nr1';
import { timeRangeToNrql } from '@newrelic/nr-labs-components';
import NerdGraphError from '../components/nerdgraph-error';

function getValue(rs) {
  if (rs) {
    const keys = Object.keys(rs).filter(k => k !== 'comparison');
    return rs[keys[0]];
  }
  return null;
}

const buildQueryBody = ({ stats, step, column, config, sinceStmt }) =>
  stats
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
    .join('');

const StatCell = ({ config, stats, step, column, platformUrlState }) => {
  const openDetails = () => {
    navigation.openStackedNerdlet({
      id: 'details',
      urlState: {
        selectedJourney: config,
        selectedColumn: column.id,
        selectedStep: step.id
      }
    });
  };

  const kpis = config.kpis || null;
  const sinceStmt = timeRangeToNrql(platformUrlState);
  const queryBody = buildQueryBody({ stats, step, column, config, sinceStmt });

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
    <div className="standardStatCell" onClick={openDetails}>
      <h5 className="pageTitle">{step.label}</h5>
      <NerdGraphQuery query={query}>
        {({ loading, data, error }) => {
          if (loading) {
            return (
              <div className="skeletonContainer">
                {stats.map((s, i) => (
                  <div key={i} className="standardDataPoint skeleton">
                    <h5 className="value" />
                    <span className="label" />
                  </div>
                ))}
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
                .filter(s => !('calculation' in s.value))
                .map((stat, i) => {
                  const kpi = kpis
                    ? kpis.find(kpi => kpi.ref === stat.ref)
                    : null;
                  const value = getValue(
                    data?.actor?.account?.[stat.ref]?.results?.[0]
                  );
                  const compareWith = getValue(
                    data?.actor?.account?.[stat.ref]?.results?.[1]
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
};

StatCell.propTypes = {
  stats: PropTypes.array.isRequired,
  step: PropTypes.object.isRequired,
  column: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  platformUrlState: PropTypes.object.isRequired
};

export default StatCell;
