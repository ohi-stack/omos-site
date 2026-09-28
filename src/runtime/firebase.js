const { initializeApp, getApps } = require('firebase/app');
const { getFirestore, doc, getDocFromServer, setDoc, getDoc } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

let db = null;
let app = null;
let firestoreConnected = false;
let firestoreError = null;

function loadFirebaseConfig() {
  const configPath = path.join(__dirname, '..', '..', 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    try {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (e) {
      console.error('Failed to parse firebase-applet-config.json:', e.message);
    }
  }
  return null;
}

function getFirebaseApp() {
  if (app) return app;
  const config = loadFirebaseConfig();
  if (!config) return null;
  const existingApps = getApps();
  if (existingApps.length > 0) {
    app = existingApps[0];
  } else {
    app = initializeApp(config);
  }
  return app;
}

function getFirestoreDb() {
  if (db) return db;
  const fbApp = getFirebaseApp();
  if (!fbApp) return null;
  const config = loadFirebaseConfig();
  if (config?.firestoreDatabaseId) {
    db = getFirestore(fbApp, config.firestoreDatabaseId);
  } else {
    db = getFirestore(fbApp);
  }
  return db;
}

async function testConnection() {
  const database = getFirestoreDb();
  if (!database) {
    firestoreConnected = false;
    firestoreError = 'Firebase config not found';
    return false;
  }
  try {
    await getDocFromServer(doc(database, 'test', 'connection'));
    firestoreConnected = true;
    firestoreError = null;
    return true;
  } catch (error) {
    if (error && error.message && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
    firestoreConnected = false;
    firestoreError = error ? (error.code || error.message) : 'Unknown connection error';
    return false;
  }
}

function getFirestoreStatus() {
  const config = loadFirebaseConfig();
  return {
    configured: Boolean(config),
    projectId: config?.projectId || null,
    firestoreDatabaseId: config?.firestoreDatabaseId || '(default)',
    connected: firestoreConnected,
    error: firestoreError
  };
}

// Initial boot check as required by Firebase skill
testConnection().catch((err) => {
  console.warn('Initial Firestore connection check failed:', err.message);
});

module.exports = {
  getFirebaseApp,
  getFirestoreDb,
  testConnection,
  getFirestoreStatus
};
