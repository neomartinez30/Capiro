import React from "react";

/**
 * Profile page header with avatar, name, status badge, and action buttons.
 */
export default function ProfileHeader({
  name,
  subtitle,
  status = "active",
  onSave,
  onCancel,
  onImportLda,
  saving = false,
  dirty = false,
  entityType = "lobbyist",
}) {
  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="profile-header">
      <div className="profile-header__left">
        <div className="profile-header__avatar">{initials}</div>
        <div>
          <h1 className="profile-header__name">{name || "New Profile"}</h1>
          {subtitle && <p className="profile-header__subtitle">{subtitle}</p>}
        </div>
        <span className={`profile-header__status profile-header__status--${status}`}>
          {status}
        </span>
      </div>
      <div className="profile-header__actions">
        {onImportLda && (
          <button type="button" className="btn btn--outline" onClick={onImportLda}>
            Import from LDA
          </button>
        )}
        {dirty && onCancel && (
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
        {onSave && (
          <button
            type="button"
            className="btn btn--primary"
            onClick={onSave}
            disabled={saving || !dirty}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        )}
      </div>
    </div>
  );
}
