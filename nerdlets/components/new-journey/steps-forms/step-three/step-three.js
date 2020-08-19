import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'nr1';
import { Formik } from 'formik';
import * as Yup from 'yup';
import StepForm from '../step-form';
import StepsPilot from '../../steps-pilot';
import Tabs from '../tabs';

const validationSchema = Yup.object().shape({
  steps: Yup.array().of(
    Yup.object().shape({
      label: Yup.string().required('Is required'),
      nrqlWhere: Yup.string().required('Is required'),
      altNrql: Yup.object().shape({
        JavaScriptError: Yup.string()
      })
    })
  )
});

const STEP_OBJECT_TEMPLATE = {
  label: 'New step',
  nrqlWhere: '',
  altNrql: {
    JavaScriptError: ''
  }
};

export default class StepThree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentIndex: 0
    };
  }

  handleTabChange = index => {
    this.setState({ currentIndex: index });
  };

  render() {
    const {
      currentStep,
      handlePrevClick,
      handleNextClick,
      initialValues
    } = this.props;

    const { currentIndex } = this.state;

    return (
      <StepForm title="Steps">
        <div style={{ width: '50%' }}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            validateOnChange={false}
            onSubmit={values => {
              console.log('StepThree -> render -> values', values);
              handleNextClick();
            }}
          >
            {({ values, errors, setFieldValue, handleSubmit }) => (
              <>
                <Tabs
                  errorIndexes={errors.steps?.map(
                    (error, index) => error && index
                  )}
                  currentIndex={currentIndex}
                  items={values.steps}
                  handleOnTabChange={this.handleTabChange}
                  handleOnAdd={() => {
                    const steps = values.steps;
                    steps.push(STEP_OBJECT_TEMPLATE);
                    setFieldValue('values.steps', steps);
                    this.setState({ currentIndex: steps.length - 1 });
                  }}
                />
                {values.steps.length > 0 && (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      label="Label"
                      className="text-field"
                      value={values.steps[currentIndex].label}
                      onChange={e =>
                        setFieldValue(
                          `steps[${currentIndex}].label`,
                          e.target.value
                        )
                      }
                      invalid={
                        errors.steps && errors.steps[currentIndex]?.label
                      }
                    />
                    <TextField
                      label="NRQL Where"
                      className="text-field"
                      value={values.steps[currentIndex].nrqlWhere}
                      onChange={e =>
                        setFieldValue(
                          `steps[${currentIndex}].nrqlWhere`,
                          e.target.value
                        )
                      }
                      invalid={
                        errors.steps && errors.steps[currentIndex]?.nrqlWhere
                      }
                    />
                    <fieldset className="fieldset">
                      <legend className="fieldset__legend">AltNRQL</legend>
                      <TextField
                        label="JavaScriptError"
                        className="text-field"
                        value={
                          values.steps[currentIndex].altNrql?.JavaScriptError
                        }
                        onChange={e =>
                          setFieldValue(
                            `steps[${currentIndex}].altNrql?.JavaScriptError`,
                            e.target.value
                          )
                        }
                        invalid={
                          errors.steps &&
                          errors.steps[currentIndex]?.altNrql?.JavaScriptError
                        }
                      />
                    </fieldset>
                    <StepsPilot
                      currentStep={currentStep}
                      onPrevClick={handlePrevClick}
                      onNextClick={handleSubmit}
                    />
                  </form>
                )}
              </>
            )}
          </Formik>
        </div>
      </StepForm>
    );
  }
}

StepThree.propTypes = {
  currentStep: PropTypes.number.isRequired,
  handlePrevClick: PropTypes.func.isRequired,
  handleNextClick: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired
};
