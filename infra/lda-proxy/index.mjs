// ═══════════════════════════════════════════════════════════════
// Capiro Backend API (Lambda + DynamoDB + LDA Senate API)
//
// Routes via ?action= query parameter:
//   search       — Search LDA registrants
//   setupFirm    — Pull LDA data for a firm, store in DynamoDB
//   getFirmData  — Get all stored data for a firm
//   saveItem     — Save/update any entity
//   deleteItem   — Delete an entity
//
// DynamoDB single-table design (capiro-data):
//   PK: FIRM#<firmId>  SK: PROFILE               → firm profile
//   PK: FIRM#<firmId>  SK: CLIENT#<clientId>      → client
//   PK: FIRM#<firmId>  SK: LOBBYIST#<lobbyistId>  → lobbyist
//   PK: FIRM#<firmId>  SK: TOPIC#<topicId>        → topic/activity
//   PK: FIRM#<firmId>  SK: SUBMISSION#<id>        → submission
//   PK: FIRM#<firmId>  SK: FILING#<id>            → filing period
//   PK: OFFICE         SK: OFFICE#<officeId>      → congressional office
// ═══════════════════════════════════════════════════════════════

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import https from "https";

const TABLE = process.env.DYNAMODB_TABLE || "capiro-data";
const LDA_BASE = "https://lda.senate.gov/api/v1";
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

function ok(data) {
  return { statusCode: 200, headers: CORS, body: JSON.stringify(data) };
}
function fail(code, msg) {
  return { statusCode: code, headers: CORS, body: JSON.stringify({ error: msg }) };
}

// ── HTTP helper ────────────────────────────────────────────
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Capiro/1.0" } }, (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(new Error("Invalid JSON from LDA API"));
          }
        });
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

// ── Main handler ───────────────────────────────────────────
export const handler = async (event) => {
  const method = event.requestContext?.http?.method;
  if (method === "OPTIONS") {
    return { statusCode: 200, headers: CORS, body: "" };
  }

  const params = event.queryStringParameters || {};
  // Default to "search" for backwards compatibility with existing frontend
  const action = params.action || (params.search ? "search" : "unknown");

  let body = {};
  if (event.body) {
    try {
      const raw = event.isBase64Encoded
        ? Buffer.from(event.body, "base64").toString()
        : event.body;
      body = JSON.parse(raw);
    } catch {
      // ignore parse errors
    }
  }

  try {
    switch (action) {
      case "search":
        return await handleSearch(params);
      case "setupFirm":
        return await handleSetupFirm(body);
      case "getFirmData":
        return await handleGetFirmData(params);
      case "saveItem":
        return await handleSaveItem(body);
      case "deleteItem":
        return await handleDeleteItem(body);
      case "getOffices":
        return await handleGetOffices();
      case "getFilingPeriods":
        return await handleGetFilingPeriods();
      default:
        return fail(400, "Unknown action: " + action);
    }
  } catch (e) {
    console.error("Unhandled error:", e);
    return fail(500, e.message || "Internal server error");
  }
};

// ════════════════════════════════════════════════════════════
// ACTION: Search LDA registrants
// ════════════════════════════════════════════════════════════
async function handleSearch(params) {
  const search = params.search;
  if (!search) return fail(400, "Missing ?search= parameter");

  const url = `${LDA_BASE}/registrants/?search=${encodeURIComponent(search)}&format=json`;
  const data = await fetchJSON(url);

  const results = (data.results || []).slice(0, 20).map((r) => ({
    id: String(r.id),
    name: r.name || "",
    address: [r.address_1, r.address_2, r.city, r.state, r.zip]
      .filter(Boolean)
      .join(", "),
    description: r.description || r.general_description || "",
    contactName: r.contact_name || "",
    phone: r.contact_telephone || "",
    ldaRegistrationId: String(r.id),
    registrationDate: r.dt_updated || "",
  }));

  return ok({ count: data.count || results.length, results });
}

