import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ActiveSteps from './active-steps';
import StepsPilot from './steps-pilot';

import { StepOne, StepTwo, StepThree, StepFour, StepFive } from './steps-forms';

export default class NewJourney extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentStep: 0
    };
  }

  handlePrevClick = () => {
    this.setState(prevState => {
      if (prevState.currentStep === 0) {
        return {
          currentStep: prevState.currentStep
        };
      }

      return {
        currentStep: prevState.currentStep - 1
      };
    });
  };

  handleNextClick = () => {
    this.setState(prevState => {
      if (prevState.currentStep === 4) {
        return {
          currentStep: prevState.currentStep
        };
      }

      return {
        currentStep: prevState.currentStep + 1
      };
    });
  };

  renderSteps = () => {
    switch (this.state.currentStep) {
      case 0:
        return <StepOne />;
      case 1:
        return <StepTwo />;
      case 2:
        return <StepThree />;
      case 3:
        return <StepFour />;
      case 4:
        return <StepFive />;

      default:
    }
  };

  render() {
    const { currentStep } = this.state;
    return (
      <div className="new-journey">
        <h3>Create New Journey</h3>
        <ActiveSteps currentStep={currentStep} />
        {this.renderSteps()}
        <StepsPilot
          currentStep={currentStep}
          onPrevClick={this.handlePrevClick}
          onNextClick={this.handleNextClick}
        />
      </div>
    );
  }
}

NewJourney.propTypes = {};
