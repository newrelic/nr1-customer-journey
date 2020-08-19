import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button } from 'nr1';
import { Formik } from 'formik';
import * as Yup from 'yup';
import StepForm from '../step-form';
import StepsPilot from '../../steps-pilot';
import Tabs from '../tabs';

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
  stats: Yup.array().of(
    Yup.object().shape({
      label: Yup.string().required('Is required'),
      ref: Yup.string().required('Is required'),
      type: Yup.string().required('Is required'),
      value: Yup.object().shape({
        nrql: Yup.string(),
        eventName: Yup.string(),
        display: Yup.string().required('Is required'),
        calculation: Yup.object().shape({
          rate: Yup.array()
            .of(Yup.string())
            .min(2)
            .max(2)
        })
      })
    })
  )
});

const STAT_OBJECT_TEMPLATE = {
  label: 'New stat',
  ref: '',
  type: '',
  value: {
    nrql: '',
    eventName: '',
    display: '',
    calculation: {
      rate: ['', '']
    }
  }
};

export default class StepTwo extends Component {
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
      <StepForm title="Stats">
        <div style={{ width: '50%' }}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            validateOnChange={false}
            onSubmit={values => {
              console.log('StepTwo -> render -> values', values);
              handleNextClick();
            }}
          >
            {({ values, errors, setFieldValue, handleSubmit }) => (
              <>
                <Tabs
                  errorIndexes={errors.stats?.map(
                    (error, index) => error && index
                  )}
                  currentIndex={currentIndex}
                  items={values.stats}
                  handleOnTabChange={this.handleTabChange}
                  handleOnAdd={() => {
                    const stats = values.stats;
                    stats.push(STAT_OBJECT_TEMPLATE);
                    setFieldValue('values.stats', stats);
                    this.setState({ currentIndex: stats.length - 1 });
                  }}
                />
                {values.stats.length > 0 && (
                  <form onSubmit={handleSubmit}>
                    <>
                      <TextField
                        label="Label"
                        className="text-field"
                        value={values.stats[currentIndex]?.label}
                        onChange={e =>
                          setFieldValue(
                            `stats[${currentIndex}].label`,
                            e.target.value
                          )
                        }
                        invalid={
                          errors.stats && errors.stats[currentIndex]?.label
                        }
                      />
                      <TextField
                        label="Ref"
                        className="text-field"
                        value={values.stats[currentIndex]?.ref}
                        onChange={e =>
                          setFieldValue(
                            `stats[${currentIndex}].ref`,
                            e.target.value
                          )
                        }
                        invalid={
                          errors.stats && errors.stats[currentIndex]?.ref
                        }
                      />
                      <TextField
                        label="Type"
                        className="text-field"
                        value={values.stats[currentIndex]?.type}
                        onChange={e =>
                          setFieldValue(
                            `stats[${currentIndex}].type`,
                            e.target.value
                          )
                        }
                        invalid={
                          errors.stats && errors.stats[currentIndex]?.type
                        }
                      />
                      <fieldset className="fieldset">
                        <legend className="fieldset__legend">Value</legend>
                        <TextField
                          label="nrql"
                          className="text-field"
                          value={values.stats[currentIndex]?.value?.nrql}
                          onChange={e =>
                            setFieldValue(
                              `stats[${currentIndex}].value.nrql`,
                              e.target.value
                            )
                          }
                          invalid={
                            errors.stats &&
                            errors.stats[currentIndex]?.value?.nrql
                          }
                        />
                        <TextField
                          label="event name"
                          className="text-field"
                          value={values.stats[currentIndex]?.value?.eventName}
                          onChange={e =>
                            setFieldValue(
                              `stats[${currentIndex}].value.eventName`,
                              e.target.value
                            )
                          }
                          invalid={
                            errors.stats &&
                            errors.stats[currentIndex]?.value?.eventName
                          }
                        />
                        <TextField
                          label="display"
                          className="text-field"
                          value={values.stats[currentIndex]?.value?.display}
                          onChange={e =>
                            setFieldValue(
                              `stats[${currentIndex}].value.display`,
                              e.target.value
                            )
                          }
                          invalid={
                            errors.stats &&
                            errors.stats[currentIndex]?.value?.display
                          }
                        />
                        <fieldset className="fieldset">
                          <legend className="fieldset__legend">
                            Calculation
                          </legend>
                          <TextField
                            label="rate 1"
                            className="text-field"
                            value={
                              values.stats[currentIndex]?.value?.calculation
                                ?.rate[0]
                            }
                            onChange={e =>
                              setFieldValue(
                                `stats[${currentIndex}].value.calculation.rate[0]`,
                                e.target.value
                              )
                            }
                            invalid={
                              errors.stats &&
                              errors.stats[currentIndex]?.value?.calculation
                                ?.rate[0]
                            }
                          />
                          <TextField
                            label="rate 2"
                            className="text-field"
                            value={
                              values.stats[currentIndex]?.value?.calculation
                                ?.rate[1]
                            }
                            onChange={e =>
                              setFieldValue(
                                `stats[${currentIndex}].value.calculation.rate[0]`,
                                e.target.value
                              )
                            }
                            invalid={
                              errors.stats &&
                              errors.stats[currentIndex]?.value?.calculation
                                ?.rate[1]
                            }
                          />
                        </fieldset>
                      </fieldset>
                    </>
                    <StepsPilot
                      currentStep={currentStep}
                      onPrevClick={handlePrevClick}
                      onNextClick={handleSubmit}
                    />
                  </form>
                )}
              </>
            )}
          </Formik>
        </div>
      </StepForm>
    );
  }
}

StepTwo.propTypes = {
  currentStep: PropTypes.number.isRequired,
  handlePrevClick: PropTypes.func.isRequired,
  handleNextClick: PropTypes.func.isRequired,
  initialValues: PropTypes.object
};
