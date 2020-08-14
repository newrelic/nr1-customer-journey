import React from 'react';
import PropTypes from 'prop-types';

const StepForm = ({ children, title, onchange }) => {
  return (
    <div>
      <p>{title}</p>
      {children}
    </div>
  );
};

export default StepForm;
