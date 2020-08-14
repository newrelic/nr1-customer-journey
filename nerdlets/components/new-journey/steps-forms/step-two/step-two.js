import React, { Component } from 'react';
import { TextField } from 'nr1';
import StepForm from '../step-form';
// change textField value
class StepTwo extends Component {
  render() {
    return (
      <StepForm title="Stats">
        <div style={{ width: '50%' }}>
          <TextField
            label="Label"
            style={{ marginBottom: '16px' }}
            value=""
            onChange={() => console.log('Stats changed')}
          />
          <TextField
            label="Ref"
            style={{ marginBottom: '16px' }}
            value=""
            onChange={() => console.log('Ref')}
          />
          <TextField
            label="Type"
            style={{ marginBottom: '16px' }}
            value=""
            onChange={() => console.log('Type')}
          />
          <TextField
            label="Value"
            style={{ marginBottom: '16px' }}
            value=""
            onChange={() => console.log('Value')}
          />
        </div>
      </StepForm>
    );
  }
}

export default StepTwo;
