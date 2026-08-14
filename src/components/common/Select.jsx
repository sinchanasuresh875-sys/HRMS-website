export default function Select({
  label,
  error,
  required = false,
  options = [],
  placeholder = 'Select an option',
  className = '',
  id,
  children,
  ...props
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`form-group ${error ? 'has-error' : ''} ${className}`.trim()}>
      {label && (
        <label htmlFor={selectId} className="form-label">
          {label}
          {required && <span className="required-star">*</span>}
        </label>
      )}
      <div className="select-wrapper">
        <select
          id={selectId}
          className={`form-select ${error ? 'input-error' : ''}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => {
            const isObj = typeof opt === 'object';
            const val = isObj ? opt.value : opt;
            const lbl = isObj ? opt.label : opt;
            return (
              <option key={val} value={val}>
                {lbl}
              </option>
            );
          })}
          {children}
        </select>
        <span className="select-arrow">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
      {error && <span className="form-error-msg">{error}</span>}
    </div>
  );
}
