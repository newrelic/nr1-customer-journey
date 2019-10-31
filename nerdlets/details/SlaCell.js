import React from 'react';
import PropTypes from 'prop-types';
import { HeadingText } from 'nr1';
import SlaDataPoint from './SlaDataPoint';
import KpiEval from '../../util/kpi';

export default class SlaCell extends React.Component {
  static propTypes = {
    stat: PropTypes.string.isRequired,
    kpi: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  };

  render() {
    const { kpi, value, stat } = this.props;
    const kpiEval = new KpiEval({ ...this.props });
    // console.log(inViolation);
    return (
      <div className={`slaCell$(inViolation ? " violation" : "")`}>
        <HeadingText type="heading4" className="chartName">
          {kpi.label}
        </HeadingText>
        <SlaDataPoint value={value} kpi={kpi} stat={stat} kpiEval={kpiEval} />
      </div>
    );
  }
}
