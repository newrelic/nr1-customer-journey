import React from 'react';
import PropTypes from 'prop-types';
import KpiEval from '../../util/kpi';

function toSentenceCase(input) {
  const output = input
    .split(/(?=[A-Z])/)
    .join(' ')
    .toLowerCase();
  return output.charAt(0).toUpperCase() + output.slice(1);
}

const formatValue = (stat, value) => {
  if (value === null || value === undefined || value === 'N/A') {
    return 'N/A';
  }
  let workingVal = value;
  if (stat.type === 'percentile') {
    const percentileKeys = Object.keys(value);
    workingVal = value[percentileKeys[0]].toFixed(2);
  }
  if (stat.type === 'decimal') {
    workingVal = workingVal.toFixed(2);
  }
  switch (stat.value.display) {
    case 'percentage':
      return `${workingVal}`;
    case 'seconds':
      return `${workingVal} s`;
    case 'integer':
      return workingVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    default:
      return workingVal;
  }
};

const getClassNames = ({ stat, kpi, value, compareWith }) => {
  let classNames = `standardDataPoint ${
    stat.value.display === 'percentage' ? 'valueIsPercentage' : ''
  }`;
  if (kpi) {
    const kpiEval = new KpiEval({ stat, kpi, value, compareWith });
    if (kpiEval.isInViolation()) {
      classNames += ` inViolation`;
    } else if (kpiEval.isExceedingTarget()) {
      classNames += ` exceedingTarget`;
    }
  }
  return classNames;
};

const DataPoint = ({ value, compareWith, label, stat, kpi }) => (
  <div className={getClassNames({ stat, kpi, value, compareWith })}>
    <h5 className="value">{formatValue(stat, value)}</h5>
    <span className="label">{toSentenceCase(label)}</span>
  </div>
);

DataPoint.propTypes = {
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  compareWith: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  label: PropTypes.string.isRequired,
  stat: PropTypes.object.isRequired,
  kpi: PropTypes.object
};

export default DataPoint;
