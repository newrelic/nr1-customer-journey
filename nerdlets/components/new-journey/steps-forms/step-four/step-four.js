import React, { Component } from 'react';
import { TextField } from 'nr1';
import { Formik } from 'formik';
import * as Yup from 'yup';
import StepForm from '../step-form';

class StepFour extends Component {
  render() {
    return (
      <StepForm title="Series">
        <div style={{ width: '50%' }}>
          <TextField
            label="Label"
            style={{ marginBottom: '16px' }}
            value=""
            onChange={() => console.log('title changed')}
          />
          <TextField
            label="NRQL Where"
            style={{ marginBottom: '16px' }}
            value=""
            onChange={() => console.log('funnel event')}
          />
          <TextField
            label="AltNRQL"
            style={{ marginBottom: '16px' }}
            value=""
            onChange={() => console.log('Funnel measure')}
          />
        </div>
      </StepForm>
    );
  }
}

export default StepFour;
