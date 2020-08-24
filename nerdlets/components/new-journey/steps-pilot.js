import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'nr1';

const StepsPilot = ({ currentStep, onPrevClick, onNextClick, isSaving }) => {
  return (
    <div className="steps-pilot">
      <Button type={Button.TYPE.NORMAL} onClick={onPrevClick}>
        {currentStep === 0 ? 'Cancel' : 'Previous'}
      </Button>
      <Button
        loading={isSaving}
        type={Button.TYPE.PRIMARY}
        onClick={onNextClick}
      >
        {currentStep === 4 ? 'Save' : 'Next'}
      </Button>
    </div>
  );
};

StepsPilot.propTypes = {
  currentStep: PropTypes.number,
  onPrevClick: PropTypes.func,
  onNextClick: PropTypes.func,
  isSaving: PropTypes.bool
};

export default StepsPilot;
