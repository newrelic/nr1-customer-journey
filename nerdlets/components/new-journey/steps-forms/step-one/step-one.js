import React, { Component } from 'react';
import { TextField, Button } from 'nr1';
import { Formik } from 'formik';
import * as Yup from 'yup';
import StepForm from '../step-form';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Is required'),
  funnel_event: Yup.string().required('Is required'),
  funnel_measure: Yup.string().required('Is required')
});
class StepOne extends Component {
  render() {
    return (
      <StepForm title="Basic Info">
        <div style={{ width: '50%' }}>
          <Formik
            initialValues={{ title: '', funnel_event: '', funnel_measure: '' }}
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
                <TextField
                  label="Funnel event"
                  style={{ marginBottom: '16px' }}
                  value={values.funnel_event}
                  onChange={e => setFieldValue('funnel_event', e.target.value)}
                  invalid={errors.funnel_event}
                />
                <TextField
                  label="Funnel measure"
                  style={{ marginBottom: '16px' }}
                  value={values.funnel_measure}
                  onChange={e =>
                    setFieldValue('funnel_measure', e.target.value)
                  }
                  invalid={errors.funnel_measure}
                />
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
