import React from 'react';
import PropTypes from 'prop-types';

const StepForm = ({ children, title, description }) => {
  return (
    <div className="step-form">
      <h2 className="step-form__title">{title}</h2>
      <p>{description}</p>
      {children}
    </div>
  );
};

StepForm.propTypes = {
  children: PropTypes.element,
  title: PropTypes.string,
  description: PropTypes.string
};

export default StepForm;
