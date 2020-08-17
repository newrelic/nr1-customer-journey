import React, { Component } from 'react';
import { TextField } from 'nr1';
import { Formik } from 'formik';
import * as Yup from 'yup';
import StepForm from '../step-form';
import Dropdown from '../../dropdown';

const BOUND = [
  {
    label: 'Higher Violation',
    value: 'higherViolation'
  },
  {
    label: 'Lower Violation',
    value: 'lowerViolation'
  },
  {
    label: 'Higher Target',
    value: 'higherTarget'
  },
  {
    label: 'Lower Target',
    value: 'lowerTarget'
  },
  {
    label: 'Percentage',
    value: 'percentage'
  }
];

const initialValues = {
  label: '',
  ref: '',
  value: '',
  bound: '',
  description: ''
};

const validationSchema = Yup.object().shape({
  label: Yup.string().required('Is required'),
  ref: Yup.string().required('Is required'),
  value: Yup.number()
    .typeError('Must be a number')
    .required('Is required'),
  bound: Yup.string().required('Is required'),
  description: Yup.string()
});
class StepFour extends Component {
  render() {
    return (
      <StepForm title="KPIs">
        <div style={{ width: '50%' }}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={values => {
              console.log('StepFive -> render -> values', values);
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
                  label="Ref"
                  style={{ marginBottom: '16px' }}
                  value={values.ref}
                  onChange={e => setFieldValue('ref', e.target.value)}
                  invalid={errors.ref}
                />
                <TextField
                  label="Value"
                  style={{ marginBottom: '16px' }}
                  value={values.value}
                  onChange={e => setFieldValue('value', e.target.value)}
                  invalid={errors.value}
                />
                <Dropdown
                  label="Bound"
                  items={BOUND}
                  onChange={value => setFieldValue('bound', value)}
                  value={values.bound}
                  errorMessage={errors.bound}
                />

                <TextField
                  label="Description"
                  style={{ marginBottom: '16px' }}
                  value={values.description}
                  onChange={e => setFieldValue('description', e.target.value)}
                  invalid={errors.description}
                />
              </form>
            )}
          </Formik>
        </div>
      </StepForm>
    );
  }
}

export default StepFour;
