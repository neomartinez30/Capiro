import React, { useState, useCallback } from "react";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileSection from "../components/profile/ProfileSection";
import FormField from "../components/profile/FormField";
import LdaSearchModal from "../components/profile/LdaSearchModal";
import {
  mapLdaLobbyistToProfile,
  createLobbyistProfile,
  updateLobbyistProfile,
} from "../services/profileApi";
import { searchLobbyists, fetchFirmProfile } from "../services/ldaApi";

const EMPTY_PROFILE = {
  fullName: "", firstName: "", middleName: "", lastName: "",
  prefix: "", suffix: "", nickname: "", displayName: "",
  ldaLobbyistId: null, status: "active", profilePhoto: "",
  bio: "", officeLocation: "", workEmail: "", phone: "",
  websiteUrl: "", linkedinUrl: "",
  currentFirm: "", ldaRegistrantId: null, title: "",
  employmentType: "", startDate: "", priorFirms: [],
  supervisingPartner: "",
  policyAreas: [], industryFocus: [], chamberAgencyFocus: [],
  scope: "", keywords: [], languages: [], geographicCoverage: [],
  senateRegistrantId: null, houseId: null,
  linkedLd1Filings: [], linkedLd2Filings: [], linkedLd203Filings: [],
  coveredPositions: [], convictionDisclosures: [],
  foreignEntityRelationships: [], affiliatedOrganizations: [],
  filingHistory: [], amendmentHistory: [], lastFilingDate: "",
  contributionReportAssociations: [],
  currentClients: [], historicalClients: [],
  issuesLobbied: [], governmentEntitiesContacted: [],
  quarterlyIncomeRanges: [], quarterlyExpenseRanges: [],
  numberOfActiveMatters: 0, numberOfFilingsThisYear: 0, recencyScore: 0,
  meetingHistory: [], notes: "", relationshipMap: [],
  stakeholderTags: [], internalDealOwner: "",
  uploadedDocuments: [],
  websiteScrapedCapabilities: "", newsMentions: [], socialMediaMentions: [],
};

const EMPLOYMENT_TYPES = [
  { value: "firm_lobbyist", label: "Firm Lobbyist" },
  { value: "in_house", label: "In-House" },
  { value: "sole_proprietor", label: "Sole Proprietor" },
];

const SCOPE_OPTIONS = [
  { value: "federal", label: "Federal" },
  { value: "state", label: "State" },
  { value: "both", label: "Both" },
];

