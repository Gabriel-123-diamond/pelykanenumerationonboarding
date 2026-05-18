# Pelykan Foods Project Instructions

This file contains foundational mandates for the Pelykan Foods project. Adhere to these standards for all development.

## 📱 Phone Number Validation
All phone number inputs (including WhatsApp) must follow these strict Nigerian formats:

1.  **Prefix `0`**: Must be exactly **11 digits**.
    *   *Example:* `09162399936`
2.  **Prefix `+234`**: Must be `+234` followed by **10 digits** (14 characters total).
    *   *Example:* `+2349162399936`

**Error Message Standard:** 
`"Use format: 091... (11 digits) or +234..."`

---

## 🔥 Firebase Local Emulator Setup

We use the Firebase Local Emulator Suite for offline development and testing.

### 1. Prerequisites
Install the Firebase CLI globally if you haven't already:
```bash
npm install -g firebase-tools
```

### 2. Switching Between Local & Online
Toggle the environment in your `.env` file:
*   **Local (Emulator):** `VITE_USE_FIREBASE_EMULATOR=true`
*   **Online (Production):** `VITE_USE_FIREBASE_EMULATOR=false`

### 3. Running with Persistence
We maintain persistent local data in the `./firebase_export` directory for project `pelykansolutions`. Use the following commands:

*   **Start Emulators:**
    ```bash
    npm run emulators:start
    ```
    *Starts Auth, Firestore, and Storage emulators for `pelykansolutions`, importing from and exporting to `./firebase_export`.*

*   **Export Data Manually:**
    ```bash
    npm run emulators:export
    ```

### 4. Emulator Dashboard
Access the local UI at:
*   **Dashboard:** [http://localhost:4000](http://localhost:4000)
*   **Firestore:** [http://localhost:4000/firestore](http://localhost:4000/firestore)
*   **Auth:** [http://localhost:4000/auth](http://localhost:4000/auth)

---

## 🛠 Tech Stack
- **Frontend:** React (TypeScript) + Vite
- **Styling:** Tailwind CSS
- **Backend/Auth:** Firebase (Firestore, Auth, Storage)
- **Icons:** Lucide React

---

## 📝 User Notes & Raw Commands
*This section contains specific logic and commands provided by the user for reference.*

### Phone Logic Reference:
"if Use 0 prefix, it'll be 11, but if Use +234, the max is +2349162399936, that's the length, please, this is also 0 prefix format 09162399936"

### Raw Emulator Command:
```bash
firebase emulators:start --project pelykansolutions --only auth,firestore,storage --import ./firebase_export --export-on-exit ./firebase_export
```