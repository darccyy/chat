# React Express Template

Basic template for React in Express with Heroku support.
Works in development and production mode.
Able to use any Express methods, such as `app.get` in React using `fetch`.

# How to use

Make sure you have [NodeJS](https://nodejs.org/en/download/), and [Git](https://git-scm.com/downloads) installed.

This has been tested in Windows with PowerShell, but it should work for other systems and command interfaces.

If you run into any problems, create a new issue for this repo and I will try to help.

## Installation

```powershell
# Clone repository into ./react-express-template folder
git clone https://github.com/darccyy/react-express-template.git

# Install dependencies
npm run install-all
```

## Development

Runs 2 server programs (Using `concurrently`):

- Client with React
- Server with Express & Nodemon

Corresponding server soft restarts when file is saved.

```powershell
# Start development server
npm run start:dev
```

## Production

```powershell
# Build production (Also reinstalls modules)
npm run build

# Start production server
npm run start
```

## Production Setup

### GitHub

Skip to [Heroku](#heroku) Setup if you already know how to link GitHub repository

1. Go to https://github.com and create an account if needed
2. Press the plus button (Top right) > `New repository`
3. Choose a name and description, then click `Create repository`
4. Go back to your project folder (On your computer)
5. Delete the `.git` folder. It should be hidden, so make sure hidden folders are visible
6. Open a terminal in your folder, paste the below code in (Replace `{username}` and `{repo}` with your GitHub username and repository name):

```powershell
# Remove connection to template repo
git remote remove origin

# Add connection to your own repo
git remote add origin https://github.com/{username}/{repo}

# 'Stage' all files (Get them ready to commit)
git stage .

# Create a commit with a message
git commit -m "Created project"

# Push (send) all files in the commit to the online repo
git push -u origin main
```

### Heroku

1. Go to `https://dashboard.heroku.com` and create an account if needed
2. Press `New` > `Create new app`
3. Choose a unique name, then click `Create app`
4. In the navigation bar, click `Deploy`
5. Select `GitHub` under `Deployment Method`
6. Connect your GitHub account if needed
7. Connect your repository by searching it
8. Click `Enable Automatic Deploys` if you want it to restart everytime you push to the repo
9. Deploy the app by by clicking `Deploy Branch` (Make sure `main` is selected in the dropdown)
10. When the build finishes, you should be able to view your app under `http://{app}.herokuapp.com` (Replace `{app}` with the name of your app)
11. To view the logs, go to the Heroku app page and click `More` (Top right) > `View logs`
12. If the app is successful, you should see `State changed from starting to up` with no errors after

## Modules & Frameworks

By default, this package uses these frameworks, languages, and modules

### Client

- NodeJS (JavaScript)
- React
- Html
- Scss

### Server

- NodeJS (JavaScript)
- Express

### Optional Hosting

- Git
- GitHub
- Heroku

### Recommended

- VSCode
- - Code Runner extension
- - Compile Hero (For Scss)
- - Source control (For GitHub)

## File Structure

Simplified file tree

```powershell
./ # Root folder (react-express-template)
│
├── server/ # All server files
│   └── server.js # Main server file
│
└── client/ # All client files
    ├── public/ # Static files (Not including font)
    │   ├── index.html # Main html, Nothing in here
    │   └── image/... # Images, obviously
    │
    └── src/ # Dynamic React files
        ├── index.js # Main React file
        │
        ├── pages/ # Basically the urls
        │   ├── ... # Home, Contact, Error404
        │   └── Layout.js # Main file for layout: Header, Contact link, ect.
        │
        ├── js/ # React js files for components
        │   └── ... # Components that would get reused
        │
        ├── scss/ # Styles in scss
        │   └── ... # Corresponding to js folder
        │
        └── font/... # Any fonts (Empty by default)
```
