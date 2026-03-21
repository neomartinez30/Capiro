import React, { useState, useCallback } from "react";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileSection from "../components/profile/ProfileSection";
import FormField from "../components/profile/FormField";
import { createClientProfile, updateClientProfile } from "../services/profileApi";

const EMPTY_CLIENT = {
  name: "", ldaClientId: null, generalDescription: "",
  clientGovernmentEntity: false, clientSelfSelect: false,
  state: "", stateDisplay: "", country: "", countryDisplay: "",
  status: "active",
  registrantName: "", ldaRegistrantId: null,
  issuesLobbied: [], governmentEntitiesContacted: [],
  filingHistory: [], lastFilingDate: "",
  notes: "", stakeholderTags: [], internalDealOwner: "",
};

export default function ClientProfilePage() {
  const [profile, setProfile] = useState({ ...EMPTY_CLIENT });
  const [original, setOriginal] = useState({ ...EMPTY_CLIENT });
  const [saving, setSaving] = useState(false);

  const dirty = JSON.stringify(profile) !== JSON.stringify(original);

  const updateField = useCallback((name, value) => {
    setProfile((p) => ({ ...p, [name]: value }));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (profile.id) {
        await updateClientProfile(profile.id, profile);
      } else {
        const created = await createClientProfile(profile);
        setProfile((p) => ({ ...p, id: created.id }));
      }
      setOriginal({ ...profile });
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => setProfile({ ...original });

  return (
    <div className="profile-page">
      <ProfileHeader
        name={profile.name}
        subtitle={profile.registrantName ? `Registrant: ${profile.registrantName}` : ""}
        status={profile.status}
        onSave={handleSave}
        onCancel={handleCancel}
        saving={saving}
        dirty={dirty}
        entityType="client"
      />

      <div className="profile-page__body">
        <ProfileSection title="Client Identity" icon="&#128188;" defaultOpen={true}>
          <div className="form-grid form-grid--2">
            <FormField label="Client Name" name="name" value={profile.name} onChange={updateField} required ldaSource />
            <FormField label="LDA Client ID" name="ldaClientId" value={profile.ldaClientId} onChange={updateField} readOnly ldaSource />
            <FormField label="Registrant / Firm" name="registrantName" value={profile.registrantName} onChange={updateField} ldaSource />
            <FormField label="LDA Registrant ID" name="ldaRegistrantId" value={profile.ldaRegistrantId} onChange={updateField} readOnly ldaSource />
          </div>
          <FormField label="General Description" name="generalDescription" value={profile.generalDescription} onChange={updateField} type="textarea" placeholder="AI-generated description will appear here..." ldaSource />
          <div className="form-grid form-grid--3">
            <FormField label="State" name="state" value={profile.state} onChange={updateField} ldaSource />
            <FormField label="Country" name="country" value={profile.country} onChange={updateField} ldaSource />
            <FormField
              label="Status"
              name="status"
              value={profile.status}
              onChange={updateField}
              type="select"
              options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]}
            />
          </div>
        </ProfileSection>

        <ProfileSection title="Lobbying Activity" icon="&#127919;">
          <FormField label="Issues Lobbied" name="issuesLobbied" value={profile.issuesLobbied} onChange={updateField} type="tags" ldaSource />
          <FormField label="Government Entities Contacted" name="governmentEntitiesContacted" value={profile.governmentEntitiesContacted} onChange={updateField} type="tags" ldaSource />
        </ProfileSection>

        <ProfileSection title="Filing History" icon="&#128196;" defaultOpen={false} count={profile.filingHistory.length}>
          <FormField label="Filings" name="filingHistory" value={profile.filingHistory} onChange={updateField} type="tags" ldaSource />
          <FormField label="Last Filing Date" name="lastFilingDate" value={profile.lastFilingDate} onChange={updateField} type="date" ldaSource />
        </ProfileSection>

        <ProfileSection title="Internal" icon="&#128203;" defaultOpen={false}>
          <FormField label="Notes" name="notes" value={profile.notes} onChange={updateField} type="textarea" />
          <FormField label="Stakeholder Tags" name="stakeholderTags" value={profile.stakeholderTags} onChange={updateField} type="tags" />
          <FormField label="Internal Deal/Account Owner" name="internalDealOwner" value={profile.internalDealOwner} onChange={updateField} />
        </ProfileSection>
      </div>
    </div>
  );
}