// ════════════════════════════════════════════════════════════
// ACTION: Set up firm — store profile + pull LDA filings
// ════════════════════════════════════════════════════════════
async function handleSetupFirm(body) {
  const { firmId, ldaRegistrantId, firmData } = body;
  if (!firmId || !firmData) return fail(400, "Missing firmId or firmData");

  const now = new Date().toISOString();

  // 1. Store firm profile
  await ddb.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        PK: `FIRM#${firmId}`,
        SK: "PROFILE",
        ...firmData,
        firmId,
        ldaRegistrantId: ldaRegistrantId || null,
        entityType: "firm",
        createdAt: now,
        updatedAt: now,
      },
    })
  );

  let clients = [];
  let lobbyistsArr = [];
  let topicsArr = [];

  // 2. If we have an LDA registrant ID, fetch filings for clients + lobbyists
  if (ldaRegistrantId) {
    try {
      const filingsUrl = `${LDA_BASE}/filings/?registrant_id=${ldaRegistrantId}&filing_type=LD-2&format=json&ordering=-filing_year,-filing_period`;
      const filingsData = await fetchJSON(filingsUrl);

      const clientMap = new Map();
      const lobbyistMap = new Map();
      const topicMap = new Map();

      for (const filing of filingsData.results || []) {
        // ── Extract client ─────────────────────────
        if (filing.client) {
          const cId = String(filing.client.id);
          if (!clientMap.has(cId)) {
            clientMap.set(cId, {
              id: `cli_${cId}`,
              ldaClientId: cId,
              name: filing.client.name || "",
              description:
                filing.client.general_description ||
                filing.client.description ||
                "",
              industry: guessIndustry(filing),
              country: filing.client.country || "US",
              state: filing.client.state || "",
              state_or_local_government:
                filing.client.state_or_local_government || false,
              status: "active",
              source: "lda",
              annualSpend:
                parseFloat(filing.amount_reported || filing.income || "0") || 0,
              latestFilingYear: filing.filing_year,
              latestFilingPeriod: filing.filing_period,
            });
          } else {
            // Accumulate spend across filings
            const existing = clientMap.get(cId);
            existing.annualSpend +=
              parseFloat(filing.amount_reported || filing.income || "0") || 0;
          }
        }

        // ── Extract lobbyists ──────────────────────
        for (const lob of filing.lobbyists || []) {
          const lobObj = lob.lobbyist || lob;
          const lId = String(lobObj.id);
          if (!lobbyistMap.has(lId)) {
            lobbyistMap.set(lId, {
              id: `lob_${lId}`,
              ldaLobbyistId: lId,
              name: `${lobObj.first_name || ""} ${lobObj.last_name || ""}`.trim(),
              firstName: lobObj.first_name || "",
              lastName: lobObj.last_name || "",
              prefix: lobObj.prefix || "",
              suffix: lobObj.suffix || "",
              coveredPosition: lob.covered_position || null,
              issueAreas: [],
              status: "active",
              source: "lda",
            });
          }
          if (lob.covered_position && !lobbyistMap.get(lId).coveredPosition) {
            lobbyistMap.get(lId).coveredPosition = lob.covered_position;
          }
        }

        // ── Extract lobbying activities → topics ───
        for (const act of filing.lobbying_activities || []) {
          const issueCode = act.general_issue_code || "GEN";
          const issueDisplay = act.general_issue_code_display || issueCode;
          const clientId = filing.client ? `cli_${filing.client.id}` : null;
          const descKey = (act.description || "").slice(0, 80);
          const topicKey = `${clientId}_${issueCode}_${descKey}`;

          if (!topicMap.has(topicKey)) {
            topicMap.set(topicKey, {
              id: `top_${randomId()}`,
              clientId,
              name: issueDisplay,
              description: act.description || "",
              issueArea: issueDisplay,
              issueCode,
              status: "active",
              priority: "medium",
              source: "lda",
              governmentEntities: (act.government_entities || []).map(
                (e) => e.name
              ),
              filingYear: filing.filing_year,
              filingPeriod: filing.filing_period,
            });
          }

          // Add issue area to lobbyists from this filing
          for (const lob of filing.lobbyists || []) {
            const lobObj = lob.lobbyist || lob;
            const lId = String(lobObj.id);
            const entry = lobbyistMap.get(lId);
            if (entry && !entry.issueAreas.includes(issueDisplay)) {
              entry.issueAreas.push(issueDisplay);
            }
          }
        }
      }

      clients = Array.from(clientMap.values());
      lobbyistsArr = Array.from(lobbyistMap.values());
      topicsArr = Array.from(topicMap.values());

      // 3. Write all entities to DynamoDB
      for (const client of clients) {
        await ddb.send(
          new PutCommand({
            TableName: TABLE,
            Item: {
              PK: `FIRM#${firmId}`,
              SK: `CLIENT#${client.id}`,
              GSI1PK: `CLIENT#${client.id}`,
              GSI1SK: `FIRM#${firmId}`,
              ...client,
              firmId,
              entityType: "client",
              createdAt: now,
            },
          })
        );
      }

      for (const lob of lobbyistsArr) {
        await ddb.send(
          new PutCommand({
            TableName: TABLE,
            Item: {
              PK: `FIRM#${firmId}`,
              SK: `LOBBYIST#${lob.id}`,
              ...lob,
              firmId,
              registrantId: firmId,
              entityType: "lobbyist",
              createdAt: now,
            },
          })
        );
      }

      for (const topic of topicsArr) {
        await ddb.send(
          new PutCommand({
            TableName: TABLE,
            Item: {
              PK: `FIRM#${firmId}`,
              SK: `TOPIC#${topic.id}`,
              GSI1PK: topic.clientId
                ? `CLIENT#${topic.clientId}`
                : `FIRM#${firmId}`,
              GSI1SK: `TOPIC#${topic.id}`,
              ...topic,
              firmId,
              entityType: "topic",
              createdAt: now,
            },
          })
        );
      }
    } catch (e) {
      console.error("LDA data fetch error:", e);
      // Don't fail setup — firm profile is already saved
    }
  }

  return ok({
    firm: { ...firmData, firmId, ldaRegistrantId },
    clients,
    lobbyists: lobbyistsArr,
    topics: topicsArr,
    submissions: [],
    offices: [],
    filingPeriods: [],
  });
}

