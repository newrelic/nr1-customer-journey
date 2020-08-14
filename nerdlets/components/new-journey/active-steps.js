import React from 'react';
import PropTypes from 'prop-types';

const STEPS = [
  {
    id: 0,
    name: 'Step 1'
  },
  {
    id: 1,
    name: 'Step 2'
  },
  {
    id: 2,
    name: 'Step 3'
  },
  {
    id: 3,
    name: 'Step 4'
  },
  {
    id: 4,
    name: 'Step 5'
  }
];

const ActiveSteps = ({ currentStep }) => {
  return (
    <div className="active-steps-container">
      {STEPS.map(({ id, name }) => {
        let activeStepStyle = 'active-step';
        if (id === currentStep) {
          activeStepStyle = `${activeStepStyle} active-step active-step--active`;
        }

        return (
          <p key={name} className={activeStepStyle}>
            {name}
          </p>
        );
      })}
    </div>
  );
};

ActiveSteps.propTypes = {
  currentStep: PropTypes.number
};

export default ActiveSteps;
