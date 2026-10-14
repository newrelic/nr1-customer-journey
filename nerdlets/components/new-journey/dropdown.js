import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown as NrDropdown, DropdownItem } from 'nr1';

const EMPTY_ITEM = { label: '--- empty value ---', value: '' };

const Dropdown = ({
  value,
  items,
  label,
  disabled,
  className,
  errorMessage,
  onChange
}) => {
  // Several stats can share an event name, so drop repeated values.
  const options = [EMPTY_ITEM, ...(items || [])].filter(
    (item, index, all) => all.findIndex(o => o.value === item.value) === index
  );
  const selected = value ? options.find(item => item.value === value) : null;

  return (
    <div className={className}>
      <NrDropdown
        label={label}
        title={selected ? selected.label : 'Select...'}
        disabled={disabled}
      >
        {options.map(item => (
          <DropdownItem
            key={item.value || 'empty'}
            onClick={() => onChange(item.value)}
          >
            {item.label}
          </DropdownItem>
        ))}
      </NrDropdown>
      <p className="error-message">{!disabled && errorMessage}</p>
    </div>
  );
};

Dropdown.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  label: PropTypes.string,
  items: PropTypes.array.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  errorMessage: PropTypes.string
};

export default Dropdown;
