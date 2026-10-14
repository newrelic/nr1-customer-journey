import React from 'react';
import PropTypes from 'prop-types';

// The SVG is drawn in a fixed coordinate space and stretched to fill its
// container, so each step's slice of the funnel lines up with its label row.
const VIEWBOX_WIDTH = 100;
const STEP_HEIGHT = 100;

export const DEFAULT_COLORS = [
  '#005054',
  '#007e8a',
  '#70ccd2',
  '#2a9da6',
  '#a9e2e6',
  '#00363a'
];

const round = n => Math.round(n * 100) / 100;

const sum = numbers => numbers.reduce((total, n) => total + n, 0);

// Smooth S-curve through the points, flat (vertical tangent) at each one.
const curveThrough = points =>
  points
    .slice(1)
    .map((point, i) => {
      const prev = points[i];
      const midY = round((prev.y + point.y) / 2);
      return `C ${prev.x} ${midY} ${point.x} ${midY} ${point.x} ${point.y}`;
    })
    .join(' ');

/**
 * Builds one SVG path per series. values[step][series] holds the count for a
 * series at a step; the series are stacked side by side and centered, scaled so
 * the widest step fills the full width. Each step narrows into the next one
 * and the last step runs straight down to the bottom edge.
 */
export const getFunnelPaths = (
  values,
  width = VIEWBOX_WIDTH,
  stepHeight = STEP_HEIGHT
) => {
  if (!values || !values.length) return [];

  const totals = values.map(sum);
  const maxTotal = Math.max(...totals);
  if (!(maxTotal > 0)) return [];

  const scale = width / maxTotal;
  const boundaries = [...values, values[values.length - 1]].map(
    (stepValues, i) => {
      let offset = (width - sum(stepValues) * scale) / 2;
      return stepValues.map(value => {
        const left = offset;
        offset += value * scale;
        return { left: round(left), right: round(offset), y: i * stepHeight };
      });
    }
  );

  return values[0].map((_, seriesIndex) => {
    const edges = boundaries.map(row => row[seriesIndex]);
    const left = edges.map(({ left: x, y }) => ({ x, y }));
    const right = edges.map(({ right: x, y }) => ({ x, y })).reverse();
    return [
      `M ${left[0].x} ${left[0].y}`,
      curveThrough(left),
      `L ${right[0].x} ${right[0].y}`,
      curveThrough(right),
      'Z'
    ].join(' ');
  });
};

const percentOf = (value, total) =>
  total > 0 ? Math.round((value / total) * 100) : 0;

const FunnelChart = ({ steps, series, values, colors }) => {
  const paths = getFunnelPaths(values);
  const colorFor = index => colors[index % colors.length];

  return (
    <div className="funnel-chart">
      <svg
        className="funnel-chart__graph"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${
          Math.max(steps.length, 1) * STEP_HEIGHT
        }`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {paths.map((d, i) => (
          <path key={i} d={d} fill={colorFor(i)} stroke={colorFor(i)} />
        ))}
      </svg>
      <ol className="funnel-chart__steps">
        {steps.map((label, stepIndex) => {
          const stepValues = values?.[stepIndex];
          const total = stepValues ? sum(stepValues) : 0;

          return (
            <li key={stepIndex} className="funnel-chart__step" tabIndex={0}>
              <span className="funnel-chart__title">{label}</span>
              {stepValues && (
                <ul className="funnel-chart__breakdown">
                  {series.map((seriesLabel, seriesIndex) => (
                    <li key={seriesIndex}>
                      <span
                        className="funnel-chart__swatch"
                        style={{ backgroundColor: colorFor(seriesIndex) }}
                      />
                      {seriesLabel}:{' '}
                      <span className="funnel-chart__percentage">
                        {percentOf(stepValues[seriesIndex], total)}%
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

FunnelChart.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  series: PropTypes.arrayOf(PropTypes.string).isRequired,
  values: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  colors: PropTypes.arrayOf(PropTypes.string)
};

FunnelChart.defaultProps = {
  colors: DEFAULT_COLORS
};

export default FunnelChart;
