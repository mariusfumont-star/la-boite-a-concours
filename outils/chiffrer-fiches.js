// Chiffre les fiches détaillées d'un ou plusieurs fichiers de veille (AES-256-GCM).
// Usage : node outils/chiffrer-fiches.js <clé base64> <dossier>/veille/AAAA-MM-JJ.json [...]
// Chaque champ "fiche" est remplacé par "fiche_enc" ; le script est sans effet sur un fichier déjà chiffré.
// Exception volontaire : le LUNDI, la fiche du premier sujet est laissée en accès libre sous le nom
// "fiche_libre" (« fiche offerte de la semaine », vitrine de la version gratuite). C'est normal :
// ce champ n'est pas une fiche oubliée en clair, il ne faut pas le chiffrer ni le supprimer.
const fs = require("fs"), crypto = require("crypto");
const [,, keyB64, ...files] = process.argv;
if (!keyB64 || !files.length) { console.error("Usage : node outils/chiffrer-fiches.js <clé> <fichiers…>"); process.exit(1); }
const key = Buffer.from(keyB64, "base64");
if (key.length !== 32) { console.error("Clé invalide"); process.exit(1); }
const estLundi = (d) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(d || "")); return !!m && new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])).getUTCDay() === 1; };
let n = 0, libre = 0;
for (const f of files) {
  const doc = JSON.parse(fs.readFileSync(f, "utf8"));
  const items = doc.items || [];
  const dejaLibre = items.some((it) => it && it.fiche_libre);
  if (estLundi(doc.date) && !dejaLibre) {
    const it = items.find((x) => x && x.fiche && typeof x.fiche === "object" && x.theme !== "Géopolitique");
    if (it) { it.fiche_libre = it.fiche; delete it.fiche; libre++; }
  }
  for (const it of items) {
    if (it.fiche && typeof it.fiche === "object") {
      const iv = crypto.randomBytes(12), c = crypto.createCipheriv("aes-256-gcm", key, iv);
      it.fiche_enc = Buffer.concat([iv, c.update(JSON.stringify(it.fiche), "utf8"), c.final(), c.getAuthTag()]).toString("base64");
      delete it.fiche; n++;
    }
  }
  fs.writeFileSync(f, JSON.stringify(doc, null, 1) + "\n");
}
console.log("Fiches chiffrées : " + n + (libre ? " · fiche offerte de la semaine laissée volontairement en accès libre (champ fiche_libre, lundi) : " + libre : ""));
