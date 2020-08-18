import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button } from 'nr1';
import { Formik } from 'formik';
import * as Yup from 'yup';
import StepForm from '../step-form';
import StepsPilot from '../../steps-pilot';

const initialValues = { title: '', accountId: '', event: '', measure: '' };

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Is required'),
  event: Yup.string().required('Is required'),
  measure: Yup.string().required('Is required')
});
export default class StepOne extends Component {
  render() {
    const { currentStep, handlePrevClick, handleNextClick } = this.props;

    return (
      <StepForm title="Basic Info">
        <div style={{ width: '50%' }}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
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
                <p>Funnel</p>
                <div className="funnel-fields">
                  <TextField
                    label="Funnel event"
                    style={{ marginBottom: '16px' }}
                    value={values.event}
                    onChange={e => setFieldValue('event', e.target.value)}
                    invalid={errors.event}
                  />
                  <TextField
                    label="Funnel measure"
                    style={{ marginBottom: '16px' }}
                    value={values.measure}
                    onChange={e => setFieldValue('measure', e.target.value)}
                    invalid={errors.measure}
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

StepOne.propTypes = {
  currentStep: PropTypes.number.isRequired,
  handlePrevClick: PropTypes.func.isRequired,
  handleNextClick: PropTypes.func.isRequired
};
