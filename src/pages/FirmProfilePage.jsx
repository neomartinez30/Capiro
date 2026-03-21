import React, { useState, useCallback } from "react";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileSection from "../components/profile/ProfileSection";
import FormField from "../components/profile/FormField";
import LdaSearchModal from "../components/profile/LdaSearchModal";
import { mapLdaRegistrantToFirmProfile, createFirmProfile, updateFirmProfile } from "../services/profileApi";
import { fetchFirmProfile } from "../services/ldaApi";

const EMPTY_FIRM = {
  name: "", ldaRegistrantId: null, houseRegistrantId: null,
  description: "", status: "active",
  address1: "", address2: "", address3: "", address4: "",
  city: "", state: "", stateDisplay: "", zip: "",
  country: "", countryDisplay: "", ppbCountry: "", ppbCountryDisplay: "",
  contactName: "", contactPhone: "", websiteUrl: "", linkedinUrl: "",
  lobbyists: [], currentClients: [], historicalClients: [],
  policyAreas: [], governmentEntities: [],
  filingHistory: [], contributions: [], lastFilingDate: "",
  notes: "", stakeholderTags: [], internalDealOwner: "", uploadedDocuments: [],
};

export default function FirmProfilePage() {
  const [profile, setProfile] = useState({ ...EMPTY_FIRM });
  const [original, setOriginal] = useState({ ...EMPTY_FIRM });
  const [saving, setSaving] = useState(false);
  const [ldaModalOpen, setLdaModalOpen] = useState(false);
  const [importStatus, setImportStatus] = useState("");

  const dirty = JSON.stringify(profile) !== JSON.stringify(original);

  const updateField = useCallback((name, value) => {
    setProfile((p) => ({ ...p, [name]: value }));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (profile.id) {
        await updateFirmProfile(profile.id, profile);
      } else {
        const created = await createFirmProfile(profile);
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

  const handleLdaImport = async (registrant) => {
    setLdaModalOpen(false);
    setImportStatus("Fetching full firm profile from LDA...");
    try {
      const firmData = await fetchFirmProfile(registrant.id);
      const mapped = mapLdaRegistrantToFirmProfile(registrant, {
        lobbyists: (firmData.lobbyists || []).map((l) =>
          [l.first_name, l.last_name].filter(Boolean).join(" ")
        ),
        clients: (firmData.clients || []).map((c) => c.name),
        issueAreas: firmData.issueAreas || [],
        governmentEntities: firmData.governmentEntities || [],
        filings: (firmData.filings || []).map((f) => `${f.filing_type_display} — ${f.filing_year} ${f.filing_period_display || ""}`),
        contributions: (firmData.contributions || []).map((c) => c.filing_uuid || ""),
      });
      setProfile((p) => ({ ...p, ...mapped }));
      setImportStatus(`Imported firm: ${registrant.name}`);
    } catch (err) {
      setImportStatus(`Import failed: ${err.message}`);
    }
  };

  return (
    <div className="profile-page">
      <ProfileHeader
        name={profile.name}
        subtitle={profile.city ? `${profile.city}, ${profile.stateDisplay || profile.state}` : ""}
        status={profile.status}
        onSave={handleSave}
        onCancel={handleCancel}
        onImportLda={() => setLdaModalOpen(true)}
        saving={saving}
        dirty={dirty}
        entityType="firm"
      />

      {importStatus && (
        <div className="profile-page__status">
          {importStatus}
          <button type="button" className="profile-page__status-close" onClick={() => setImportStatus("")}>&times;</button>
        </div>
      )}

      <div className="profile-page__body">
        <ProfileSection title="Firm Identity" icon="&#127970;" defaultOpen={true}>
          <div className="form-grid form-grid--2">
            <FormField label="Firm Name" name="name" value={profile.name} onChange={updateField} required ldaSource />
            <FormField label="LDA Registrant ID" name="ldaRegistrantId" value={profile.ldaRegistrantId} onChange={updateField} readOnly ldaSource />
            <FormField label="House Registrant ID" name="houseRegistrantId" value={profile.houseRegistrantId} onChange={updateField} readOnly ldaSource />
            <FormField
              label="Status"
              name="status"
              value={profile.status}
              onChange={updateField}
              type="select"
              options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]}
            />
          </div>
          <FormField label="Description" name="description" value={profile.description} onChange={updateField} type="textarea" placeholder="AI-generated description will appear here..." />
        </ProfileSection>

        <ProfileSection title="Address & Contact" icon="&#128205;">
          <div className="form-grid form-grid--2">
            <FormField label="Address Line 1" name="address1" value={profile.address1} onChange={updateField} ldaSource />
            <FormField label="Address Line 2" name="address2" value={profile.address2} onChange={updateField} ldaSource />
            <FormField label="City" name="city" value={profile.city} onChange={updateField} ldaSource />
            <FormField label="State" name="state" value={profile.state} onChange={updateField} ldaSource />
            <FormField label="ZIP" name="zip" value={profile.zip} onChange={updateField} ldaSource />
            <FormField label="Country" name="country" value={profile.country} onChange={updateField} ldaSource />
          </div>
          <div className="form-grid form-grid--2">
            <FormField label="Contact Name" name="contactName" value={profile.contactName} onChange={updateField} ldaSource />
            <FormField label="Contact Phone" name="contactPhone" value={profile.contactPhone} onChange={updateField} ldaSource />
            <FormField label="Website" name="websiteUrl" value={profile.websiteUrl} onChange={updateField} type="url" />
            <FormField label="LinkedIn" name="linkedinUrl" value={profile.linkedinUrl} onChange={updateField} type="url" />
          </div>
        </ProfileSection>

        <ProfileSection title="Lobbyists" icon="&#128101;" count={profile.lobbyists.length}>
          <FormField label="Lobbyists" name="lobbyists" value={profile.lobbyists} onChange={updateField} type="tags" ldaSource />
        </ProfileSection>

        <ProfileSection title="Clients" icon="&#128188;">
          <FormField label="Current Clients" name="currentClients" value={profile.currentClients} onChange={updateField} type="tags" ldaSource />
          <FormField label="Historical Clients" name="historicalClients" value={profile.historicalClients} onChange={updateField} type="tags" />
        </ProfileSection>

        <ProfileSection title="Practice Areas" icon="&#127919;">
          <FormField label="Policy / Issue Areas" name="policyAreas" value={profile.policyAreas} onChange={updateField} type="tags" ldaSource />
          <FormField label="Government Entities" name="governmentEntities" value={profile.governmentEntities} onChange={updateField} type="tags" ldaSource />
        </ProfileSection>

        <ProfileSection title="Filing History" icon="&#128196;" defaultOpen={false} count={profile.filingHistory.length}>
          <FormField label="Filings" name="filingHistory" value={profile.filingHistory} onChange={updateField} type="tags" ldaSource />
          <FormField label="Contribution Reports (LD-203)" name="contributions" value={profile.contributions} onChange={updateField} type="tags" ldaSource />
          <FormField label="Last Filing Date" name="lastFilingDate" value={profile.lastFilingDate} onChange={updateField} type="date" ldaSource />
        </ProfileSection>

        <ProfileSection title="Internal" icon="&#128203;" defaultOpen={false}>
          <FormField label="Notes" name="notes" value={profile.notes} onChange={updateField} type="textarea" />
          <FormField label="Stakeholder Tags" name="stakeholderTags" value={profile.stakeholderTags} onChange={updateField} type="tags" />
          <FormField label="Internal Deal/Account Owner" name="internalDealOwner" value={profile.internalDealOwner} onChange={updateField} />
        </ProfileSection>
      </div>

      <LdaSearchModal
        isOpen={ldaModalOpen}
        onClose={() => setLdaModalOpen(false)}
        onSelect={handleLdaImport}
      />
    </div>
  );
}
