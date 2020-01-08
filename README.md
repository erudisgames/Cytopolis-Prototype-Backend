# Cytopolis Prototype Backend

Includes some base code that implements the following features for cloud scripts:

 - Typescript ready to use after node install.
 - Separation of concerns pattern implementation through javascript modules.
 - Unit tests available using Jest.
 - Dependency injection through /src/utils/service-locator.ts script
 - Building script where modules are removed (not supported by PlayFab) and bundled in main.js
 
 ## Install
 
 ```shell script
npm i
```

 ## Build main script
 
 ```shell script
npm run build-main
```
 
 ## Tests
 To run one time
 ```shell script
npm t
```

To watch the unit tests
 ```shell script
npm t -- --watch
```

## Structure

 - `typings/PlayFab` contains files copied from [SdkTestingCloudScript](https://github.com/PlayFab/SdkTestingCloudScript)
 - `typings/Biology.d.ts` contains some custom typings from a sample Biology game
 - `src/utils` contains helper classes and constants
 - `src/services` contains some services useful for any games
 - `src/biology` contains services used only in the biology game sample
 - `main.js` defines a controller and expose the methods to PlayFab
 
## Misc

- [Configure Jest Article](https://basarat.gitbooks.io/typescript/docs/testing/jest.html)