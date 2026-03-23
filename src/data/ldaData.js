// ═══════════════════════════════════════════════════════════════
// Static Product Configuration
//
// All firm-specific data (clients, lobbyists, topics, submissions,
// offices, filing periods) is fetched from DynamoDB via the Lambda API.
// This file only contains static product configuration.
// ═══════════════════════════════════════════════════════════════

// --- Billing Plans (Stripe integration) ---
export const plans = [
  {
    id: "plan_starter",
    name: "Starter",
    price: 299,
    interval: "month",
    seats: 3,
    features: [
      "5 active clients",
      "Basic AI drafting",
      "LD-2 filing tracker",
      "Email support",
    ],
  },
  {
    id: "plan_professional",
    name: "Professional",
    price: 799,
    interval: "month",
    seats: 10,
    features: [
      "25 active clients",
      "Advanced AI drafting + critique",
      "Multi-office routing",
      "Congressional office database",
      "Priority support",
    ],
    popular: true,
  },
  {
    id: "plan_enterprise",
    name: "Enterprise",
    price: null,
    interval: "month",
    seats: null,
    features: [
      "Unlimited clients",
      "Custom AI prompts",
      "Form automation",
      "SSO/SAML",
      "Dedicated CSM",
      "SLA guarantee",
      "API access",
    ],
  },
];
