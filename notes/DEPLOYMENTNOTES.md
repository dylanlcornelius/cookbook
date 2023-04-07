# Deployement Notes
## For Firebase Hosting
---

#### CLI (admin command prompt)
npm i -g --production windows-build-tools --vs2015
npm i -g firebase-tools
npm i -g @angular/cli

#### Initialize Firebase
```
firebase login
firebase init
```

#### Choose options:
```
Hosting: Configure and deploy Firebase Hosting Sites
Set public directory: dist/cookbook
SPA: Yes
```

#### Build application

##### PRODUCTION: 
```
ng build -c product
```

#### Deploy build
```
firebase deploy
```

#### Change current Firebase project
```
firebase projects:list
firebase use <project_id>
```
