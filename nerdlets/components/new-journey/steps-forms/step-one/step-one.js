import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'nr1';
import StepForm from '../step-form';
import StepsPilot from '../../steps-pilot';
import { compact, required, useStepForm } from '../form';

const validate = ({ title, funnel }) =>
  compact({
    title: required(title),
    funnel: compact({
      event: required(funnel?.event),
      measure: required(funnel?.measure)
    })
  });

const StepOne = ({
  currentStep,
  handleCancel,
  handleNextClick,
  initialValues
}) => {
  const { values, errors, setFieldValue, handleSubmit, handleBlur } =
    useStepForm({ initialValues, validate, onSubmit: handleNextClick });

  return (
    <StepForm title="Basic Info">
      <div style={{ width: '50%' }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            className="text-field"
            value={values.title}
            onBlur={handleBlur}
            onChange={e => setFieldValue('title', e.target.value)}
            invalid={errors.title}
          />
          <fieldset className="fieldset">
            <legend className="fieldset__legend">Funnel</legend>
            <TextField
              label="Funnel event"
              className="text-field"
              value={values.funnel.event}
              onBlur={handleBlur}
              onChange={e => setFieldValue('funnel.event', e.target.value)}
              invalid={errors.funnel?.event}
            />
            <TextField
              label="Funnel measure"
              className="text-field"
              value={values.funnel.measure}
              onBlur={handleBlur}
              onChange={e => setFieldValue('funnel.measure', e.target.value)}
              invalid={errors.funnel?.measure}
            />
          </fieldset>
          <StepsPilot
            currentStep={currentStep}
            onPrevClick={handleCancel}
            onNextClick={handleSubmit}
          />
        </form>
      </div>
    </StepForm>
  );
};

StepOne.propTypes = {
  currentStep: PropTypes.number.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleNextClick: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired
};

export default StepOne;
