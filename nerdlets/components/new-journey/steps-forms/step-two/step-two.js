import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'nr1';
import StepForm from '../step-form';
import StepsPilot from '../../steps-pilot';
import Tabs from '../tabs';
import Dropdown from '../../dropdown';
import { compact, required, useStepForm, validateList } from '../form';

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

const validateStat = stat =>
  compact({
    label: required(stat.label),
    ref: required(stat.ref),
    type: required(stat.type),
    value: compact({
      display: required(stat.value?.display),
      calculation: compact({
        denominator: stat.value?.calculation?.numerator
          ? required(stat.value.calculation.denominator)
          : undefined
      })
    })
  });

const validate = ({ stats }) =>
  compact({
    stats: validateList(
      stats,
      validateStat,
      'At least one stat must be defined'
    )
  });

const newStat = id => ({
  id,
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
});

// Drops the optional value fields that were left empty.
const cleanValues = stats =>
  stats.map(
    ({ value: { nrql, eventName, calculation, ...value }, ...stat }) => ({
      ...stat,
      value: {
        ...value,
        ...(nrql && { nrql }),
        ...(eventName && { eventName }),
        ...(calculation?.numerator && { calculation })
      }
    })
  );

const refItems = stats =>
  stats
    .filter(stat => stat.ref)
    .map(({ label, ref }) => ({
      value: ref,
      label: label
    }));

const StepTwo = ({
  currentStep,
  handlePrevClick,
  handleNextClick,
  initialValues
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { values, errors, setFieldValue, handleSubmit } = useStepForm({
    initialValues,
    validate,
    onSubmit: ({ stats }) => handleNextClick({ stats: cleanValues(stats) })
  });

  return (
    <StepForm title="Stats" description={stepTwoDescription}>
      <div style={{ width: '50%' }}>
        <Tabs
          errorMessage={!Array.isArray(errors.stats) ? errors.stats : null}
          errorIndexes={
            Array.isArray(errors.stats)
              ? errors.stats.map((error, index) => error && index)
              : null
          }
          currentIndex={currentIndex}
          items={values.stats}
          handleOnTabChange={setCurrentIndex}
          handleOnDelete={index => {
            const stats = [...values.stats];
            stats.splice(index, 1);
            setFieldValue('stats', stats);
            setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : currentIndex);
          }}
          handleOnAdd={() => {
            const stats = [...values.stats, newStat(values.stats.length)];
            setFieldValue('stats', stats);
            setCurrentIndex(stats.length - 1);
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
                  setFieldValue(`stats[${currentIndex}].label`, e.target.value)
                }
                invalid={errors.stats && errors.stats[currentIndex]?.label}
              />
              <TextField
                label="Ref"
                className="text-field"
                value={values.stats[currentIndex]?.ref}
                onChange={e =>
                  setFieldValue(`stats[${currentIndex}].ref`, e.target.value)
                }
                invalid={errors.stats && errors.stats[currentIndex]?.ref}
              />
              <Dropdown
                label="Type"
                className="text-field"
                items={STATS_TYPE}
                onChange={value =>
                  setFieldValue(`stats[${currentIndex}].type`, value)
                }
                value={values.stats[currentIndex]?.type}
                errorMessage={errors.stats && errors.stats[currentIndex]?.type}
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
                    errors.stats && errors.stats[currentIndex]?.value?.nrql
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
                    errors.stats && errors.stats[currentIndex]?.value?.eventName
                  }
                />
                <Dropdown
                  label="Display"
                  className="text-field"
                  items={STATS_VALUE_DISPLAY}
                  onChange={value =>
                    setFieldValue(`stats[${currentIndex}].value.display`, value)
                  }
                  value={values.stats[currentIndex]?.value?.display}
                  errorMessage={
                    errors.stats && errors.stats[currentIndex]?.value?.display
                  }
                />
                <fieldset className="fieldset">
                  <legend className="fieldset__legend">Calculation</legend>
                  <Dropdown
                    label="numerator"
                    className="text-field"
                    items={refItems(values.stats)}
                    onChange={value =>
                      setFieldValue(
                        `stats[${currentIndex}].value.calculation.numerator`,
                        value
                      )
                    }
                    value={
                      values.stats[currentIndex]?.value?.calculation?.numerator
                    }
                    errorMessage={
                      errors.stats &&
                      errors.stats[currentIndex]?.value?.calculation?.numerator
                    }
                  />
                  <Dropdown
                    label="denominator"
                    className="text-field"
                    items={refItems(values.stats)}
                    disabled={
                      !values.stats[currentIndex]?.value?.calculation?.numerator
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
      </div>
    </StepForm>
  );
};

StepTwo.propTypes = {
  currentStep: PropTypes.number.isRequired,
  handlePrevClick: PropTypes.func.isRequired,
  handleNextClick: PropTypes.func.isRequired,
  initialValues: PropTypes.object
};

export default StepTwo;
