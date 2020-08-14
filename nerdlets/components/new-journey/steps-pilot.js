import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'nr1';

const StepsPilot = ({ currentStep, onPrevClick, onNextClick }) => {
  return (
    <div className="steps-pilot">
      <Button
        type={Button.TYPE.NORMAL}
        onClick={onPrevClick}
        disabled={currentStep === 0}
      >
        Prev
      </Button>
      <Button
        type={Button.TYPE.NORMAL}
        onClick={onNextClick}
        disabled={currentStep === 4}
      >
        Next
      </Button>
    </div>
  );
};

StepsPilot.propTypes = {
  currentStep: PropTypes.number,
  onPrevClick: PropTypes.func,
  onNextClick: PropTypes.func
};

export default StepsPilot;
