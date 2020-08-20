import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'nr1';
import { Formik } from 'formik';
import * as Yup from 'yup';
import StepForm from '../step-form';
import StepsPilot from '../../steps-pilot';
import Tabs from '../tabs';
import Dropdown from '../../dropdown';

const validationSchema = Yup.object().shape({
  series: Yup.array().of(
    Yup.object().shape({
      label: Yup.string().required('Is required'),
      nrqlWhere: Yup.string().required('Is required'),
      altNrql: Yup.object().shape({
        JavaScriptError: Yup.string()
      })
    })
  )
});

const SERIES_OBJECT_TEMPLATE = {
  label: 'New series',
  nrqlWhere: '',
  altNrql: {
    JavaScriptError: ''
  }
};

export default class StepFour extends Component {
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
      <StepForm title="Series">
        <div style={{ width: '50%' }}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            validateOnChange={false}
            onSubmit={values => {
              handleNextClick({ series: values.series });
            }}
          >
            {({ values, errors, setFieldValue, handleSubmit }) => (
              <>
                <Tabs
                  errorIndexes={errors.series?.map(
                    (error, index) => error && index
                  )}
                  currentIndex={currentIndex}
                  items={values.series}
                  handleOnTabChange={this.handleTabChange}
                  handleOnDelete={index => {
                    const series = values.series.splice(index, 1);
                    setFieldValue('values.series', series);
                    this.setState({
                      currentIndex:
                        currentIndex > 0 ? currentIndex - 1 : currentIndex
                    });
                  }}
                  handleOnAdd={() => {
                    const series = values.series;
                    series.push(SERIES_OBJECT_TEMPLATE);
                    setFieldValue('values.series', series);
                    this.setState({ currentIndex: series.length - 1 });
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
                          setFieldValue(
                            `series[${currentIndex}].label`,
                            e.target.value
                          )
                        }
                        invalid={
                          errors.series && errors.series[currentIndex]?.label
                        }
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
                        invalid={
                          errors.series &&
                          errors.series[currentIndex]?.nrqlWhere
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
                              `series[${currentIndex}].altNrql.key`,
                              value
                            )
                          }
                          value={values.series[currentIndex].altNrql?.key}
                          errorMessage={
                            errors.series &&
                            errors.series[currentIndex].altNrql?.key
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
                          invalid={
                            errors.series &&
                            errors.series[currentIndex]?.altNrql.value
                          }
                        />
                      </fieldset>
                    </>
                  )}
                  <StepsPilot
                    currentStep={currentStep}
                    onPrevClick={() =>
                      handlePrevClick({ series: values.series })
                    }
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

StepFour.propTypes = {
  currentStep: PropTypes.number.isRequired,
  handlePrevClick: PropTypes.func.isRequired,
  handleNextClick: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired
};
