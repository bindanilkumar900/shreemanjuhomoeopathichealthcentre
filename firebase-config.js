// Firebase configuration for Shree Manju Homoeopathic Clinic
// This connects the clinic app to a cloud database so data syncs across all devices

const firebaseConfig = {
  apiKey: "AIzaSyCvwrg4jIEjlsPyr12R2r7dZYfN9RHKQNc",
  authDomain: "shreemanjuhomoeopathic.firebaseapp.com",
  projectId: "shreemanjuhomoeopathic",
  storageBucket: "shreemanjuhomoeopathic.firebasestorage.app",
  messagingSenderId: "595084649056",
  appId: "1:595084649056:web:774dead3049fcf47e89905",
  measurementId: "G-VNZKY1Y3K8"
};

// Initialize Firebase
let db = null;
let firebaseReady = false;

try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
  
  // Enable offline persistence so it works even without internet
  db.enablePersistence()
    .then(() => {
      console.log("Firebase ready with offline support");
      firebaseReady = true;
      // Dispatch event so app knows Firebase is ready
      window.dispatchEvent(new Event('firebaseReady'));
    })
    .catch((err) => {
      console.warn("Offline persistence error, using online mode:", err.code);
      firebaseReady = true;
      window.dispatchEvent(new Event('firebaseReady'));
    });
} catch(e) {
  console.error("Firebase init error:", e);
}

// Cloud Database Helper Functions
const CloudDB = {
  // Save data to collection
  async save(collection, data) {
    if (!db) return false;
    try {
      await db.collection(collection).add({
        ...data,
        _timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      return true;
    } catch(e) {
      console.error("Save error:", e);
      return false;
    }
  },

  // Save with specific document ID (for updates)
  async saveWithId(collection, docId, data) {
    if (!db) return false;
    try {
      await db.collection(collection).doc(docId).set({
        ...data,
        _timestamp: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      return true;
    } catch(e) {
      console.error("Save error:", e);
      return false;
    }
  },

  // Get all documents from collection
  async getAll(collection) {
    if (!db) return [];
    try {
      const snapshot = await db.collection(collection)
        .orderBy('_timestamp', 'desc')
        .get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch(e) {
      console.error("Read error:", e);
      return [];
    }
  },

  // Get filtered documents
  async getFiltered(collection, field, value) {
    if (!db) return [];
    try {
      const snapshot = await db.collection(collection)
        .where(field, '==', value)
        .orderBy('_timestamp', 'desc')
        .get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch(e) {
      console.error("Read error:", e);
      return [];
    }
  },

  // Delete document
  async remove(collection, docId) {
    if (!db) return false;
    try {
      await db.collection(collection).doc(docId).delete();
      return true;
    } catch(e) {
      console.error("Delete error:", e);
      return false;
    }
  },

  // Update document
  async update(collection, docId, data) {
    if (!db) return false;
    try {
      await db.collection(collection).doc(docId).update(data);
      return true;
    } catch(e) {
      console.error("Update error:", e);
      return false;
    }
  }
};

// Collections used in the app:
// - clinic_patients    (patient registrations)
// - clinic_opd         (OPD records)
// - clinic_ipd         (IPD admissions)
// - clinic_medicines   (medicine inventory)
// - clinic_bills       (billing records)

console.log("Firebase backend config loaded. Replace YOUR_API_KEY with real Firebase credentials.");
