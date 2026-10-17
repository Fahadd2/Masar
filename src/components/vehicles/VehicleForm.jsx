import { useEffect, useRef, useState } from 'react';
import { DEPARTMENTS, STATUSES, VEHICLE_TYPES } from '../../constants/vehicle.js';
import { useToast } from '../../context/ToastContext.jsx';
import { ValidationError } from '../../services/vehicleService.js';
import { MAX_LENGTHS } from '../../utils/validateVehicle.js';
import Button from '../common/Button.jsx';
import FormField from '../common/FormField.jsx';
import styles from './VehicleForm.module.css';

const LABELS = {
  plateNumber: 'Plate number',
  make: 'Make',
  model: 'Model',
  year: 'Year',
  type: 'Type',
  status: 'Status',
  department: 'Department',
  assignedDriver: 'Assigned driver',
  mileage: 'Mileage (km)',
  nextServiceDate: 'Next service date',
  purchaseDate: 'Purchase date',
  purchasePrice: 'Purchase price (SAR)',
};

// Field order = on-screen order, used for the error summary.
const FIELD_ORDER = Object.keys(LABELS);

function describedBy(id, hint, error) {
  const ids = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean);
  return ids.length ? ids.join(' ') : undefined;
}

/**
 * Shared Add/Edit form (DESIGN §4.1, §5.1). Validation messages appear after a field is left
 * (blur) or after a submit; on a failed submit an error summary appears and receives focus.
 * onSubmit(values) returns a Promise; if it rejects with ValidationError, its field errors are shown.
 */
export default function VehicleForm({ mode, initialValues, validate, onSubmit, onCancel }) {
  const { notify } = useToast();
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [serviceErrors, setServiceErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [failedSubmits, setFailedSubmits] = useState(0);
  const summaryRef = useRef(null);

  const errors = validate(values);
  const visibleError = (field) => ((touched[field] || submitted) && errors[field]) || serviceErrors[field];
  const summary = submitted ? FIELD_ORDER.filter((name) => visibleError(name)) : [];

  // Move focus to the error summary after each failed submit.
  useEffect(() => {
    if (failedSubmits > 0) summaryRef.current?.focus();
  }, [failedSubmits]);

  function handleChange(event) {
    const { name } = event.target;
    let { value } = event.target;
    if (name === 'plateNumber') value = value.toUpperCase();
    setValues((current) => {
      const next = { ...current, [name]: value };
      // A Retired vehicle has no driver (V-DR-2): clear the field when switching to Retired.
      if (name === 'status' && value === 'Retired') next.assignedDriver = '';
      return next;
    });
    setServiceErrors((current) => ({ ...current, [name]: undefined }));
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((current) => ({ ...current, [name]: true }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length > 0) {
      setFailedSubmits((count) => count + 1);
      return;
    }
    setSaving(true);
    try {
      await onSubmit(values);
    } catch (error) {
      if (error instanceof ValidationError) {
        setServiceErrors(error.fieldErrors);
        setFailedSubmits((count) => count + 1);
      } else {
        notify({ type: 'error', message: error.message || 'Something went wrong. Your changes were not saved.' });
      }
    } finally {
      setSaving(false);
    }
  }

  // Props shared by every control.
  function control(name, extra = {}) {
    const error = visibleError(name);
    return {
      id: name,
      name,
      value: values[name],
      onChange: handleChange,
      onBlur: handleBlur,
      className: 'input',
      'aria-invalid': error ? true : undefined,
      'aria-describedby': describedBy(name, extra.hint, error),
      ...extra.props,
    };
  }

  function field(name, { required = true, hint, render }) {
    return (
      <FormField id={name} label={LABELS[name]} required={required} hint={hint} error={visibleError(name)}>
        {render(control(name, { hint }))}
      </FormField>
    );
  }

  const isRetired = values.status === 'Retired';
  let driverHint = 'Optional.';
  if (values.status === 'In Use') driverHint = 'Required when the status is In Use.';
  if (isRetired) driverHint = 'Not used for Retired vehicles.';

  const select = (options, placeholder) => (props) => (
    <select {...props}>
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <p className="muted">
        Fields marked <span aria-hidden="true">*</span>
        <span className="visually-hidden">with an asterisk</span> are required.
      </p>

      {summary.length > 0 && (
        <div ref={summaryRef} className={styles.summary} tabIndex={-1}>
          <p className={styles.summaryTitle}>
            Please fix {summary.length === 1 ? '1 error' : `${summary.length} errors`} before saving:
          </p>
          <ul>
            {summary.map((name) => (
              <li key={name}>
                <a
                  href={`#${name}`}
                  onClick={(event) => {
                    event.preventDefault();
                    document.getElementById(name)?.focus();
                  }}
                >
                  {visibleError(name)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <fieldset className={styles.fieldset}>
        <legend>Identification</legend>
        <div className={styles.grid}>
          {field('plateNumber', {
            hint: 'Format: ABD 1234',
            render: (props) => <input {...props} maxLength={MAX_LENGTHS.plateNumber} autoComplete="off" />,
          })}
          {field('make', { render: (props) => <input {...props} maxLength={MAX_LENGTHS.make} /> })}
          {field('model', { render: (props) => <input {...props} maxLength={MAX_LENGTHS.model} /> })}
          {field('year', {
            render: (props) => <input {...props} type="number" inputMode="numeric" min="1990" step="1" />,
          })}
          {field('type', { render: select(VEHICLE_TYPES, 'Select a type') })}
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend>Assignment</legend>
        <div className={styles.grid}>
          {field('status', { render: select(STATUSES) })}
          {field('department', { render: select(DEPARTMENTS, 'Select a department') })}
          {field('assignedDriver', {
            required: values.status === 'In Use',
            hint: driverHint,
            render: (props) => <input {...props} maxLength={MAX_LENGTHS.assignedDriver} disabled={isRetired} />,
          })}
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend>Usage and service</legend>
        <div className={styles.grid}>
          {field('mileage', {
            render: (props) => (
              <div className={styles.affix}>
                <input {...props} type="number" inputMode="numeric" min="0" step="1" />
                <span aria-hidden="true">km</span>
              </div>
            ),
          })}
          {field('nextServiceDate', {
            required: !isRetired,
            hint: isRetired ? 'Optional for Retired vehicles.' : undefined,
            render: (props) => <input {...props} type="date" />,
          })}
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend>Purchase</legend>
        <div className={styles.grid}>
          {field('purchaseDate', { render: (props) => <input {...props} type="date" /> })}
          {field('purchasePrice', {
            render: (props) => (
              <div className={`${styles.affix} ${styles.prefix}`}>
                <span aria-hidden="true">SAR</span>
                <input {...props} type="number" inputMode="decimal" min="0.01" step="0.01" />
              </div>
            ),
          })}
        </div>
      </fieldset>

      <div className={styles.actions}>
        <Button onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Save vehicle'}
        </Button>
      </div>
    </form>
  );
}
