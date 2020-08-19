import React from 'react';
import PropTypes from 'prop-types';

const STEPS = [
  {
    id: 0,
    name: 'Basic Info'
  },
  {
    id: 1,
    name: 'Stats'
  },
  {
    id: 2,
    name: 'Steps'
  },
  {
    id: 3,
    name: 'Series'
  },
  {
    id: 4,
    name: 'Kpis'
  }
];

const ActiveSteps = ({ currentStep }) => {
  return (
    <div className="active-steps-container">
      {STEPS.map(({ id, name }) => {
        let activeStepStyle = 'active-step';
        if (id === currentStep) {
          activeStepStyle = `${activeStepStyle} active-step--active`;
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
