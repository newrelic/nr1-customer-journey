import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'nr1';
import { Formik } from 'formik';
import * as Yup from 'yup';
import StepForm from '../step-form';
import StepsPilot from '../../steps-pilot';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Is required'),
  funnel: Yup.object().shape({
    event: Yup.string().required('Is required'),
    measure: Yup.string().required('Is required')
  })
});

export default class StepOne extends Component {
  render() {
    const {
      currentStep,
      handlePrevClick,
      handleNextClick,
      initialValues
    } = this.props;

    return (
      <StepForm title="Basic Info">
        <div style={{ width: '50%' }}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            validateOnChange={false}
            onSubmit={values => {
              console.log('StepOne -> render -> values', values);
              handleNextClick();
            }}
          >
            {({ values, errors, setFieldValue, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Title"
                  style={{ marginBottom: '16px' }}
                  value={values.title}
                  onChange={e => setFieldValue('title', e.target.value)}
                  invalid={errors.title}
                />
                <fieldset className="fieldset">
                  <legend className="fieldset__legend">Funnel</legend>
                  <TextField
                    label="Funnel event"
                    style={{ marginBottom: '16px' }}
                    value={values.funnel.event}
                    onChange={e =>
                      setFieldValue('funnel.event', e.target.value)
                    }
                    invalid={errors.funnel?.event}
                  />
                  <TextField
                    label="Funnel measure"
                    style={{ marginBottom: '16px' }}
                    value={values.funnel.measure}
                    onChange={e =>
                      setFieldValue('funnel.measure', e.target.value)
                    }
                    invalid={errors.funnel?.measure}
                  />
                </fieldset>
                <StepsPilot
                  currentStep={currentStep}
                  onPrevClick={handlePrevClick}
                  onNextClick={handleSubmit}
                />
              </form>
            )}
          </Formik>
        </div>
      </StepForm>
    );
  }
}

StepOne.propTypes = {
  currentStep: PropTypes.number.isRequired,
  handlePrevClick: PropTypes.func.isRequired,
  handleNextClick: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired
};