// ════════════════════════════════════════════════════════════
// ACTION: Get all firm data from DynamoDB
// ════════════════════════════════════════════════════════════
async function handleGetFirmData(params) {
  const { firmId } = params;
  if (!firmId) return fail(400, "Missing firmId");

  const result = await ddb.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: { ":pk": `FIRM#${firmId}` },
    })
  );

  const data = {
    firm: null,
    clients: [],
    lobbyists: [],
    topics: [],
    submissions: [],
    filingPeriods: [],
    offices: [],
  };

  for (const item of result.Items || []) {
    const clean = stripKeys(item);
    const sk = item.SK;

    if (sk === "PROFILE") data.firm = clean;
    else if (sk.startsWith("CLIENT#")) data.clients.push(clean);
    else if (sk.startsWith("LOBBYIST#")) data.lobbyists.push(clean);
    else if (sk.startsWith("TOPIC#")) data.topics.push(clean);
    else if (sk.startsWith("SUBMISSION#")) data.submissions.push(clean);
    else if (sk.startsWith("FILING#")) data.filingPeriods.push(clean);
  }

  // Also fetch global offices (if any stored)
  try {
    const officeResult = await ddb.send(
      new QueryCommand({
        TableName: TABLE,
        KeyConditionExpression: "PK = :pk",
        ExpressionAttributeValues: { ":pk": "OFFICE" },
      })
    );
    data.offices = (officeResult.Items || []).map(stripKeys);
  } catch {
    // ignore
  }

  return ok(data);
}

