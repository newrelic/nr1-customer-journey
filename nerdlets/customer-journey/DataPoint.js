import React from 'react'
import PropTypes from 'prop-types'

export default class DataPoint extends React.Component {
    static propTypes = {
        value: PropTypes.any.isRequired,
        label: PropTypes.string.isRequired,
        stat: PropTypes.object.isRequired
    }

    toSentenceCase(input) {
        let output = input.split(/(?=[A-Z])/).join(" ").toLowerCase()
        return output.charAt(0).toUpperCase() + output.slice(1)
    }

    processValue() {
        const { stat, value } = this.props;
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
        return (
            <div className="standardDataPoint">
                <h5 className="value">{this.processValue()}</h5>
                <span className="label">{this.toSentenceCase(this.props.label)}</span>
            </div>
        )
    }
}