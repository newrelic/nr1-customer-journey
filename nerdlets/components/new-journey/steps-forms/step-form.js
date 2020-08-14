import React from 'react';
import PropTypes from 'prop-types';

const StepForm = ({ children, title }) => {
  return (
    <div className="step-form">
      <h4 className="step-form__title">{title}</h4>
      {children}
    </div>
  );
};

StepForm.propTypes = {
  children: PropTypes.element,
  title: PropTypes.string
};

export default StepForm;
