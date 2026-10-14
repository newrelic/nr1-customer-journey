import { useState } from 'react';

export const REQUIRED = 'Is required';

const isBlank = value =>
  value === undefined || value === null || String(value).trim() === '';

export const required = value => (isBlank(value) ? REQUIRED : undefined);

export const requiredNumber = value => {
  if (isBlank(value)) return REQUIRED;
  return Number.isNaN(Number(value)) ? 'Must be a number' : undefined;
};

// Keeps only the failing fields; returns undefined when nothing failed.
export const compact = errors => {
  const failing = Object.entries(errors).filter(([, v]) => v !== undefined);
  return failing.length ? Object.fromEntries(failing) : undefined;
};

// Validates every item in a list. Returns minMessage for an empty list (when
// given), an array of per-item errors when any item fails, or undefined.
export const validateList = (items = [], validateItem, minMessage) => {
  if (minMessage && items.length === 0) return minMessage;
  const errors = items.map(validateItem);
  return errors.some(Boolean) ? errors : undefined;
};

const toPath = path => path.replace(/\[(\d+)\]/g, '.$1').split('.');

// Returns a copy of obj with the value at path (e.g. `stats[0].value.nrql`)
// replaced, copying each object/array along the way.
export const setIn = (obj, path, value) => {
  const [key, ...rest] = typeof path === 'string' ? toPath(path) : path;
  const copy = Array.isArray(obj) ? [...obj] : { ...obj };
  if (rest.length === 0) {
    copy[key] = value;
  } else {
    const child = obj?.[key] ?? (/^\d+$/.test(rest[0]) ? [] : {});
    copy[key] = setIn(child, rest, value);
  }
  return copy;
};

/**
 * Minimal form state for the journey wizard steps. `validate(values)` returns
 * an errors object shaped like the values, holding only the failing fields.
 * Validation runs on blur and on submit; onSubmit is called only when valid.
 */
export const useStepForm = ({ initialValues, validate, onSubmit }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const runValidation = () => {
    const nextErrors = validate(values) || {};
    setErrors(nextErrors);
    return nextErrors;
  };

  const setFieldValue = (path, value) =>
    setValues(prev => setIn(prev, path, value));

  const handleBlur = () => {
    runValidation();
  };

  const handleSubmit = event => {
    if (event?.preventDefault) event.preventDefault();
    const nextErrors = runValidation();
    if (Object.keys(nextErrors).length === 0) {
      onSubmit(values);
    }
  };

  return { values, errors, setFieldValue, handleBlur, handleSubmit };
};
