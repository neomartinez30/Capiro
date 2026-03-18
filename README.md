# Capiro Landing Page

A modern, brand-aligned landing page for **Capiro** — an agentic AI platform that standardizes and automates legislative submission workflows for congressional offices and stakeholders.

Built with **React 18** + **Vite**. Designed to be deployed on **AWS EC2** with **Amazon Cognito** authentication.

---

## Preview

The landing page includes:

- **Navbar** — Fixed top bar with the Capiro logo; gains a frosted-glass effect on scroll. Contains Sign In and Get Started buttons.
- **Hero Section** — Full-viewport welcome with the tagline *"Structure. Clarity. Intelligence."* and the brand statement from the Capiro Brand Book.
- **Features Grid** — Three cards covering Structured Submissions, Automated Processing, and Policy Intelligence.
- **Login / Signup Modal** — Email + password form, SSO button, forgot-password link, and sign-up toggle. All auth actions are placeholders wired for Cognito.
- **Footer** — Minimal brand bar with logo and copyright.
- **Background** — Ambient deep-blue gradient, subtle grid overlay, glow orbs, and floating particles.

---

## Project Structure

```
capiro-landing/
├── public/
│   ├── logo-white.png          # Capiro logo (white — for dark backgrounds)
│   └── logo-black.png          # Capiro logo (black — for light backgrounds)
├── src/
│   ├── components/
│   │   ├── GridBackground.jsx  # Deep-blue gradient + grid + glow orbs
│   │   ├── Particles.jsx       # Ambient floating particles
│   │   ├── Navbar.jsx          # Fixed top navigation
│   │   ├── Hero.jsx            # Full-viewport hero section
│   │   ├── Features.jsx        # Three-card features grid
│   │   ├── FeatureCard.jsx     # Individual feature card
│   │   ├── LoginModal.jsx      # Login / signup modal with Cognito placeholders
│   │   └── Footer.jsx          # Minimal footer
│   ├── config/
│   │   ├── brand.js            # Capiro brand color tokens
│   │   └── cognito.js          # AWS Cognito configuration (placeholders)
│   ├── styles/
│   │   ├── global.css          # Reset, CSS variables, keyframes, font import
│   │   ├── Background.css      # Grid, gradient, orbs, particles
│   │   ├── Navbar.css          # Top bar + button styles
│   │   ├── Hero.css            # Hero section, pill badge, CTAs
│   │   ├── Features.css        # Features grid + card styles
│   │   ├── LoginModal.css      # Modal backdrop, card, form, buttons
│   │   └── Footer.css          # Footer layout
│   ├── App.jsx                 # Root component — composes all sections
│   └── main.jsx                # React entry point
├── index.html                  # Vite HTML shell
├── package.json
├── vite.config.js
└── README.md
```

---

## Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Install & Run

```bash
# Clone or copy the project
cd capiro-landing

# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev
```

### Production Build

```bash
npm run build        # outputs to dist/
npm run preview      # preview the production build locally
```

---

## AWS Cognito Integration

Authentication is stubbed with placeholder alerts. To connect real Cognito auth:

### 1. Install AWS Amplify

```bash
npm install aws-amplify
```

### 2. Update Configuration

Edit `src/config/cognito.js` and replace the placeholder values:

```js
const COGNITO_CONFIG = {
  region: "us-east-1",                          // Your AWS region
  userPoolId: "us-east-1_XXXXXXXXX",            // Your Cognito User Pool ID
  userPoolWebClientId: "XXXXXXXXXXXXXXXXXX",     // Your App Client ID
  domain: "your-domain.auth.us-east-1.amazoncognito.com",
  redirectUri: "https://your-ec2-domain.com/callback",
};
```

### 3. Initialize Amplify

In `src/main.jsx`, add before the `ReactDOM.createRoot` call:

```js
import { Amplify } from "aws-amplify";
import COGNITO_CONFIG from "./config/cognito";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: COGNITO_CONFIG.userPoolId,
      userPoolClientId: COGNITO_CONFIG.userPoolWebClientId,
      loginWith: {
        oauth: {
          domain: COGNITO_CONFIG.domain,
          scopes: ["openid", "email", "profile"],
          redirectSignIn: [COGNITO_CONFIG.redirectUri],
          redirectSignOut: [COGNITO_CONFIG.redirectUri],
          responseType: "code",
        },
      },
    },
  },
});
```

### 4. Replace Placeholders in LoginModal

In `src/components/LoginModal.jsx`, swap the `setTimeout` blocks with real Amplify calls:

```js
import { signIn, signUp, resetPassword } from "aws-amplify/auth";

// Sign in
const { isSignedIn } = await signIn({ username: email, password });

// Sign up
const { isSignUpComplete } = await signUp({
  username: email,
  password,
  options: { userAttributes: { name } },
});

// Forgot password
await resetPassword({ username: email });
```

### 5. SSO / Hosted UI

The SSO button redirects to the Cognito Hosted UI. Update the `handleSSO` function:

```js
const handleSSO = () => {
  window.location.href =
    `https://${COGNITO_CONFIG.domain}/oauth2/authorize` +
    `?client_id=${COGNITO_CONFIG.userPoolWebClientId}` +
    `&response_type=code` +
    `&scope=openid+email+profile` +
    `&redirect_uri=${encodeURIComponent(COGNITO_CONFIG.redirectUri)}`;
};
```

---

## EC2 Deployment

### Option A: Serve the Static Build with Nginx

```bash
# On your EC2 instance
npm run build

# Copy dist/ to nginx
sudo cp -r dist/* /var/www/html/

# Nginx config (minimal)
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Option B: Run with Node (Preview Server)

```bash
npm run build
npm run preview   # serves on port 3000
```

Use a reverse proxy (Nginx, ALB) to terminate SSL and forward to port 3000.

### Security Group

Ensure your EC2 security group allows inbound traffic on ports **80** (HTTP) and **443** (HTTPS).

---

## Brand Reference

All design decisions follow the **Capiro Brand Book**:

| Token       | Hex       | Usage                                    |
|-------------|-----------|------------------------------------------|
| Primary     | `#01226A` | Capiro Blue — anchor across major surfaces |
| Accent      | `#3A6FF7` | Signal Blue — actions, links, highlights  |
| Grey        | `#6B7280` | Cool Grey — secondary text, dividers      |
| Soft White  | `#F4F6F8` | Breathing room, form backgrounds          |

**Typography:** DM Sans (Google Fonts) — clean, modern, institutional.

**Brand Personality:** Clear, trusted, automatic, intuitive, precise, institutional.

**Tone:** Direct, professional, structured, measured, confident. No buzzwords, no startup clichés, no flashy consumer-tech language.

---

## License

Proprietary — Capiro. All rights reserved.
