# Warhammer Utilities

This project exists to provide the Warhammer community an easy to filter list of missions for games of Kill Team. Other utilities will be added over time.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.1.2.

## Bugs

If you'd like to report a bug, please add it to our [Issues Log](https://github.com/cazantyl/wh40kkt/issues)

## Setup

You will need to add your whitelist, firebase database, and Google Analytics tag to `src\environments\environment.ts`
```
export const environment = {
  production: false,
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_AUTH_DOMAIN',
    databaseURL: 'YOUR_DATABASE_URL',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_STORAGE_BUCKET',
    messagingSenderId: 'YOUR_MESSAGING_ID',
    appId: 'YOUR_APP_ID'
  },
  whitelist: ['your@email.com'],
  uatag: 'Your google analytics tag',
};
```
**!!IMPORTANT!!** After you have created the above environment.ts, run the following command from within the project:

`git update-index --skip-worktree src/environments/environment.ts`

Pull requests that include this file will rejected.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## License
This software is licensed under [GNU AGPLv3](https://www.gnu.org/licenses/agpl-3.0.en.html).
