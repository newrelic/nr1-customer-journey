import React, { Component } from 'react';
import { TextField } from 'nr1';
import { Formik } from 'formik';
import * as Yup from 'yup';
import StepForm from '../step-form';

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

class StepThree extends Component {
  render() {
    return (
      <StepForm title="Steps">
        <div style={{ width: '50%' }}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={values => {
              console.log('StepThree -> render -> values', values);
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
              </form>
            )}
          </Formik>
        </div>
      </StepForm>
    );
  }
}

export default StepThree;
