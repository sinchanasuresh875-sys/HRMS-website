export default function Input({
  label,
  error,
  required = false,
  helperText,
  icon,
  className = '',
  id,
  type = 'text',
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`form-group ${error ? 'has-error' : ''} ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="required-star">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        {icon && <span className="input-icon-prefix">{icon}</span>}
        <input
          id={inputId}
          type={type}
          className={`form-input ${icon ? 'has-icon' : ''} ${error ? 'input-error' : ''}`}
          {...props}
        />
      </div>
      {error && <span className="form-error-msg">{error}</span>}
      {!error && helperText && <span className="form-helper-txt">{helperText}</span>}
    </div>
  );
}
