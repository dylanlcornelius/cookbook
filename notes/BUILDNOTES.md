# Build Notes

---

#### Installs:

1. Visual Studio Code
   - personal access token from github
2. Node.js
3. Git

#### Project:

- Update `src/environments/environment.ts` file:
  - title string
  - production flag
  - firebase web configuration settings
    > The `production` flag builds angular in production mode and enables the service worker

#### Modules:

```
npm i
npm i firebase
npm i -g @angular/cli@<package version number>
```

firewall issues

```
npm set strict-ssl false
```

#### Extensions (Optionals for VSCode):

1. GitHub (only for personal access token)
2. Git Graph
3. Markdown Preview Enhanced
4. TSLint
5. TODO Highlight
