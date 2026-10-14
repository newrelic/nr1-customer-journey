import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ActiveSteps from './active-steps';
import { StepOne, StepTwo, StepThree, StepFour, StepFive } from './steps-forms';

const STEP_COMPONENTS = [StepOne, StepTwo, StepThree, StepFour, StepFive];
const LAST_STEP = STEP_COMPONENTS.length - 1;

const EMPTY_JOURNEY = {
  id: undefined,
  title: undefined,
  funnel: {
    event: undefined,
    measure: undefined
  },
  stats: [],
  steps: [],
  series: [],
  kpis: []
};

const NewJourney = ({
  journey: initialJourney,
  handleOnSave,
  handleCancel,
  isSaving
}) => {
  const isEdit = !!initialJourney;
  const [currentStep, setCurrentStep] = useState(0);
  const [journey, setJourney] = useState(initialJourney || EMPTY_JOURNEY);

  const handlePrevClick = journeyConfig => {
    setJourney(prev => ({ ...prev, ...journeyConfig }));
    setCurrentStep(step => Math.max(step - 1, 0));
  };

  const handleNextClick = journeyConfig => {
    setJourney(prev => ({ ...prev, ...journeyConfig }));
    setCurrentStep(step => Math.min(step + 1, LAST_STEP));
  };

  // The last step passes in its own values, since the merge from
  // handleNextClick hasn't been applied to `journey` yet.
  const handleSave = journeyConfig => {
    if (handleOnSave) {
      handleOnSave({ ...journey, ...journeyConfig });
    }
  };

  const StepComponent = STEP_COMPONENTS[currentStep];

  return (
    <div className="new-journey">
      <h1 className="new-journey__heading">
        {isEdit ? 'Edit Journey' : 'Create New Journey'}
      </h1>
      <ActiveSteps currentStep={currentStep} />
      <StepComponent
        initialValues={journey}
        currentStep={currentStep}
        handleCancel={handleCancel}
        handlePrevClick={handlePrevClick}
        handleNextClick={handleNextClick}
        handleOnSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
};

NewJourney.propTypes = {
  handleOnSave: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  journey: PropTypes.object,
  isSaving: PropTypes.bool
};

export default NewJourney;
