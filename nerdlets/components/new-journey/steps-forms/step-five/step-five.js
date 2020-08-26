import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'nr1';
import { Formik } from 'formik';
import * as Yup from 'yup';
import StepForm from '../step-form';
import Dropdown from '../../dropdown';
import StepsPilot from '../../steps-pilot';
import Tabs from '../tabs';

const stepFiveDescription =
  'List of performance measurements tied to the stats array by the ref value.';

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
  label: 'New KPI',
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

  handleSave = values => {
    const { handleOnSave, handleNextClick } = this.props;

    handleNextClick({ kpis: values.kpis });
    if (handleOnSave) {
      handleOnSave();
    }
  };

  render() {
    const {
      currentStep,
      handlePrevClick,
      initialValues,
      isSaving
    } = this.props;

    const { currentIndex } = this.state;

    return (
      <StepForm title="KPIs" description={stepFiveDescription}>
        <div style={{ width: '50%' }}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            validateOnChange={false}
            onSubmit={values => {
              this.handleSave(values);
            }}
          >
            {({ values, errors, setFieldValue, handleSubmit, handleBlur }) => (
              <>
                <Tabs
                  errorIndexes={errors.kpis?.map(
                    (error, index) => error && index
                  )}
                  currentIndex={currentIndex}
                  items={values.kpis}
                  handleOnTabChange={this.handleTabChange}
                  handleOnDelete={index => {
                    const kpis = [...values.kpis];
                    kpis.splice(index, 1);
                    setFieldValue('kpis', kpis);
                    this.setState({
                      currentIndex:
                        currentIndex > 0 ? currentIndex - 1 : currentIndex
                    });
                  }}
                  handleOnAdd={() => {
                    const kpis = values.kpis;
                    kpis.push(KPI_OBJECT_TEMPLATE);
                    setFieldValue('kpis', kpis);
                    this.setState({ currentIndex: kpis.length - 1 });
                  }}
                />
                <form onSubmit={handleSubmit}>
                  {values.kpis.length > 0 && (
                    <>
                      <TextField
                        label="Label"
                        className="text-field"
                        value={values.kpis[currentIndex].label}
                        onChange={e =>
                          setFieldValue(
                            `kpis[${currentIndex}].label`,
                            e.target.value
                          )
                        }
                        onBlur={handleBlur}
                        invalid={
                          errors.kpis && errors.kpis[currentIndex]?.label
                        }
                      />
                      <Dropdown
                        label="Ref"
                        className="text-field"
                        items={values.stats
                          .filter(stat => stat.ref)
                          .map(({ label, ref }) => ({
                            value: ref,
                            label: label
                          }))}
                        value={values.kpis[currentIndex].ref}
                        onChange={value =>
                          setFieldValue(`kpis[${currentIndex}].ref`, value)
                        }
                        errorMessage={
                          errors.kpis && errors.kpis[currentIndex]?.ref
                        }
                      />
                      <TextField
                        label="Value"
                        className="text-field"
                        value={values.kpis[currentIndex]?.value}
                        onChange={e =>
                          setFieldValue(
                            `kpis[${currentIndex}].value`,
                            e.target.value
                          )
                        }
                        onBlur={handleBlur}
                        invalid={
                          errors.kpis && errors.kpis[currentIndex]?.value
                        }
                      />
                      <Dropdown
                        label="Bound"
                        className="text-field"
                        items={BOUND}
                        onChange={value =>
                          setFieldValue(`kpis[${currentIndex}].bound`, value)
                        }
                        value={values.kpis[currentIndex]?.bound}
                        errorMessage={
                          errors.kpis && errors.kpis[currentIndex]?.bound
                        }
                      />

                      <TextField
                        label="Description"
                        className="text-field"
                        value={values.kpis[currentIndex]?.description}
                        onChange={e =>
                          setFieldValue(
                            `kpis[${currentIndex}].description`,
                            e.target.value
                          )
                        }
                        onBlur={handleBlur}
                        invalid={
                          errors.kpis && errors.kpis[currentIndex]?.description
                        }
                      />
                    </>
                  )}
                  <StepsPilot
                    currentStep={currentStep}
                    onPrevClick={() => handlePrevClick({ kpis: values.kpis })}
                    onNextClick={handleSubmit}
                    isSaving={isSaving}
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
  initialValues: PropTypes.object.isRequired,
  handleOnSave: PropTypes.func.isRequired,
  isSaving: PropTypes.bool
};
