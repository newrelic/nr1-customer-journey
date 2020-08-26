import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'nr1';
import { Formik } from 'formik';
import * as Yup from 'yup';
import StepForm from '../step-form';
import StepsPilot from '../../steps-pilot';
import Tabs from '../tabs';
import Dropdown from '../../dropdown';

const stepTwoDescription =
  'The individual measures for a given column (Series) and row (Step).';

const STATS_TYPE = [
  { label: 'Decimal', value: 'decimal' },
  { label: 'Integer', value: 'integer' },
  { label: 'Percentile', value: 'percentile' }
];

const STATS_VALUE_DISPLAY = [
  { label: 'Integer', value: 'integer' },
  { label: 'Percentage', value: 'percentage' },
  { label: 'Seconds', value: 'seconds' }
];

const validationSchema = Yup.object().shape({
  stats: Yup.array()
    .of(
      Yup.object().shape({
        label: Yup.string().required('Is required'),
        ref: Yup.string().required('Is required'),
        type: Yup.string().required('Is required'),
        value: Yup.object().shape({
          nrql: Yup.string(),
          eventName: Yup.string(),
          display: Yup.string().required('Is required'),
          calculation: Yup.object().shape({
            numerator: Yup.string(),
            denominator: Yup.string().when('numerator', {
              is: numerator => numerator,
              then: Yup.string().required('Is required')
            })
          })
        })
      })
    )
    .min(1, 'At least one stat must be defined')
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
      numerator: '',
      denominator: ''
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

  cleanValues = stats => {
    return stats.map(stat => {
      if (!stat.value.nrql) delete stat.value.nrql;
      if (!stat.value.eventName) delete stat.value.eventName;
      if (!stat.value.calculation?.numerator) delete stat.value.calculation;

      return stat;
    });
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
      <StepForm title="Stats" description={stepTwoDescription}>
        <div style={{ width: '50%' }}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            validateOnChange={false}
            onSubmit={values => {
              const stats = this.cleanValues(values.stats);
              handleNextClick({ stats });
            }}
          >
            {({ values, errors, setFieldValue, handleSubmit }) => (
              <>
                <Tabs
                  errorMessage={
                    !Array.isArray(errors.stats) ? errors.stats : null
                  }
                  errorIndexes={
                    Array.isArray(errors.stats)
                      ? errors.stats?.map((error, index) => error && index)
                      : null
                  }
                  currentIndex={currentIndex}
                  items={values.stats}
                  handleOnTabChange={this.handleTabChange}
                  handleOnDelete={index => {
                    const stats = [...values.stats];
                    stats.splice(index, 1);
                    setFieldValue('stats', stats);
                    this.setState({
                      currentIndex:
                        currentIndex > 0 ? currentIndex - 1 : currentIndex
                    });
                  }}
                  handleOnAdd={() => {
                    const stats = values.stats;
                    stats.push({ ...STAT_OBJECT_TEMPLATE, id: stats.length });
                    setFieldValue('stats', stats);
                    this.setState({ currentIndex: stats.length - 1 });
                  }}
                />

                <form onSubmit={handleSubmit}>
                  {values.stats.length > 0 && (
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
                      <Dropdown
                        label="Type"
                        className="text-field"
                        items={STATS_TYPE}
                        onChange={value =>
                          setFieldValue(`stats[${currentIndex}].type`, value)
                        }
                        value={values.stats[currentIndex]?.type}
                        errorMessage={
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
                        <Dropdown
                          label="Display"
                          className="text-field"
                          items={STATS_VALUE_DISPLAY}
                          onChange={value =>
                            setFieldValue(
                              `stats[${currentIndex}].value.display`,
                              value
                            )
                          }
                          value={values.stats[currentIndex]?.value?.display}
                          errorMessage={
                            errors.stats &&
                            errors.stats[currentIndex]?.value?.display
                          }
                        />
                        <fieldset className="fieldset">
                          <legend className="fieldset__legend">
                            Calculation
                          </legend>
                          <Dropdown
                            label="numerator"
                            className="text-field"
                            items={values.stats
                              .filter(stat => stat.ref)
                              .map(({ label, ref }) => ({
                                value: ref,
                                label: label
                              }))}
                            onChange={value =>
                              setFieldValue(
                                `stats[${currentIndex}].value.calculation.numerator`,
                                value
                              )
                            }
                            value={
                              values.stats[currentIndex]?.value?.calculation
                                ?.numerator
                            }
                            errorMessage={
                              errors.stats &&
                              errors.stats[currentIndex]?.value?.calculation
                                ?.numerator
                            }
                          />
                          <Dropdown
                            label="denominator"
                            className="text-field"
                            items={values.stats
                              .filter(stat => stat.ref)
                              .map(({ label, ref }) => ({
                                value: ref,
                                label: label
                              }))}
                            disabled={
                              !values.stats[currentIndex]?.value?.calculation
                                ?.numerator
                            }
                            onChange={value =>
                              setFieldValue(
                                `stats[${currentIndex}].value.calculation.denominator`,
                                value
                              )
                            }
                            value={
                              values.stats[currentIndex]?.value?.calculation
                                ?.denominator
                            }
                            errorMessage={
                              errors.stats &&
                              errors.stats[currentIndex]?.value?.calculation
                                ?.denominator
                            }
                          />
                        </fieldset>
                      </fieldset>
                    </>
                  )}
                  <StepsPilot
                    currentStep={currentStep}
                    onPrevClick={() => handlePrevClick({ stats: values.stats })}
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

StepTwo.propTypes = {
  currentStep: PropTypes.number.isRequired,
  handlePrevClick: PropTypes.func.isRequired,
  handleNextClick: PropTypes.func.isRequired,
  initialValues: PropTypes.object
};
