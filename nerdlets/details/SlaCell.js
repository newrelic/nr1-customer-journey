import React from 'react';
import PropTypes from 'prop-types';
import { HeadingText } from 'nr1';
import SlaDataPoint from './SlaDataPoint';
import KpiEval from '../../util/kpi';

const SlaCell = ({ kpi, value, stat }) => {
  const kpiEval = new KpiEval({ kpi, value, stat });
  return (
    <div className={`slaCell${kpiEval.isInViolation() ? ' violation' : ''}`}>
      <HeadingText type="heading4" className="chartName">
        {kpi.label}
      </HeadingText>
      <SlaDataPoint value={value} kpi={kpi} stat={stat} kpiEval={kpiEval} />
    </div>
  );
};

SlaCell.propTypes = {
  stat: PropTypes.object.isRequired,
  kpi: PropTypes.object.isRequired,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.number])
};

export default SlaCell;
