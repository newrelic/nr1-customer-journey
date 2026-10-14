import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'nr1';
import StepForm from '../step-form';
import StepsPilot from '../../steps-pilot';
import Tabs from '../tabs';
import Dropdown from '../../dropdown';
import { compact, required, useStepForm, validateList } from '../form';

const stepFourDescription =
  'The series of columns (or cohorts) that are to be compared with one another in the rows (steps) of the visualization.';

const validateSeries = series =>
  compact({
    label: required(series.label),
    nrqlWhere: required(series.nrqlWhere),
    altNrql: compact({
      value: series.altNrql?.key ? required(series.altNrql.value) : undefined
    })
  });

const validate = ({ series }) =>
  compact({
    series: validateList(
      series,
      validateSeries,
      'At least one series must be defined'
    )
  });

const newSeries = id => ({
  id,
  label: 'New series',
  nrqlWhere: '',
  altNrql: {
    key: '',
    value: ''
  }
});

const StepFour = ({
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
      onSubmit: ({ series }) => handleNextClick({ series })
    });

  return (
    <StepForm title="Series" description={stepFourDescription}>
      <div style={{ width: '50%' }}>
        <Tabs
          errorMessage={!Array.isArray(errors.series) ? errors.series : null}
          errorIndexes={
            Array.isArray(errors.series)
              ? errors.series.map((error, index) => error && index)
              : null
          }
          currentIndex={currentIndex}
          items={values.series}
          handleOnTabChange={setCurrentIndex}
          handleOnDelete={index => {
            const series = [...values.series];
            series.splice(index, 1);
            setFieldValue('series', series);
            setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : currentIndex);
          }}
          handleOnAdd={() => {
            const series = [...values.series, newSeries(values.series.length)];
            setFieldValue('series', series);
            setCurrentIndex(series.length - 1);
          }}
        />
        <form onSubmit={handleSubmit}>
          {values.series.length > 0 && (
            <>
              <TextField
                label="Label"
                className="text-field"
                value={values.series[currentIndex].label}
                onChange={e =>
                  setFieldValue(`series[${currentIndex}].label`, e.target.value)
                }
                onBlur={handleBlur}
                invalid={errors.series && errors.series[currentIndex]?.label}
              />
              <TextField
                label="NRQL Where"
                className="text-field"
                value={values.series[currentIndex].nrqlWhere}
                onChange={e =>
                  setFieldValue(
                    `series[${currentIndex}].nrqlWhere`,
                    e.target.value
                  )
                }
                onBlur={handleBlur}
                invalid={
                  errors.series && errors.series[currentIndex]?.nrqlWhere
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
                    setFieldValue(`series[${currentIndex}].altNrql.key`, value)
                  }
                  value={values.series[currentIndex].altNrql?.key}
                  errorMessage={
                    errors.series && errors.series[currentIndex]?.altNrql?.key
                  }
                />
                <TextField
                  label="Value"
                  style={{ marginBottom: '16px' }}
                  value={values.series[currentIndex].altNrql?.value}
                  onChange={e =>
                    setFieldValue(
                      `series[${currentIndex}].altNrql.value`,
                      e.target.value
                    )
                  }
                  onBlur={handleBlur}
                  invalid={
                    values.series[currentIndex].altNrql?.key &&
                    errors.series &&
                    errors.series[currentIndex]?.altNrql?.value
                  }
                />
              </fieldset>
            </>
          )}
          <StepsPilot
            currentStep={currentStep}
            onPrevClick={() => handlePrevClick({ series: values.series })}
            onNextClick={handleSubmit}
          />
        </form>
      </div>
    </StepForm>
  );
};

StepFour.propTypes = {
  currentStep: PropTypes.number.isRequired,
  handlePrevClick: PropTypes.func.isRequired,
  handleNextClick: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired
};

export default StepFour;
