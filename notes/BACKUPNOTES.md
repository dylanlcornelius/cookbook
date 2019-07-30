# Backup Notes
---

#### Setup:
Must be installed globally
```
npm i -g node-firestore-import-export
```

#### Export:
```
firestore-export -a backups/firebase-auth.json -b backups/<name>.json
```

#### Import:
```
firestore-import -a backups/firebase-auth.json -b backups/<name>.json
```
