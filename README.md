# Family Tree User Experience Repository
This is UX component for Rajput Chhipa Samaj build using ReactJS

## UX Application setup and commands
Note: Make sure you have `npm` installed on your development machine.

### NPM Dependencies 
```
cd family-tree-ux
npm install axios
npm install react-organizational-chart
npm install bootstrap
npm install react-bootstrap
npm install react-router-dom
npm install react-icons
npm install --save-dev prettier
npm install date-fns
# npm install dayjs
npm install react-dropzone react-easy-crop
```

### Important commands:
```
# Build UX
npm run clean && npm run build

# start local server on port 3000
npm start
```

### Code formatting:
```
npx prettier --write src/pages/SignUp.jsx
npx prettier --write src/pages/*
```

## Project Structure:
```
family-tree-ux/
├── README.md
├── package.json
├── package-lock.json
├── public - common images and index.html
│   ├── favicon.ico
│   ├── index.html
│   ├── ...
│   └── logo.png
├── src 
│   ├── App.js
│   ├── App.css
│   ├── App.test.js
│   ├── index.js
│   ├── index.css
│   ├── reportWebVitals.js
│   ├── setupTests.js
│   ├── api - Interceptor for authorization
│   │   └── axiosInstance.js
│   ├── components - common components
│   │   ├── AnimatedCounter.jsx
│   │   ├── EventCard.js
│   │   ├── FamilyTree.jsx
│   │   ├── ImageModal.js
│   │   ├── ...
│   │   └── StatsCounterSection.jsx
│   ├── constants - common constants
│   │   ├── DropdownConstants.js
│   │   └── messages.js
│   ├── context - login/logout and session info
│   │   └── AuthContext.jsx
│   ├── layout - Different page layouts
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── HeaderWithoutMenu.jsx
│   │   ├── LoginLayout.jsx
│   │   └── MainLayout.jsx
│   ├── pages - Application Pages
│   │   ├── AccountsPage.jsx
│   │   ├── ChangePassword.jsx
│   │   ├── EventDetailPage.jsx
│   │   ├── FamilyDetails.jsx
│   │   ├── FamilySearch.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── HomePage.jsx
│   │   ├── Login.jsx
│   │   ├── MemberProfile.jsx
│   │   ├── ...
│   │   └── SignUp.jsx
│   └── utils 
│       └── phoneUtils.js
```





## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


Create new ReactJS Application:
```
# Note: Use this command only when creating new application. If you cloning the existing app, skip this step.
npx create-react-app family-tree-ux
```

