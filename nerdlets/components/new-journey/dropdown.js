import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, SelectItem } from 'nr1';

export default class Dropdown extends Component {
  handleOnClick = value => {
    const { onChange } = this.props;
    onChange(value);
  };

  render() {
    const {
      value,
      items,
      label,
      disabled,
      className,
      errorMessage
    } = this.props;

    return (
      <div className={className}>
        <Select
          label={label}
          disabled={disabled}
          value={value}
          onChange={(_, value) => {
            this.handleOnClick(value);
          }}
        >
          <SelectItem value="">--- empty value ---</SelectItem>
          {items?.map(({ label, value }, index) => (
            <SelectItem value={value} key={index}>
              {label}
            </SelectItem>
          ))}
        </Select>
        <p className="error-message">{!disabled && errorMessage}</p>
      </div>
    );
  }
}
Dropdown.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  label: PropTypes.string,
  items: PropTypes.array.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  errorMessage: PropTypes.string
};
