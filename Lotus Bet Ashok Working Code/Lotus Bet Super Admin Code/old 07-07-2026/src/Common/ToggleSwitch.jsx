import React from "react";

function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  loading = false,
}) {
  return (
    <div className="d-flex align-items-center gap-2">
      <div className="form-check form-switch mb-0">
        <input
          className="form-check-input"
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled || loading}
        />
      </div>

      {loading && (
        <div
          className="spinner-border spinner-border-sm"
          role="status"
        />
      )}
    </div>
  );
}

export default ToggleSwitch;