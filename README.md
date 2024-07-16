# ProjectAngular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.2.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Create new project

1. Instalacja czystego projektu: npm init @angular project-angular

2. Edycja pliku package.json

Dodaj do "scripts": "build-dev": "ng build --configuration dev && npm run post-build",

3. Instalacja podstawowych pakietów.

4. Edycja pliku angular.json

Dodaj do "configurations" budowanie wersji "dev" oraz "fileReplacements".

## Configure Prettier and ESLint
(https://dev.to/this-is-angular/configure-prettier-and-eslint-with-angular-526c)

0. settings.json dla VC

1. ng add @angular-eslint/schematics

2. npm install prettier --save-dev

3. 

Then we need to add .prettierrc.json and .prettierignore files in our root project directory.
Inside .prettierignore it’s better to add whatever we have inside .gitignore file.

4. install prettier-eslint eslint-config-prettier eslint-plugin-prettier --save-dev

5. Sformatowanie całego projektu: npx prettier --write .

6. Formatowanie ręczne: 'Shift+Alt+F'
Kliknij na ikonę koła zębatego w lewym dolnym rogu i wybierz Settings.
W pasku wyszukiwania wpisz „default formatter” i wybierz opcję Editor: Default Formatter.
Wybierz Prettier - Code formatter z rozwijanej listy.

7. Sprawdzenie błędów i poprawa możliwych: ng lint --fix