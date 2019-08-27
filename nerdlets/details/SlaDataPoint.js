import React from 'react'
import PropTypes from 'prop-types'

export default class SlaDataPoint extends React.Component {
  static propTypes = {
    value: PropTypes.any.isRequired,
    kpi: PropTypes.object.isRequired,
    stat: PropTypes.object.isRequired
  }

  processValue(value) {
    const { stat } = this.props;
    let workingVal = value;
    if (stat.type == "percentile") {
      const percentileKeys = Object.keys(value);
      workingVal = value[percentileKeys[0]].toFixed(2);
    }
    if (stat.type == "decimal") {
      workingVal = workingVal.toFixed(2);
    }
    switch (stat.value.display) {
      case "percentage":
        return `${workingVal}%`;
      case "seconds":
        return `${workingVal} s`;
      case "integer":
        return workingVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      default:
        return workingVal;
    }
  }

  render() {
    const { state, kpi, value } = this.props;
    return (
      <div className="largeDataPoint">
        <h2 className="value">{this.processValue(value) + ` Defined SLA : ${this.processValue(kpi.value)}`}</h2>
        <span className="label">{this.props.kpi.description}</span>
      </div>
    )
  }
}