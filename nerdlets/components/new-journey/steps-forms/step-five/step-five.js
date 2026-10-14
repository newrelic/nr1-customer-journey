import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'nr1';
import StepForm from '../step-form';
import Dropdown from '../../dropdown';
import StepsPilot from '../../steps-pilot';
import Tabs from '../tabs';
import {
  compact,
  required,
  requiredNumber,
  useStepForm,
  validateList
} from '../form';

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

const validateKpi = kpi =>
  compact({
    label: required(kpi.label),
    ref: required(kpi.ref),
    value: requiredNumber(kpi.value),
    bound: required(kpi.bound)
  });

const validate = ({ kpis }) =>
  compact({ kpis: validateList(kpis, validateKpi) });

const newKpi = () => ({
  label: 'New KPI',
  ref: '',
  value: '',
  bound: '',
  description: ''
});

const StepFive = ({
  currentStep,
  handlePrevClick,
  handleOnSave,
  initialValues,
  isSaving
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { values, errors, setFieldValue, handleSubmit, handleBlur } =
    useStepForm({
      initialValues,
      validate,
      onSubmit: ({ kpis }) => handleOnSave({ kpis })
    });

  return (
    <StepForm title="KPIs" description={stepFiveDescription}>
      <div style={{ width: '50%' }}>
        <Tabs
          errorIndexes={errors.kpis?.map((error, index) => error && index)}
          currentIndex={currentIndex}
          items={values.kpis}
          handleOnTabChange={setCurrentIndex}
          handleOnDelete={index => {
            const kpis = [...values.kpis];
            kpis.splice(index, 1);
            setFieldValue('kpis', kpis);
            setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : currentIndex);
          }}
          handleOnAdd={() => {
            const kpis = [...values.kpis, newKpi()];
            setFieldValue('kpis', kpis);
            setCurrentIndex(kpis.length - 1);
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
                  setFieldValue(`kpis[${currentIndex}].label`, e.target.value)
                }
                onBlur={handleBlur}
                invalid={errors.kpis && errors.kpis[currentIndex]?.label}
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
                errorMessage={errors.kpis && errors.kpis[currentIndex]?.ref}
              />
              <TextField
                label="Value"
                className="text-field"
                value={values.kpis[currentIndex]?.value}
                onChange={e =>
                  setFieldValue(`kpis[${currentIndex}].value`, e.target.value)
                }
                onBlur={handleBlur}
                invalid={errors.kpis && errors.kpis[currentIndex]?.value}
              />
              <Dropdown
                label="Bound"
                className="text-field"
                items={BOUND}
                onChange={value =>
                  setFieldValue(`kpis[${currentIndex}].bound`, value)
                }
                value={values.kpis[currentIndex]?.bound}
                errorMessage={errors.kpis && errors.kpis[currentIndex]?.bound}
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
      </div>
    </StepForm>
  );
};

StepFive.propTypes = {
  currentStep: PropTypes.number.isRequired,
  handlePrevClick: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  handleOnSave: PropTypes.func.isRequired,
  isSaving: PropTypes.bool
};

export default StepFive;
