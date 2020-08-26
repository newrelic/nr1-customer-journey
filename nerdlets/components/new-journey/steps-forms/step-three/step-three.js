import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'nr1';
import { Formik } from 'formik';
import * as Yup from 'yup';
import StepForm from '../step-form';
import StepsPilot from '../../steps-pilot';
import Tabs from '../tabs';
import Dropdown from '../../dropdown';

const stepThreeDescription =
  'The set of rows that comprise the NRQL Where clauses of the funnel query.';

const validationSchema = Yup.object().shape({
  steps: Yup.array()
    .of(
      Yup.object().shape({
        label: Yup.string().required('Is required'),
        nrqlWhere: Yup.string().required('Is required'),
        altNrql: Yup.object().shape({
          key: Yup.string(),
          value: Yup.string().when('key', {
            is: key => key,
            then: Yup.string().required('Is required')
          })
        })
      })
    )
    .min(1, 'At least one step must be defined')
});

const STEP_OBJECT_TEMPLATE = {
  id: undefined,
  label: 'New step',
  nrqlWhere: '',
  altNrql: {
    key: '',
    value: ''
  }
};

export default class StepThree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentIndex: 0
    };
  }

  handleTabChange = index => {
    this.setState({ currentIndex: index });
  };

  cleanValues = steps => {
    return steps.map(step => {
      if (!step.altNrql?.key) delete step.altNrql;

      return step;
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
      <StepForm title="Steps" description={stepThreeDescription}>
        <div style={{ width: '50%' }}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            validateOnChange={false}
            onSubmit={values => {
              const steps = this.cleanValues(values.steps);
              handleNextClick({ steps });
            }}
          >
            {({ values, errors, setFieldValue, handleSubmit, handleBlur }) => (
              <>
                <Tabs
                  errorMessage={
                    !Array.isArray(errors.steps) ? errors.steps : null
                  }
                  errorIndexes={
                    Array.isArray(errors.steps)
                      ? errors.steps?.map((error, index) => error && index)
                      : null
                  }
                  currentIndex={currentIndex}
                  items={values.steps}
                  handleOnTabChange={this.handleTabChange}
                  handleOnDelete={index => {
                    const steps = [...values.steps];
                    steps.splice(index, 1);
                    setFieldValue('steps', steps);
                    this.setState({
                      currentIndex:
                        currentIndex > 0 ? currentIndex - 1 : currentIndex
                    });
                  }}
                  handleOnAdd={() => {
                    const steps = values.steps;
                    steps.push({ ...STEP_OBJECT_TEMPLATE, id: steps.length });
                    setFieldValue('steps', steps);
                    this.setState({ currentIndex: steps.length - 1 });
                  }}
                />

                <form onSubmit={handleSubmit}>
                  {values.steps.length > 0 && (
                    <>
                      <TextField
                        label="Label"
                        className="text-field"
                        value={values.steps[currentIndex].label}
                        onChange={e =>
                          setFieldValue(
                            `steps[${currentIndex}].label`,
                            e.target.value
                          )
                        }
                        onBlur={handleBlur}
                        invalid={
                          errors.steps && errors.steps[currentIndex]?.label
                        }
                      />
                      <TextField
                        label="NRQL Where"
                        className="text-field"
                        value={values.steps[currentIndex].nrqlWhere}
                        onChange={e =>
                          setFieldValue(
                            `steps[${currentIndex}].nrqlWhere`,
                            e.target.value
                          )
                        }
                        onBlur={handleBlur}
                        invalid={
                          errors.steps && errors.steps[currentIndex]?.nrqlWhere
                        }
                      />
                      <fieldset className="fieldset">
                        <legend className="fieldset__legend">AltNRQL</legend>
                        <Dropdown
                          label="Key"
                          className="text-field"
                          items={values.stats
                            .filter(({ value: { eventName } }) => eventName)
                            .map(({ value: { eventName } }) => ({
                              label: eventName,
                              value: eventName
                            }))}
                          onChange={value =>
                            setFieldValue(
                              `steps[${currentIndex}].altNrql.key`,
                              value
                            )
                          }
                          value={values.steps[currentIndex].altNrql?.key}
                          errorMessage={
                            errors.steps &&
                            errors.steps[currentIndex].altNrql?.key
                          }
                        />
                        <TextField
                          label="Value"
                          style={{ marginBottom: '16px' }}
                          value={values.steps[currentIndex].altNrql?.value}
                          disabled={!values.steps[currentIndex].altNrql?.key}
                          onChange={e =>
                            setFieldValue(
                              `steps[${currentIndex}].altNrql.value`,
                              e.target.value
                            )
                          }
                          onBlur={handleBlur}
                          invalid={
                            values.steps[currentIndex].altNrql?.key &&
                            errors.steps &&
                            errors.steps[currentIndex]?.altNrql?.value
                          }
                        />
                      </fieldset>
                    </>
                  )}
                  <StepsPilot
                    currentStep={currentStep}
                    onPrevClick={() => handlePrevClick({ steps: values.steps })}
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

StepThree.propTypes = {
  currentStep: PropTypes.number.isRequired,
  handlePrevClick: PropTypes.func.isRequired,
  handleNextClick: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired
};
