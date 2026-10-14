import React from 'react';
import PropTypes from 'prop-types';
import StatCell from './StatCell';

const StatColumn = ({ config, column, platformUrlState }) => (
  <div className="standardStatColumn">
    <h3 className="columnHeader">{column.label}</h3>
    {config.steps.map((step, i) => (
      <StatCell
        key={i}
        stats={config.stats}
        step={step}
        column={column}
        config={config}
        platformUrlState={platformUrlState}
      />
    ))}
  </div>
);

StatColumn.propTypes = {
  config: PropTypes.object.isRequired,
  platformUrlState: PropTypes.object.isRequired,
  column: PropTypes.object.isRequired
};

export default StatColumn;
