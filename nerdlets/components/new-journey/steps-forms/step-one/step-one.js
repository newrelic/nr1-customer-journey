import React, { Component } from 'react';
import { TextField, Button } from 'nr1';
import { Formik } from 'formik';
import * as Yup from 'yup';
import StepForm from '../step-form';

const initialValues = { title: '', accountId: '', event: '', measure: '' };

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Is required'),
  event: Yup.string().required('Is required'),
  measure: Yup.string().required('Is required')
});
class StepOne extends Component {
  render() {
    return (
      <StepForm title="Basic Info">
        <div style={{ width: '50%' }}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={values => {
              console.log('StepOne -> render -> values', values);
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
                <Button type={Button.TYPE.PRIMARY} onClick={handleSubmit}>
                  Submit
                </Button>
              </form>
            )}
          </Formik>
        </div>
      </StepForm>
    );
  }
}
export default StepOne;
