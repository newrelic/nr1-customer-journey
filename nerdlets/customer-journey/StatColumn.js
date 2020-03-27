import React from 'react';
import PropTypes from 'prop-types';
import StatCell from './StatCell';

export default class StatColumn extends React.Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    platformUrlState: PropTypes.object.isRequired,
    column: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { config, column } = this.props;

    return (
      <div className="standardStatColumn">
        <h3 className="columnHeader">{column.label}</h3>
        {config.steps.map((step, i) => {
          return (
            <StatCell
              key={i}
              stats={config.stats}
              step={step}
              {...this.props}
            />
          );
        })}
      </div>
    );
  }
}
