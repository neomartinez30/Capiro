# Capiro

An agentic AI platform that standardizes and automates legislative submission workflows for congressional offices and stakeholders.

Built with **React 18** + **Vite**. Deployed on **AWS EC2** with **Amazon Cognito** authentication.

---

## Pages

### Landing Page
Navbar, hero section, features grid, login/signup modal, footer, ambient background.

### Dashboard (Home Page)
Sidebar navigation, top bar, KPI cards, upcoming deadlines, task list, recent activity, AI insights, compliance health score, quick stats, and expandable live feed panel.

---

## Project Structure

```
capiro-landing/
├── public/
│   ├── logo-white.png
│   └── logo-black.png
├── src/
│   ├── components/
│   │   ├── GridBackground.jsx
│   │   ├── Particles.jsx
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── Features.jsx
│   │   ├── FeatureCard.jsx
│   │   ├── LoginModal.jsx
│   │   ├── Footer.jsx
│   │   └── dashboard/
│   │       ├── index.js
│   │       ├── Icons.jsx
│   │       ├── Sidebar.jsx
│   │       ├── Topbar.jsx
│   │       ├── KPICards.jsx
│   │       ├── DeadlineCard.jsx
│   │       ├── TasksCard.jsx
│   │       ├── ActivityCard.jsx
│   │       ├── InsightsCard.jsx
│   │       ├── HealthCard.jsx
│   │       ├── QuickStats.jsx
│   │       └── LiveFeedPanel.jsx
│   ├── config/
│   │   ├── brand.js
│   │   ├── cognito.js
│   │   ├── aws.js
│   │   └── integrations.js
│   ├── data/
│   │   └── dashboardMock.js
│   ├── pages/
│   │   └── DashboardPage.jsx
│   ├── styles/
│   │   ├── global.css
│   │   ├── Background.css
│   │   ├── Navbar.css
│   │   ├── Hero.css
│   │   ├── Features.css
│   │   ├── LoginModal.css
│   │   ├── Footer.css
│   │   └── Dashboard.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Quick Start

```bash
cd capiro-landing
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build        # outputs to dist/
npm run preview      # preview locally
```

---

## AWS Configuration

| File | Purpose |
|------|---------|
| `src/config/cognito.js` | Cognito User Pool, App Client, domain |
| `src/config/aws.js` | API Gateway, Lambda, S3, CloudFront, RDS, SNS/SES |
| `src/config/integrations.js` | Congress.gov, Federal Register, Twitter, NewsAPI, Salesforce |
| `src/data/dashboardMock.js` | All placeholder data with API endpoint mapping |

---

## Brand Reference

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#01226A` | Capiro Blue — major surfaces |
| Accent | `#3A6FF7` | Signal Blue — actions, links |
| Grey | `#6B7280` | Secondary text, dividers |
| Soft White | `#F4F6F8` | Backgrounds |

**Typography:** DM Sans (Google Fonts)

---

## License

Proprietary — Capiro. All rights reserved.