// ════════════════════════════════════════════════════════════
// ACTION: Save / update an entity
// ════════════════════════════════════════════════════════════
async function handleSaveItem(body) {
  const { firmId, type, data } = body;
  if (!firmId || !type || !data)
    return fail(400, "Missing firmId, type, or data");

  const id = data.id || `${type.slice(0, 3)}_${randomId()}`;
  const skPrefix = type.toUpperCase();
  const now = new Date().toISOString();

  const item = {
    PK: type === "office" ? "OFFICE" : `FIRM#${firmId}`,
    SK: `${skPrefix}#${id}`,
    ...data,
    id,
    firmId,
    entityType: type,
    updatedAt: now,
  };

  if (!item.createdAt) item.createdAt = now;

  // GSI keys for cross-entity lookups
  if (type === "client") {
    item.GSI1PK = `CLIENT#${id}`;
    item.GSI1SK = `FIRM#${firmId}`;
  } else if (type === "topic" && data.clientId) {
    item.GSI1PK = `CLIENT#${data.clientId}`;
    item.GSI1SK = `TOPIC#${id}`;
  } else if (type === "submission" && data.topicId) {
    item.GSI1PK = `TOPIC#${data.topicId}`;
    item.GSI1SK = `SUBMISSION#${id}`;
  }

  await ddb.send(new PutCommand({ TableName: TABLE, Item: item }));

  return ok({ ...data, id });
}

// ════════════════════════════════════════════════════════════
// ACTION: Delete an entity
// ════════════════════════════════════════════════════════════
async function handleDeleteItem(body) {
  const { firmId, type, id } = body;
  if (!firmId || !type || !id)
    return fail(400, "Missing firmId, type, or id");

  await ddb.send(
    new DeleteCommand({
      TableName: TABLE,
      Key: {
        PK: type === "office" ? "OFFICE" : `FIRM#${firmId}`,
        SK: `${type.toUpperCase()}#${id}`,
      },
    })
  );

  return ok({ deleted: true });
}

// ════════════════════════════════════════════════════════════
// ACTION: Get congressional offices (seed from Congress.gov if empty)
// ════════════════════════════════════════════════════════════
async function handleGetOffices() {
  // Check if we already have offices in DynamoDB
  const existing = await ddb.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: { ":pk": "OFFICE" },
      Limit: 1,
    })
  );

  if (existing.Items && existing.Items.length > 0) {
    // Return all offices
    const all = await ddb.send(
      new QueryCommand({
        TableName: TABLE,
        KeyConditionExpression: "PK = :pk",
        ExpressionAttributeValues: { ":pk": "OFFICE" },
      })
    );
    return ok({ offices: (all.Items || []).map(stripKeys) });
  }

  // Seed offices from Congress.gov API
  let offices = [];
  try {
    const congressUrl =
      "https://api.congress.gov/v3/member?limit=100&currentMember=true&format=json&api_key=DEMO_KEY";
    const senateUrl = congressUrl + "&chamber=Senate";
    const houseUrl = congressUrl + "&chamber=House";

    const [senateData, houseData] = await Promise.all([
      fetchJSON(senateUrl).catch(() => ({ members: [] })),
      fetchJSON(houseUrl).catch(() => ({ members: [] })),
    ]);

    const allMembers = [
      ...(senateData.members || []).map((m) => ({ ...m, _chamber: "Senate" })),
      ...(houseData.members || []).map((m) => ({ ...m, _chamber: "House" })),
    ];

    for (const m of allMembers) {
      const id = `off_${m.bioguideId || randomId()}`;
      const party = (m.partyName || "").charAt(0) || "I";
      const chamber = m._chamber;
      const prefix = chamber === "Senate" ? "Sen." : "Rep.";
      const name = `${prefix} ${m.name || "Unknown"}`;
      const state = m.state || "";

      const office = {
        id,
        name,
        bioguideId: m.bioguideId || null,
        chamber,
        party,
        state,
        district: m.district || null,
        committee: m.terms?.item?.[0]?.committee || "",
        role: "Member",
        submissionPortal: m.officialWebsiteUrl || m.url || null,
        adoptedForms: chamber === "Senate",
        phone: m.officePhone || null,
        source: "congress_gov",
      };
      offices.push(office);
    }
  } catch (e) {
    console.error("Congress.gov fetch error:", e);
  }

  // If Congress.gov returned nothing, seed with a core set of senators
  if (offices.length === 0) {
    offices = SEED_OFFICES;
  }

  // Write to DynamoDB
  const now = new Date().toISOString();
  for (const office of offices) {
    await ddb.send(
      new PutCommand({
        TableName: TABLE,
        Item: {
          PK: "OFFICE",
          SK: `OFFICE#${office.id}`,
          ...office,
          entityType: "office",
          createdAt: now,
        },
      })
    );
  }

  return ok({ offices, seeded: true });
}

