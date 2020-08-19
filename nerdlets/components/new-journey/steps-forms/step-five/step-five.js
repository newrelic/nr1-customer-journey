import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'nr1';
import { Formik } from 'formik';
import * as Yup from 'yup';
import StepForm from '../step-form';
import Dropdown from '../../dropdown';
import StepsPilot from '../../steps-pilot';
import Tabs from '../tabs';

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

const validationSchema = Yup.object().shape({
  kpis: Yup.array().of(
    Yup.object().shape({
      label: Yup.string().required('Is required'),
      ref: Yup.string().required('Is required'),
      value: Yup.number()
        .typeError('Must be a number')
        .required('Is required'),
      bound: Yup.string().required('Is required'),
      description: Yup.string()
    })
  )
});

const KPI_OBJECT_TEMPLATE = {
  label: '',
  ref: '',
  value: '',
  bound: '',
  description: ''
};

export default class StepFive extends Component {
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
      <StepForm title="KPIs">
        <div style={{ width: '50%' }}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            validateOnChange={false}
            onSubmit={values => {
              console.log('StepFive -> render -> values', values);
              handleNextClick(values);
            }}
          >
            {({ values, errors, setFieldValue, handleSubmit }) => (
              <>
                <Tabs
                  errorIndexes={errors.kpis?.map(
                    (error, index) => error && index
                  )}
                  currentIndex={currentIndex}
                  items={values.kpis}
                  handleOnTabChange={this.handleTabChange}
                  handleOnAdd={() => {
                    const kpis = values.kpis;
                    kpis.push(KPI_OBJECT_TEMPLATE);
                    setFieldValue('values.kpis', kpis);
                    this.setState({ currentIndex: kpis.length - 1 });
                  }}
                />

                <form onSubmit={handleSubmit}>
                  {values.kpis.length > 0 && (
                    <>
                      <TextField
                        label="Label"
                        style={{ marginBottom: '16px' }}
                        value={values.kpis[currentIndex].label}
                        onChange={e =>
                          setFieldValue(
                            `kpis[${currentIndex}].label`,
                            e.target.value
                          )
                        }
                        invalid={
                          errors.kpis && errors.kpis[currentIndex]?.label
                        }
                      />
                      <TextField
                        label="Ref"
                        style={{ marginBottom: '16px' }}
                        value={values.kpis[currentIndex].ref}
                        onChange={e =>
                          setFieldValue(
                            `kpis[${currentIndex}].ref`,
                            e.target.value
                          )
                        }
                        invalid={errors.kpis && errors.kpis[currentIndex]?.ref}
                      />
                      <TextField
                        label="Value"
                        style={{ marginBottom: '16px' }}
                        value={values.kpis[currentIndex].value}
                        onChange={e =>
                          setFieldValue(
                            `kpis[${currentIndex}].value`,
                            e.target.value
                          )
                        }
                        invalid={
                          errors.kpis && errors.kpis[currentIndex]?.value
                        }
                      />
                      <Dropdown
                        label="Bound"
                        items={BOUND}
                        onChange={value =>
                          setFieldValue(`kpis[${currentIndex}].bound`, value)
                        }
                        value={values.kpis[currentIndex].bound}
                        errorMessage={
                          errors.kpis && errors.kpis[currentIndex]?.bound
                        }
                      />

                      <TextField
                        label="Description"
                        style={{ marginBottom: '16px' }}
                        value={values.kpis[currentIndex].description}
                        onChange={e =>
                          setFieldValue(
                            `kpis[${currentIndex}].description`,
                            e.target.value
                          )
                        }
                        invalid={
                          errors.kpis && errors.kpis[currentIndex]?.description
                        }
                      />
                    </>
                  )}
                  <StepsPilot
                    currentStep={currentStep}
                    onPrevClick={() => handlePrevClick(values)}
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

StepFive.propTypes = {
  currentStep: PropTypes.number.isRequired,
  handlePrevClick: PropTypes.func.isRequired,
  handleNextClick: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired
};
