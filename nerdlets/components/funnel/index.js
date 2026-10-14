import React from 'react';
import PropTypes from 'prop-types';
import { NerdGraphQuery, Spinner } from 'nr1';
import { timeRangeToNrql } from '@newrelic/nr-labs-components';
import FunnelChart from './funnel-chart';
import NerdGraphError from '../nerdgraph-error';

const seriesAlias = index => `series${index}`;

const quoteNrqlString = value => `'${value.replace(/'/g, "\\'")}'`;

const buildFunnelNrql = ({ funnel, steps, series, since }) => {
  const stepClauses = steps
    .map(step => `, WHERE ${step.nrqlWhere} AS ${quoteNrqlString(step.label)}`)
    .join(' ');
  return `FROM ${funnel.event} SELECT funnel(${funnel.measure} ${stepClauses}) WHERE ${series.nrqlWhere} ${since}`;
};

// One NRQL funnel query per series, batched into a single NerdGraph request.
const buildQuery = ({ accountId, funnel, steps, series, platformUrlState }) => {
  const since = timeRangeToNrql(platformUrlState);
  const queries = series
    .map((s, i) => {
      const nrql = buildFunnelNrql({ funnel, steps, series: s, since });
      return `${seriesAlias(i)}: nrql(query: ${JSON.stringify(nrql)}) {
        results
      }`;
    })
    .join('\n');

  return `{
    actor {
      account(id: ${accountId}) {
        ${queries}
      }
    }
  }`;
};

// A step is normally a plain count; if it's an object, use its first number.
const toCount = step => {
  if (typeof step === 'number') return step;
  const count = Object.values(step || {}).find(v => typeof v === 'number');
  return count || 0;
};

// Finds the funnel's per-step list in a NRQL result: `steps` at the top
// level, or the first list nested inside it.
const findSteps = result => {
  if (!result || typeof result !== 'object') return null;
  if (Array.isArray(result.steps)) return result.steps;
  for (const value of Object.values(result)) {
    const found = Array.isArray(value) ? value : findSteps(value);
    if (found) return found;
  }
  return null;
};

// Reshapes per-series results into values[step][series].
const toStepValues = (data, steps, series) => {
  const seriesSteps = series.map(
    (_, i) =>
      findSteps(data?.actor?.account?.[seriesAlias(i)]?.results?.[0]) || []
  );
  return steps.map((_, stepIndex) =>
    seriesSteps.map(values => toCount(values[stepIndex]))
  );
};

const hasCounts = values => values.some(row => row.some(count => count > 0));

const Funnel = ({ accountId, funnel, steps, series, platformUrlState }) => {
  const query = buildQuery({
    accountId,
    funnel,
    steps,
    series,
    platformUrlState
  });
  const stepLabels = steps.map(step => step.label);
  const seriesLabels = series.map(s => s.label);

  return (
    <NerdGraphQuery query={query}>
      {({ loading, error, data }) => {
        if (error) {
          return <NerdGraphError error={error} />;
        }
        const values = loading ? null : toStepValues(data, steps, series);
        const isEmpty = values && !hasCounts(values);
        if (isEmpty) {
          // eslint-disable-next-line no-console
          console.warn('Funnel: no step counts found in response', {
            query,
            data
          });
        }
        return (
          <>
            <FunnelChart
              steps={stepLabels}
              series={seriesLabels}
              values={values}
            />
            {loading && <Spinner className="funnel-spinner" />}
            {isEmpty && (
              <p className="funnel-empty">No funnel data for this time range</p>
            )}
          </>
        );
      }}
    </NerdGraphQuery>
  );
};

Funnel.propTypes = {
  accountId: PropTypes.number.isRequired,
  platformUrlState: PropTypes.object.isRequired,
  funnel: PropTypes.shape({
    event: PropTypes.string.isRequired,
    measure: PropTypes.string.isRequired
  }).isRequired,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      nrqlWhere: PropTypes.string.isRequired
    })
  ).isRequired,
  series: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      nrqlWhere: PropTypes.string.isRequired
    })
  ).isRequired
};

export default Funnel;
