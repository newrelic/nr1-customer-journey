import React from 'react';
import PropTypes from 'prop-types';
import ActiveSteps from './active-steps';
import StepsPilot from './steps-pilot';

const NewJourney = ({ children, currentStep, onPrevClick, onNextClick }) => {
  return (
    <div className="new-journey">
      <h3>Create New Journey</h3>
      <ActiveSteps currentStep={currentStep} />
      {children}
      <StepsPilot
        currentStep={currentStep}
        onPrevClick={onPrevClick}
        onNextClick={onNextClick}
      />
    </div>
  );
};

NewJourney.propTypes = {
  children: PropTypes.element,
  currentStep: PropTypes.number,
  onPrevClick: PropTypes.func,
  onNextClick: PropTypes.func
};

export default NewJourney;