// ════════════════════════════════════════════════════════════
// ACTION: Get filing periods (computed dynamically)
// ════════════════════════════════════════════════════════════
async function handleGetFilingPeriods() {
  const now = new Date();
  const year = now.getFullYear();
  const periods = [];

  // Generate LD-2 quarterly periods for current year and next
  for (const y of [year, year + 1]) {
    const quarters = [
      { period: `Q1 ${y}`, due: `${y}-04-20` },
      { period: `Q2 ${y}`, due: `${y}-07-20` },
      { period: `Q3 ${y}`, due: `${y}-10-20` },
      { period: `Q4 ${y}`, due: `${y + 1}-01-20` },
    ];

    for (const q of quarters) {
      const dueDate = new Date(q.due);
      const daysLeft = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
      periods.push({
        id: `fp_${y}_${q.period.replace(/\s/g, "")}`,
        type: "LD-2",
        period: q.period,
        dueDate: q.due,
        status: daysLeft < 0 ? "past_due" : daysLeft < 30 ? "upcoming" : "future",
        daysLeft: Math.max(0, daysLeft),
      });
    }

    // LD-203 annual
    periods.push({
      id: `fp_${y}_LD203`,
      type: "LD-203",
      period: `${y} Year-End`,
      dueDate: `${y + 1}-01-30`,
      status:
        new Date(`${y + 1}-01-30`) < now
          ? "past_due"
          : Math.ceil((new Date(`${y + 1}-01-30`) - now) / 86400000) < 30
          ? "upcoming"
          : "future",
      daysLeft: Math.max(
        0,
        Math.ceil((new Date(`${y + 1}-01-30`) - now) / 86400000)
      ),
    });
  }

  return ok({ filingPeriods: periods.filter((p) => p.daysLeft < 400) });
}

