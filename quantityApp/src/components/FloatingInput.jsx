import { useState } from "react";

export default function FloatingInput({ id, type, label, value, onChange }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="input-group">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        required
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
