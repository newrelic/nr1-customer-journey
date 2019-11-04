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

export default class DataPoint extends React.Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    compareWith: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    label: PropTypes.string.isRequired,
    stat: PropTypes.object.isRequired,
    kpi: PropTypes.object
  };

  processValue() {
    const { stat, value } = this.props;
    if (value === null || value === 'N/A') {
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
  }

  processClassnames() {
    const { stat, kpi, value, compareWith } = this.props;
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
  }

  render() {
    const { label } = this.props;
    const classNames = this.processClassnames();
    return (
      <div className={classNames}>
        <h5 className="value">{this.processValue()}</h5>
        <span className="label">{toSentenceCase(label)}</span>
      </div>
    );
  }
}
