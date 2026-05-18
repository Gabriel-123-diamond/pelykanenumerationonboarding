# Firebase Local Emulator Setup & Persistence

This project is configured to use the Firebase Local Emulator Suite for development. This allows you to work offline and test changes without affecting production data.

## 1. Prerequisites
Ensure you have the Firebase CLI installed:
```bash
npm install -g firebase-tools
```

## 2. Configuration (The Switch)
You can switch between the **Local Emulator** and **Online (Production)** Firebase by modifying your `.env` file:

- **Local:** `VITE_USE_FIREBASE_EMULATOR=true`
- **Online:** `VITE_USE_FIREBASE_EMULATOR=false`

## 3. Persistent Storage
The project is configured to save emulator data (Firestore, Auth, and Storage) to a local folder named `./firebase_export` for the Firebase project `pelykansolutions`. This data is automatically reloaded every time you start the emulators.

### Commands:
- **Start Emulators (with persistence):**
  ```bash
  npm run emulators:start
  ```
  *This will run `firebase emulators:start --project pelykansolutions --only auth,firestore,storage --import ./firebase_export --export-on-exit ./firebase_export`.*

- **Manual Export:**
  ```bash
  npm run emulators:export
  ```

## 4. Emulator UI
Once running, you can access the Emulator UI to manage your local data:
- **Dashboard:** http://localhost:4000
- **Auth:** http://localhost:4000/auth
- **Firestore:** http://localhost:4000/firestore
- **Storage:** http://localhost:4000/storage

## 5. Implementation Details
The switching logic is located in `src/lib/firebase.ts`. It detects the environment variable and connects to the appropriate ports (9099 for Auth, 8080 for Firestore, 9199 for Storage).
