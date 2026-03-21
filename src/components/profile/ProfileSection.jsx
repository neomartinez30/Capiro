import React, { useState } from "react";

/**
 * Collapsible section wrapper for profile forms.
 */
export default function ProfileSection({ title, icon, children, defaultOpen = true, count }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`profile-section ${open ? "profile-section--open" : ""}`}>
      <button type="button" className="profile-section__header" onClick={() => setOpen(!open)}>
        <div className="profile-section__title">
          {icon && <span className="profile-section__icon">{icon}</span>}
          <span>{title}</span>
          {count !== undefined && <span className="profile-section__count">{count}</span>}
        </div>
        <span className={`profile-section__chevron ${open ? "profile-section__chevron--open" : ""}`}>
          &#9662;
        </span>
      </button>
      {open && <div className="profile-section__body">{children}</div>}
    </div>
  );
}
