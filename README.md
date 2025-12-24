# 🛡️ CertView — Advanced SSL & Domain Diagnostics

**CertView** is a professional-grade web utility designed to provide human-readable security insights. Unlike standard SSL checkers, CertView performs a dual-layer analysis by inspecting both the live **TLS handshake** and the **RDAP domain registry** to provide a 360-degree view of a website's security and ownership status.

---

## 🚀 Live Demo
**[Live Link Here](https://certview.netlify.app/)**

---

## ✨ Key Features

* **Dual-Layer Diagnostics:** Simultaneously tracks **SSL Certificate Expiry** (security layer) and **Domain Registration Expiry** (ownership layer).
* **Human-Readable Insights:** Translates technical jargon and system error codes (like `ENOTFOUND`) into clear, actionable English.
* **Heuristic Tier Detection:** Automatically identifies the validation level of a certificate (**DV**, **OV**, or **EV**) by parsing subject OIDs.
* **Modern Bento UI:** A symmetrical, responsive grid layout built with Tailwind CSS, featuring a one-line tagline and advanced alignment.
* **Adaptive Dark Mode:** A fully integrated dark theme with smooth color transitions and high-contrast security indicators.

---

## 🛠️ Technical Implementation

### The "Double-Handshake" Logic
The core of CertView is its high-performance backend. When a domain is analyzed, the application uses `Promise.all` to execute two distinct protocols in parallel:

1.  **TLS Handshake (Port 443):** Uses the native Node.js `tls` module to connect to the host and retrieve the `PeerCertificate`. This provides real-time data on the encryption layer.
2.  **RDAP REST Query (HTTPS):** Consults the modern Registration Data Access Protocol (the successor to WHOIS) to fetch domain ownership data.

> **Note:** This architecture allows the app to correctly show that a domain like `google.com` is owned until **2028**, even if its current SSL certificate is rotated in **2026**.



---

### 🧠 Challenges & Solutions: TypeScript Type Safety
One of the key technical challenges was handling **Extended Validation (EV)** certificate properties like `jurisdictionC`. Since these are not part of the standard Node.js `CertificateSubject` interface, I implemented a custom interface and type-casting strategy to ensure strict type safety without losing access to high-tier security metadata.

```typescript
interface EVSubject {
  O?: string;
  jurisdictionC?: string;
  businessCategory?: string;
  serialNumber?: string;
}

// Accessing EV fields via type casting
const s = subject as EVSubject;

```

---

## 💻 Tech Stack

* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Backend:** Node.js Native `tls` Module
* **Deployment:** Netlify CI/CD

---

## ⚙️ Local Setup

1. **Clone the repository:**
```bash
git clone [https://github.com/your-username/certview-ssl-checker.git](https://github.com/NurG001/certview-ssl-checker.git)

```


2. **Install dependencies:**
```bash
npm install

```


3. **Run the development server:**
```bash
npm run dev

```



---

## 👨‍💻 Author

**Ismail Mahmud Nur** *Computer Science & Engineering Undergraduate* **East West University, Dhaka**
