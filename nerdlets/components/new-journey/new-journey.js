import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ActiveSteps from './active-steps';
import { StepOne, StepTwo, StepThree, StepFour, StepFive } from './steps-forms';

export default class NewJourney extends Component {
  constructor(props) {
    super(props);

    const { journey } = props;

    this.state = {
      currentStep: 0,
      isEdit: journey && true,
      journey: journey || {
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
      }
    };
  }

  handlePrevClick = journeyConfig => {
    this.setState(prevState => {
      return {
        journey: { ...prevState.journey, ...journeyConfig },
        currentStep:
          prevState.currentStep === 0
            ? prevState.currentStep
            : prevState.currentStep - 1
      };
    });
  };

  handleNextClick = journeyConfig => {
    this.setState(prevState => {
      return {
        journey: { ...prevState.journey, ...journeyConfig },
        currentStep:
          prevState.currentStep === 4
            ? prevState.currentStep
            : prevState.currentStep + 1
      };
    });
  };

  handleOnSave = () => {
    const { journey } = this.state;
    const { handleOnSave } = this.props;

    if (handleOnSave) {
      handleOnSave(journey);
    }
  };

  renderSteps = () => {
    const { currentStep, journey } = this.state;
    const { handleCancel, isSaving } = this.props;

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
        initialValues={journey}
        currentStep={currentStep}
        handleCancel={handleCancel}
        handlePrevClick={this.handlePrevClick}
        handleNextClick={this.handleNextClick}
        handleOnSave={this.handleOnSave}
        isSaving={isSaving}
      />
    );
  };

  render() {
    const { currentStep, isEdit } = this.state;

    return (
      <div className="new-journey">
        <h1 className="new-journey__heading">
          {isEdit ? 'Edit Journey' : 'Create New Journey'}
        </h1>
        <ActiveSteps currentStep={currentStep} />
        {this.renderSteps()}
      </div>
    );
  }
}

NewJourney.propTypes = {
  handleOnSave: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  journey: PropTypes.object,
  isSaving: PropTypes.bool
};
