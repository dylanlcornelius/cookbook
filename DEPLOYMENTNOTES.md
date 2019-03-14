# Deployement Notes
#### For Firebase Hosting
---

##### Initialize Firebase
```
firebase login
firebase init
```

##### Choose options:
```
Hosting: Configure and deploy Firebase Hosting Sites
Set public directory: dist/Cookbook
SPA: Yes
```

##### Build application
```
ng build --prod
```

##### Deploy build
```
firebase deploy
```
