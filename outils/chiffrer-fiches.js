// Chiffre les « fiches pour l'attaché » d'un ou plusieurs fichiers de veille (AES-256-GCM).
// Usage : node outils/chiffrer-fiches.js <clé base64> veille/AAAA-MM-JJ.json [...]
// Chaque champ "fiche" est remplacé par "fiche_enc" ; le script est sans effet sur un fichier déjà chiffré.
const fs = require("fs"), crypto = require("crypto");
const [,, keyB64, ...files] = process.argv;
if (!keyB64 || !files.length) { console.error("Usage : node outils/chiffrer-fiches.js <clé> <fichiers…>"); process.exit(1); }
const key = Buffer.from(keyB64, "base64");
if (key.length !== 32) { console.error("Clé invalide"); process.exit(1); }
let n = 0;
for (const f of files) {
  const doc = JSON.parse(fs.readFileSync(f, "utf8"));
  for (const it of doc.items || []) {
    if (it.fiche && typeof it.fiche === "object") {
      const iv = crypto.randomBytes(12), c = crypto.createCipheriv("aes-256-gcm", key, iv);
      it.fiche_enc = Buffer.concat([iv, c.update(JSON.stringify(it.fiche), "utf8"), c.final(), c.getAuthTag()]).toString("base64");
      delete it.fiche; n++;
    }
  }
  fs.writeFileSync(f, JSON.stringify(doc, null, 1) + "\n");
}
console.log("Fiches chiffrées : " + n);