// ── Seed offices (fallback if Congress.gov is unavailable) ──
const SEED_OFFICES = [
  { id: "off_s01", name: "Sen. Jack Reed (D-RI)", chamber: "Senate", party: "D", state: "RI", committee: "Armed Services", role: "Chair", submissionPortal: "https://reed.senate.gov/contact", adoptedForms: true, source: "seed" },
  { id: "off_s02", name: "Sen. Roger Wicker (R-MS)", chamber: "Senate", party: "R", state: "MS", committee: "Armed Services", role: "Ranking Member", submissionPortal: "https://wicker.senate.gov/contact", adoptedForms: true, source: "seed" },
  { id: "off_s03", name: "Sen. Patty Murray (D-WA)", chamber: "Senate", party: "D", state: "WA", committee: "Appropriations", role: "Chair", submissionPortal: "https://murray.senate.gov/contact", adoptedForms: true, source: "seed" },
  { id: "off_s04", name: "Sen. Susan Collins (R-ME)", chamber: "Senate", party: "R", state: "ME", committee: "Appropriations", role: "Ranking Member", submissionPortal: "https://collins.senate.gov/contact", adoptedForms: true, source: "seed" },
  { id: "off_s05", name: "Sen. Maria Cantwell (D-WA)", chamber: "Senate", party: "D", state: "WA", committee: "Commerce", role: "Chair", submissionPortal: "https://cantwell.senate.gov", adoptedForms: true, source: "seed" },
  { id: "off_s06", name: "Sen. Chuck Grassley (R-IA)", chamber: "Senate", party: "R", state: "IA", committee: "Judiciary", role: "Member", submissionPortal: "https://grassley.senate.gov/contact", adoptedForms: true, source: "seed" },
  { id: "off_s07", name: "Sen. Dick Durbin (D-IL)", chamber: "Senate", party: "D", state: "IL", committee: "Judiciary", role: "Chair", submissionPortal: "https://durbin.senate.gov/contact", adoptedForms: true, source: "seed" },
  { id: "off_s08", name: "Sen. John Thune (R-SD)", chamber: "Senate", party: "R", state: "SD", committee: "Commerce", role: "Ranking Member", submissionPortal: "https://thune.senate.gov/contact", adoptedForms: true, source: "seed" },
  { id: "off_s09", name: "Sen. Bernie Sanders (I-VT)", chamber: "Senate", party: "I", state: "VT", committee: "HELP", role: "Chair", submissionPortal: "https://sanders.senate.gov/contact", adoptedForms: true, source: "seed" },
  { id: "off_s10", name: "Sen. Debbie Stabenow (D-MI)", chamber: "Senate", party: "D", state: "MI", committee: "Agriculture", role: "Chair", submissionPortal: "https://stabenow.senate.gov", adoptedForms: true, source: "seed" },
  { id: "off_h01", name: "Rep. Mike Johnson (R-LA)", chamber: "House", party: "R", state: "LA", committee: "Speaker", role: "Speaker", submissionPortal: "https://mikejohnson.house.gov", adoptedForms: false, source: "seed" },
  { id: "off_h02", name: "Rep. Hakeem Jeffries (D-NY)", chamber: "House", party: "D", state: "NY", committee: "Minority Leader", role: "Minority Leader", submissionPortal: "https://jeffries.house.gov", adoptedForms: false, source: "seed" },
  { id: "off_h03", name: "Rep. Kay Granger (R-TX)", chamber: "House", party: "R", state: "TX", committee: "Appropriations", role: "Chair", submissionPortal: "https://granger.house.gov", adoptedForms: false, source: "seed" },
  { id: "off_h04", name: "Rep. Rosa DeLauro (D-CT)", chamber: "House", party: "D", state: "CT", committee: "Appropriations", role: "Ranking Member", submissionPortal: "https://delauro.house.gov", adoptedForms: false, source: "seed" },
  { id: "off_h05", name: "Rep. Frank Lucas (R-OK)", chamber: "House", party: "R", state: "OK", committee: "Science", role: "Chair", submissionPortal: "https://lucas.house.gov", adoptedForms: false, source: "seed" },
];

// ── Helpers ────────────────────────────────────────────────
function stripKeys(item) {
  const clean = { ...item };
  delete clean.PK;
  delete clean.SK;
  delete clean.GSI1PK;
  delete clean.GSI1SK;
  return clean;
}

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

function guessIndustry(filing) {
  const activities = filing.lobbying_activities || [];
  for (const act of activities) {
    const code = (act.general_issue_code_display || "").toLowerCase();
    if (code.includes("defense") || code.includes("homeland"))
      return "Defense & Aerospace";
    if (code.includes("health") || code.includes("medical") || code.includes("pharm"))
      return "Healthcare";
    if (code.includes("energy") || code.includes("fuel") || code.includes("nuclear"))
      return "Energy";
    if (code.includes("financ") || code.includes("bank") || code.includes("insurance"))
      return "Financial Services";
    if (code.includes("tech") || code.includes("computer") || code.includes("telecom"))
      return "Technology";
    if (code.includes("transport") || code.includes("aviation"))
      return "Transportation";
    if (code.includes("agri") || code.includes("food"))
      return "Agriculture & Food";
    if (code.includes("educat")) return "Education";
    if (code.includes("environ") || code.includes("clean") || code.includes("water"))
      return "Environment";
    if (code.includes("trade") || code.includes("tariff"))
      return "Trade & Commerce";
    if (code.includes("tax")) return "Tax Policy";
    if (code.includes("labor") || code.includes("employ"))
      return "Labor & Employment";
    if (code.includes("immig")) return "Immigration";
  }
  return "Government Affairs";
}
