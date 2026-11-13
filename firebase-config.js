// Configuration Firebase de l'application (identifiants publics, conçus pour figurer dans le code).
// La sécurité des données repose sur les règles Firestore et sur le mot de passe de chaque compte.
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyAL_nFcetyAMAed8sR5fLlrkKB4RABFrKI",
  authDomain: "prepa-aae-2027.firebaseapp.com",
  projectId: "prepa-aae-2027",
  storageBucket: "prepa-aae-2027.firebasestorage.app",
  messagingSenderId: "1092095715188",
  appId: "1:1092095715188:web:a355dbc42a430fdcf22e21"
};

// Clé de site Fraud Defense (reCAPTCHA Enterprise) pour App Check (protège le service de correction des copies). Laisser vide tant qu'App Check n'est pas configuré.
window.APPCHECK_SITE_KEY = "6Lf0jfEtAAAAAExEpzTMuK0x-SZukK6XPoARdjBt";
