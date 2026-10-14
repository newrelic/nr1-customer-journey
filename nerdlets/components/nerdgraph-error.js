import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'nr1';

const NerdGraphError = ({ error }) => (
  <div className="nerdgraph-error">
    <Icon type={Icon.TYPE.INTERFACE__STATE__CRITICAL} color="#bf0015" />
    <span className="nerdgraph-error__message">{error.message}</span>
  </div>
);

NerdGraphError.propTypes = {
  error: PropTypes.shape({ message: PropTypes.string }).isRequired
};

export default NerdGraphError;
