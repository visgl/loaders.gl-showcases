## Setup

### .env file

Update .env file in the project directory.
It should contain the environment variable with the Client ID obtained during the registeration process of the i3s explorer application on the ArcGIS portal.

See more information https://developers.arcgis.com/documentation/mapping-apis-and-services/security/tutorials/register-your-application/

## Available Scripts

In the project directory, you can run:

### `yarn`

Will setup application and prepare it to start.

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn start-local-deck`

Runs the app in the development mode with local deck.gl file structure.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Important: deck.gl folder should be on the same level with current project directory.

### `yarn start-local-loaders`

Runs the app in the development mode with local loaders.gl file structure.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Important: loaders.gl folder should be on the same level with current project directory.
