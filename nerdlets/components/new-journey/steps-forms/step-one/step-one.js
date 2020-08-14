import React, { Component } from 'react';
import { TextField } from 'nr1';
import StepForm from '../step-form';

class StepOne extends Component {
  render() {
    return (
      <StepForm title="Basic Info">
        <div style={{ width: '50%' }}>
          <TextField
            label="Title"
            style={{ marginBottom: '16px' }}
            value=""
            onChange={() => console.log('title changed')}
          />
          <TextField
            label="Funnel event"
            style={{ marginBottom: '16px' }}
            value=""
            onChange={() => console.log('funnel event')}
          />
          <TextField
            label="Funnel measure"
            style={{ marginBottom: '16px' }}
            value=""
            onChange={() => console.log('Funnel measure')}
          />
        </div>
      </StepForm>
    );
  }
}

export default StepOne;
