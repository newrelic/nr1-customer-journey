import React, { Component } from 'react';
import { TextField } from 'nr1';
import { Formik } from 'formik';
import * as Yup from 'yup';
import StepForm from '../step-form';

const STATS_TYPE = {
  DECIMAL: 'decimal',
  INTEGER: 'integer',
  PERCENTILE: 'percentile'
};

const STATS_VALUE_DISPLAY = {
  INTEGER: 'integer',
  PERCENTAGE: 'percentage',
  SECONDS: 'seconds'
};

const validationSchema = Yup.object().shape({
  label: Yup.string().required('Is required'),
  ref: Yup.string().required('Is required'),
  type: Yup.string().required('Is required'),
  nrql: Yup.string(),
  eventNname: Yup.string(),
  display: Yup.string().required('Is required'),
  rate: Yup.string().required('Is required')
});

const initialValues = {
  label: '',
  ref: '',
  type: '',
  nrql: '',
  eventName: '',
  display: '',
  rate: ''
};

class StepTwo extends Component {
  render() {
    return (
      <StepForm title="Stats">
        <div style={{ width: '50%' }}>
          <Formik
            validateOnChange
            initialValues={initialValues}
            validationSchema={validationSchema}
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
                  label="Ref"
                  style={{ marginBottom: '16px' }}
                  value={values.ref}
                  onChange={e => setFieldValue('ref', e.target.value)}
                  invalid={errors.ref}
                />
                <TextField
                  label="Type"
                  style={{ marginBottom: '16px' }}
                  value={values.type}
                  onChange={e => setFieldValue('type', e.target.value)}
                  invalid={errors.type}
                />
                <p>Value</p>
                <div className="value-fields">
                  <TextField
                    label="nrql"
                    style={{
                      marginBottom: '16px'
                    }}
                    value={values.nrql}
                    onChange={e => setFieldValue('nrql', e.target.value)}
                    invalid={errors.nrql}
                  />
                  <TextField
                    label="event name"
                    style={{ marginBottom: '16px' }}
                    value={values.eventName}
                    onChange={e => setFieldValue('eventName', e.target.value)}
                    invalid={errors.eventName}
                  />
                  <TextField
                    label="display"
                    style={{ marginBottom: '16px' }}
                    value={values.display}
                    onChange={e => setFieldValue('display', e.target.value)}
                    invalid={errors.display}
                  />

                  <p>Calculation</p>
                  <TextField
                    label="rate"
                    style={{
                      marginTop: '16px',
                      marginLeft: '20px'
                    }}
                    value={values.rate}
                    onChange={e => setFieldValue('rate', e.target.value)}
                    invalid={errors.rate}
                  />
                </div>
              </form>
            )}
          </Formik>
        </div>
      </StepForm>
    );
  }
}

export default StepTwo;
