import React from "react";
import PropTypes from 'prop-types';
import { HeadingText, BlockText } from "nr1";
import SlaDataPoint from './SlaDataPoint';

export default class SlaCell extends React.Component {
  static propTypes = {
    // name: PropTypes.string.isRequred,
    // sla: PropTypes.any.isRequired,
  }

  render() {
    const stat = this.props.stat;
    const kpi = this.props.kpi;
    const currentValue = this.props.currentValue;
    const inViolation = (kpi.bound == "upper") ? currentValue > kpi.value : kpi.value > currentValue;
    console.log(inViolation);
    return (
      <div className={(inViolation) ? "slaCell violation" : "slaCell"} >
        <HeadingText type="heading4" className="chartName">
          {kpi.name}
        </HeadingText>
        <SlaDataPoint
          value={currentValue}
          kpi={kpi}
          stat={stat}
        />
      </div>
    )
  }


}