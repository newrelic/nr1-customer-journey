import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'nr1';
import { Formik } from 'formik';
import * as Yup from 'yup';
import StepForm from '../step-form';
import StepsPilot from '../../steps-pilot';

const initialValues = {
  label: '',
  nrqlWhere: '',
  JavaScriptError: ''
};

const validationSchema = Yup.object().shape({
  label: Yup.string().required('Is required'),
  nrqlWhere: Yup.string().required('Is required'),
  JavaScriptError: Yup.string()
});

export default class StepFour extends Component {
  render() {
    const { currentStep, handlePrevClick, handleNextClick } = this.props;
    return (
      <StepForm title="Series">
        <div style={{ width: '50%' }}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={values => {
              console.log('StepFour -> render -> values', values);
              handleNextClick();
            }}
          >
            {({ values, errors, setFieldValue, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Label"
                  style={{ marginBottom: '16px' }}
                  value={values.label}
                  onChange={e => setFieldValue('label', e.target.value)}
                  invalid={errors.label}
                />
                <TextField
                  label="NRQL Where"
                  style={{ marginBottom: '16px' }}
                  value={values.nrqlWhere}
                  onChange={e => setFieldValue('nrqlWhere', e.target.value)}
                  invalid={errors.nrqlWhere}
                />
                <p>AltNrql</p>
                <div className="altnrql-fields">
                  <TextField
                    label="JavaScriptError"
                    style={{ marginBottom: '16px' }}
                    value={values.JavaScriptError}
                    onChange={e =>
                      setFieldValue('JavaScriptError', e.target.value)
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
            )}
          </Formik>
        </div>
      </StepForm>
    );
  }
}

StepFour.propTypes = {
  currentStep: PropTypes.number.isRequired,
  handlePrevClick: PropTypes.func.isRequired,
  handleNextClick: PropTypes.func.isRequired
};
