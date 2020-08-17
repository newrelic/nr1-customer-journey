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
      <>
        <Select
          label={label}
          disabled={disabled}
          value={value}
          className={className}
          onChange={(_, value) => {
            this.handleOnClick(value);
          }}
        >
          <SelectItem value="" className="disabled-option">
            -- Select option --
          </SelectItem>
          {items?.map(({ label, value }, index) => (
            <SelectItem value={value} key={index}>
              {label}
            </SelectItem>
          ))}
        </Select>

        <p className="error-message">{errorMessage}</p>
      </>
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