export default function LobbyistProfilePage() {
  const [profile, setProfile] = useState({ ...EMPTY_PROFILE });
  const [original, setOriginal] = useState({ ...EMPTY_PROFILE });
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
        await updateLobbyistProfile(profile.id, profile);
      } else {
        const created = await createLobbyistProfile(profile);
        setProfile((p) => ({ ...p, id: created.id }));
      }
      setOriginal({ ...profile });
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setProfile({ ...original });
  };

  const handleLdaImport = async (registrant) => {
    setLdaModalOpen(false);
    setImportStatus("Fetching LDA data...");
    try {
      // Fetch lobbyists for this registrant
      const lobbyistsData = await searchLobbyists({ registrantId: registrant.id, pageSize: 25 });
      const lobbyists = lobbyistsData.results || [];

      // Also fetch firm profile for enrichment
      const firmData = await fetchFirmProfile(registrant.id).catch(() => null);

      if (lobbyists.length > 0) {
        // Use first lobbyist as base (user can switch later)
        const mapped = mapLdaLobbyistToProfile(lobbyists[0], registrant);

        // Enrich with filing data
        if (firmData) {
          mapped.currentClients = (firmData.clients || []).map((c) => c.name);
          mapped.issuesLobbied = firmData.issueAreas || [];
          mapped.governmentEntitiesContacted = firmData.governmentEntities || [];
          mapped.numberOfFilingsThisYear = (firmData.filings || []).length;

          // Extract covered positions from filings
          const positions = new Set();
          (firmData.filings || []).forEach((f) => {
            (f.lobbying_activities || []).forEach((a) => {
              (a.lobbyists || []).forEach((l) => {
                if (l.covered_position) positions.add(l.covered_position);
              });
            });
          });
          mapped.coveredPositions = Array.from(positions);
        }

        setProfile((p) => ({ ...p, ...mapped }));
        setImportStatus(`Imported ${lobbyists[0].first_name} ${lobbyists[0].last_name} from ${registrant.name}`);
      } else {
        setImportStatus("No lobbyists found for this registrant.");
      }
    } catch (err) {
      setImportStatus(`Import failed: ${err.message}`);
    }
  };

  return (
    <div className="profile-page">
      <ProfileHeader
        name={profile.fullName || profile.displayName}
        subtitle={profile.currentFirm ? `${profile.title || "Lobbyist"} at ${profile.currentFirm}` : ""}
        status={profile.status}
        onSave={handleSave}
        onCancel={handleCancel}
        onImportLda={() => setLdaModalOpen(true)}
        saving={saving}
        dirty={dirty}
        entityType="lobbyist"
      />

      {importStatus && (
        <div className="profile-page__status">
          {importStatus}
          <button type="button" className="profile-page__status-close" onClick={() => setImportStatus("")}>&times;</button>
        </div>
      )}

      <div className="profile-page__body">
        {/* ── Identity ── */}
        <ProfileSection title="Identity" icon="&#128100;" defaultOpen={true}>
          <div className="form-grid form-grid--3">
            <FormField label="Prefix" name="prefix" value={profile.prefix} onChange={updateField} ldaSource />
            <FormField label="First Name" name="firstName" value={profile.firstName} onChange={updateField} required ldaSource />
            <FormField label="Middle Name" name="middleName" value={profile.middleName} onChange={updateField} ldaSource />
            <FormField label="Last Name" name="lastName" value={profile.lastName} onChange={updateField} required ldaSource />
            <FormField label="Suffix" name="suffix" value={profile.suffix} onChange={updateField} ldaSource />
            <FormField label="Nickname" name="nickname" value={profile.nickname} onChange={updateField} ldaSource />
          </div>
          <div className="form-grid form-grid--2">
            <FormField label="Display Name" name="displayName" value={profile.displayName} onChange={updateField} />
            <FormField label="Full Name" name="fullName" value={profile.fullName} onChange={updateField} readOnly />
          </div>
          <div className="form-grid form-grid--2">
            <FormField
              label="Status"
              name="status"
              value={profile.status}
              onChange={updateField}
              type="select"
              options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]}
            />
            <FormField label="LDA Lobbyist ID" name="ldaLobbyistId" value={profile.ldaLobbyistId} onChange={updateField} readOnly ldaSource />
          </div>
          <FormField label="Bio / Summary" name="bio" value={profile.bio} onChange={updateField} type="textarea" placeholder="AI-generated summary will appear here..." />
          <FormField label="Profile Photo URL" name="profilePhoto" value={profile.profilePhoto} onChange={updateField} placeholder="https://..." />
        </ProfileSection>

        {/* ── Contact ── */}
        <ProfileSection title="Contact Information" icon="&#128222;">
          <div className="form-grid form-grid--2">
            <FormField label="Work Email" name="workEmail" value={profile.workEmail} onChange={updateField} type="email" />
            <FormField label="Phone" name="phone" value={profile.phone} onChange={updateField} type="tel" />
            <FormField label="Office Location" name="officeLocation" value={profile.officeLocation} onChange={updateField} />
            <FormField label="Website URL" name="websiteUrl" value={profile.websiteUrl} onChange={updateField} type="url" />
            <FormField label="LinkedIn URL" name="linkedinUrl" value={profile.linkedinUrl} onChange={updateField} type="url" />
          </div>
        </ProfileSection>

        {/* ── Employment ── */}
        <ProfileSection title="Employment" icon="&#127970;">
          <div className="form-grid form-grid--2">
            <FormField label="Current Firm / Registrant" name="currentFirm" value={profile.currentFirm} onChange={updateField} ldaSource />
            <FormField label="LDA Registrant ID" name="ldaRegistrantId" value={profile.ldaRegistrantId} onChange={updateField} readOnly ldaSource />
            <FormField label="Title / Role" name="title" value={profile.title} onChange={updateField} placeholder="e.g. Partner, Associate" />
            <FormField
              label="Employment Type"
              name="employmentType"
              value={profile.employmentType}
              onChange={updateField}
              type="select"
              options={EMPLOYMENT_TYPES}
            />
            <FormField label="Start Date" name="startDate" value={profile.startDate} onChange={updateField} type="date" />
            <FormField label="Supervising Partner" name="supervisingPartner" value={profile.supervisingPartner} onChange={updateField} />
          </div>
          <FormField label="Prior Firms / Employment History" name="priorFirms" value={profile.priorFirms} onChange={updateField} type="tags" placeholder="Add prior firm..." />
        </ProfileSection>

        {/* ── Expertise ── */}
        <ProfileSection title="Expertise & Focus" icon="&#127919;">
          <FormField label="Policy Areas / Issue Areas" name="policyAreas" value={profile.policyAreas} onChange={updateField} type="tags" placeholder="Add policy area..." ldaSource />
          <FormField label="Industry Focus" name="industryFocus" value={profile.industryFocus} onChange={updateField} type="tags" placeholder="Add industry..." />
          <FormField label="Chamber / Agency Focus" name="chamberAgencyFocus" value={profile.chamberAgencyFocus} onChange={updateField} type="tags" placeholder="Add chamber or agency..." ldaSource />
          <div className="form-grid form-grid--2">
            <FormField
              label="Scope"
              name="scope"
              value={profile.scope}
              onChange={updateField}
              type="select"
              options={SCOPE_OPTIONS}
            />
          </div>
          <FormField label="Keywords / Specialties" name="keywords" value={profile.keywords} onChange={updateField} type="tags" placeholder="Add keyword..." />
          <FormField label="Languages" name="languages" value={profile.languages} onChange={updateField} type="tags" placeholder="Add language..." />
          <FormField label="Geographic Coverage" name="geographicCoverage" value={profile.geographicCoverage} onChange={updateField} type="tags" placeholder="Add region/state..." />
        </ProfileSection>

        {/* ── LDA Filings ── */}
        <ProfileSection title="LDA Filing Links" icon="&#128196;" defaultOpen={false}>
          <div className="form-grid form-grid--2">
            <FormField label="Senate Registrant ID" name="senateRegistrantId" value={profile.senateRegistrantId} onChange={updateField} readOnly ldaSource />
            <FormField label="House ID" name="houseId" value={profile.houseId} onChange={updateField} readOnly ldaSource />
          </div>
          <FormField label="Linked LD-1 Filings" name="linkedLd1Filings" value={profile.linkedLd1Filings} onChange={updateField} type="tags" placeholder="Add LD-1 filing UUID..." ldaSource />
          <FormField label="Linked LD-2 Filings" name="linkedLd2Filings" value={profile.linkedLd2Filings} onChange={updateField} type="tags" placeholder="Add LD-2 filing UUID..." ldaSource />
          <FormField label="Linked LD-203 Filings" name="linkedLd203Filings" value={profile.linkedLd203Filings} onChange={updateField} type="tags" placeholder="Add LD-203 filing UUID..." ldaSource />
        </ProfileSection>

        {/* ── Compliance ── */}
        <ProfileSection title="Compliance & Disclosures" icon="&#128274;" defaultOpen={false}>
          <FormField label="Covered Executive/Legislative Branch Positions" name="coveredPositions" value={profile.coveredPositions} onChange={updateField} type="tags" ldaSource />
          <FormField label="Conviction Disclosures" name="convictionDisclosures" value={profile.convictionDisclosures} onChange={updateField} type="tags" ldaSource helpText="If applicable — from LD-2 filings" />
          <FormField label="Foreign Entity Relationships" name="foreignEntityRelationships" value={profile.foreignEntityRelationships} onChange={updateField} type="tags" />
          <FormField label="Affiliated Organizations" name="affiliatedOrganizations" value={profile.affiliatedOrganizations} onChange={updateField} type="tags" />
        </ProfileSection>

        {/* ── Clients & Activity ── */}
        <ProfileSection title="Clients & Lobbying Activity" icon="&#128188;">
          <FormField label="Current Clients" name="currentClients" value={profile.currentClients} onChange={updateField} type="tags" ldaSource />
          <FormField label="Historical Clients" name="historicalClients" value={profile.historicalClients} onChange={updateField} type="tags" />
          <FormField label="Issues Lobbied" name="issuesLobbied" value={profile.issuesLobbied} onChange={updateField} type="tags" ldaSource />
          <FormField label="Government Entities Contacted" name="governmentEntitiesContacted" value={profile.governmentEntitiesContacted} onChange={updateField} type="tags" ldaSource />
        </ProfileSection>

        {/* ── Financials ── */}
        <ProfileSection title="Financial Summary" icon="&#128176;" defaultOpen={false}>
          <div className="form-grid form-grid--3">
            <FormField label="Active Matters" name="numberOfActiveMatters" value={profile.numberOfActiveMatters} onChange={updateField} type="number" />
            <FormField label="Filings This Year" name="numberOfFilingsThisYear" value={profile.numberOfFilingsThisYear} onChange={updateField} type="number" ldaSource />
            <FormField label="Recency Score" name="recencyScore" value={profile.recencyScore} onChange={updateField} type="number" />
          </div>
          <FormField label="Quarterly Income Ranges" name="quarterlyIncomeRanges" value={profile.quarterlyIncomeRanges} onChange={updateField} type="tags" placeholder="e.g. Q1 2026: $50K-$100K" />
          <FormField label="Quarterly Expense Ranges" name="quarterlyExpenseRanges" value={profile.quarterlyExpenseRanges} onChange={updateField} type="tags" placeholder="e.g. Q1 2026: $10K-$25K" />
        </ProfileSection>

        {/* ── Filing History ── */}
        <ProfileSection title="Filing & Amendment History" icon="&#128197;" defaultOpen={false} count={profile.filingHistory.length}>
          <FormField label="Filing History" name="filingHistory" value={profile.filingHistory} onChange={updateField} type="tags" ldaSource />
          <FormField label="Amendment History" name="amendmentHistory" value={profile.amendmentHistory} onChange={updateField} type="tags" ldaSource />
          <FormField label="Last Filing Date" name="lastFilingDate" value={profile.lastFilingDate} onChange={updateField} type="date" ldaSource />
          <FormField label="Contribution Report Associations" name="contributionReportAssociations" value={profile.contributionReportAssociations} onChange={updateField} type="tags" ldaSource />
        </ProfileSection>

        {/* ── Internal ── */}
        <ProfileSection title="Internal & CRM" icon="&#128203;" defaultOpen={false}>
          <FormField label="Notes" name="notes" value={profile.notes} onChange={updateField} type="textarea" placeholder="Internal notes..." />
          <FormField label="Stakeholder Tags" name="stakeholderTags" value={profile.stakeholderTags} onChange={updateField} type="tags" />
          <FormField label="Internal Deal/Account Owner" name="internalDealOwner" value={profile.internalDealOwner} onChange={updateField} />
          <FormField label="Meeting History" name="meetingHistory" value={profile.meetingHistory} onChange={updateField} type="tags" placeholder="Add meeting reference..." />
        </ProfileSection>

        {/* ── AI / Web ── */}
        <ProfileSection title="AI & Web Intelligence" icon="&#10024;" defaultOpen={false}>
          <FormField label="Website-Scraped Capabilities" name="websiteScrapedCapabilities" value={profile.websiteScrapedCapabilities} onChange={updateField} type="textarea" placeholder="AI will populate this field..." />
          <FormField label="News Mentions" name="newsMentions" value={profile.newsMentions} onChange={updateField} type="tags" placeholder="AI will populate..." />
          <FormField label="Social Media Mentions" name="socialMediaMentions" value={profile.socialMediaMentions} onChange={updateField} type="tags" placeholder="AI will populate..." />
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
