import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'nr1';

const formatValue = (stat, value) => {
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
      return `${workingVal}%`;
    case 'seconds':
      return `${workingVal} s`;
    case 'integer':
      return workingVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    default:
      return workingVal;
  }
};

const SlaDataPoint = ({ kpi, value, stat, kpiEval }) => {
  const inViolation = kpiEval.isInViolation();
  return (
    <div className="slaContainer">
      <div className="slaComparisonContainer">
        <Icon
          type={
            inViolation
              ? Icon.TYPE.INTERFACE__SIGN__TIMES__V_ALTERNATE
              : Icon.TYPE.INTERFACE__SIGN__CHECKMARK__V_ALTERNATE
          }
          color={inViolation ? '#bf0015' : '#10a600'}
          className="slaComparisonIcon"
        />
        <div className="slaComparisonItem currentValueContainer">
          <h4 className="slaComparisonItemValue currentValue">
            {formatValue(stat, value)}
          </h4>
          <h6 className="slaComparisonItemLabel currentLabel">Current</h6>
        </div>
        <div className="slaComparisonItem slaValueContainer">
          <h4 className="slaComparisonItemValue slaValue">
            {formatValue(stat, kpi.value)}
          </h4>
          <h6 className="slaComparisonItemLabel slaLabel">
            {kpi.bound.toLowerCase() === 'percentage'
              ? '% Change'
              : 'Defined SLA'}
          </h6>
        </div>
      </div>

      <p className="slaDescription">{kpi.description}</p>
    </div>
  );
};

SlaDataPoint.propTypes = {
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  kpi: PropTypes.object.isRequired,
  stat: PropTypes.object.isRequired,
  kpiEval: PropTypes.object.isRequired
};

export default SlaDataPoint;
