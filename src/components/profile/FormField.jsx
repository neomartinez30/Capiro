import React from "react";

/**
 * Reusable shadcn/ui-style form field.
 * Supports text, textarea, select, multi-select (tags), and readonly display.
 */
export default function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  options = [],
  placeholder = "",
  readOnly = false,
  required = false,
  helpText = "",
  ldaSource = false,
}) {
  const handleChange = (e) => {
    onChange?.(name, e.target.value);
  };

  const id = `field-${name}`;

  return (
    <div className="form-field">
      <label className="form-field__label" htmlFor={id}>
        {label}
        {required && <span className="form-field__required">*</span>}
        {ldaSource && <span className="form-field__lda-badge">LDA</span>}
      </label>

      {type === "textarea" ? (
        <textarea
          id={id}
          className="form-field__input form-field__input--textarea"
          name={name}
          value={value || ""}
          onChange={handleChange}
          placeholder={placeholder}
          readOnly={readOnly}
          rows={3}
        />
      ) : type === "select" ? (
        <select
          id={id}
          className="form-field__input form-field__input--select"
          name={name}
          value={value || ""}
          onChange={handleChange}
          disabled={readOnly}
        >
          <option value="">Select...</option>
          {options.map((opt) => (
            <option key={opt.value || opt} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))}
        </select>
      ) : type === "tags" ? (
        <TagInput
          id={id}
          value={value || []}
          onChange={(v) => onChange?.(name, v)}
          placeholder={placeholder}
          readOnly={readOnly}
        />
      ) : (
        <input
          id={id}
          className="form-field__input"
          type={type}
          name={name}
          value={value || ""}
          onChange={handleChange}
          placeholder={placeholder}
          readOnly={readOnly}
        />
      )}

      {helpText && <p className="form-field__help">{helpText}</p>}
    </div>
  );
}

function TagInput({ id, value, onChange, placeholder, readOnly }) {
  const [input, setInput] = React.useState("");

  const addTag = () => {
    const tag = input.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInput("");
  };

  const removeTag = (tag) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && !input && value.length) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className="form-field__tags" id={id}>
      {value.map((tag) => (
        <span key={tag} className="form-field__tag">
          {tag}
          {!readOnly && (
            <button type="button" className="form-field__tag-remove" onClick={() => removeTag(tag)}>
              &times;
            </button>
          )}
        </span>
      ))}
      {!readOnly && (
        <input
          className="form-field__tag-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={value.length === 0 ? placeholder : ""}
        />
      )}
    </div>
  );
}
