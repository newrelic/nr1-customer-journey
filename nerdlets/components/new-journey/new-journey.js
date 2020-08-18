import React, { Component } from 'react';
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
    const { currentStep } = this.state;

    let Component = null;
    switch (currentStep) {
      case 0:
        Component = StepOne;
        break;
      case 1:
        Component = StepTwo;
        break;
      case 2:
        Component = StepThree;
        break;
      case 3:
        Component = StepFour;
        break;
      case 4:
        Component = StepFive;
        break;
      default:
    }

    return (
      <Component
        currentStep={currentStep}
        handlePrevClick={this.handlePrevClick}
        handleNextClick={this.handleNextClick}
      />
    );
  };

  render() {
    const { currentStep } = this.state;
    return (
      <div className="new-journey">
        <h3>Create New Journey</h3>
        <ActiveSteps currentStep={currentStep} />
        {this.renderSteps()}
      </div>
    );
  }
}

NewJourney.propTypes = {};
