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
                />
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Label"
                    style={{ marginBottom: '16px' }}
                    value={values.steps[currentIndex].label}
                    onChange={e =>
                      setFieldValue(
                        `stats[${currentIndex}].label`,
                        e.target.value
                      )
                    }
                    invalid={errors.steps && errors.steps[currentIndex]?.label}
                  />
                  <TextField
                    label="NRQL Where"
                    style={{ marginBottom: '16px' }}
                    value={values.steps[currentIndex].nrqlWhere}
                    onChange={e =>
                      setFieldValue(
                        `stats[${currentIndex}].nrqlWhere`,
                        e.target.value
                      )
                    }
                    invalid={
                      errors.steps && errors.steps[currentIndex]?.nrqlWhere
                    }
                  />
                  <p>AltNrql</p>
                  <div className="altnrql-fields">
                    <TextField
                      label="JavaScriptError"
                      style={{ marginBottom: '16px' }}
                      value={values.steps[currentIndex].JavaScriptError}
                      onChange={e =>
                        setFieldValue(
                          `stats[${currentIndex}].JavaScriptError`,
                          e.target.value
                        )
                      }
                      invalid={errors.JavaScriptError}
                    />
                  </div>
                  <StepsPilot
                    currentStep={currentStep}
                    onPrevClick={handlePrevClick}
                    onNextClick={handleSubmit}
                  />
                </form>
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
