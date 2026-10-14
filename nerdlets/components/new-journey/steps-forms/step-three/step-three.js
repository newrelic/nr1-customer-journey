import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'nr1';
import StepForm from '../step-form';
import StepsPilot from '../../steps-pilot';
import Tabs from '../tabs';
import Dropdown from '../../dropdown';
import { compact, required, useStepForm, validateList } from '../form';

const stepThreeDescription =
  'The set of rows that comprise the NRQL Where clauses of the funnel query.';

const validateStep = step =>
  compact({
    label: required(step.label),
    nrqlWhere: required(step.nrqlWhere),
    altNrql: compact({
      value: step.altNrql?.key ? required(step.altNrql.value) : undefined
    })
  });

const validate = ({ steps }) =>
  compact({
    steps: validateList(
      steps,
      validateStep,
      'At least one step must be defined'
    )
  });

const newStep = id => ({
  id,
  label: 'New step',
  nrqlWhere: '',
  altNrql: {
    key: '',
    value: ''
  }
});

// Drops altNrql from steps where no key was chosen.
const cleanValues = steps =>
  steps.map(({ altNrql, ...step }) =>
    altNrql?.key ? { ...step, altNrql } : step
  );

const StepThree = ({
  currentStep,
  handlePrevClick,
  handleNextClick,
  initialValues
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { values, errors, setFieldValue, handleSubmit, handleBlur } =
    useStepForm({
      initialValues,
      validate,
      onSubmit: ({ steps }) => handleNextClick({ steps: cleanValues(steps) })
    });

  return (
    <StepForm title="Steps" description={stepThreeDescription}>
      <div style={{ width: '50%' }}>
        <Tabs
          errorMessage={!Array.isArray(errors.steps) ? errors.steps : null}
          errorIndexes={
            Array.isArray(errors.steps)
              ? errors.steps.map((error, index) => error && index)
              : null
          }
          currentIndex={currentIndex}
          items={values.steps}
          handleOnTabChange={setCurrentIndex}
          handleOnDelete={index => {
            const steps = [...values.steps];
            steps.splice(index, 1);
            setFieldValue('steps', steps);
            setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : currentIndex);
          }}
          handleOnAdd={() => {
            const steps = [...values.steps, newStep(values.steps.length)];
            setFieldValue('steps', steps);
            setCurrentIndex(steps.length - 1);
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
                  setFieldValue(`steps[${currentIndex}].label`, e.target.value)
                }
                onBlur={handleBlur}
                invalid={errors.steps && errors.steps[currentIndex]?.label}
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
                invalid={errors.steps && errors.steps[currentIndex]?.nrqlWhere}
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
                    setFieldValue(`steps[${currentIndex}].altNrql.key`, value)
                  }
                  value={values.steps[currentIndex].altNrql?.key}
                  errorMessage={
                    errors.steps && errors.steps[currentIndex]?.altNrql?.key
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
      </div>
    </StepForm>
  );
};

StepThree.propTypes = {
  currentStep: PropTypes.number.isRequired,
  handlePrevClick: PropTypes.func.isRequired,
  handleNextClick: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired
};

export default StepThree;
