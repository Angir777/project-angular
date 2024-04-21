import { env } from './env';

export const environment = {
  // App version
  APP_VERSION: env.APP_VERSION + '-loc',

  // The variable determines whether the build is production or local
  production: false,

  // API URL
  serverUrl: 'http://localhost:8000/api/',
  // API public directory
  serverPublicPath: 'http://localhost:8000/',

  // Defaut toast position
  TOAST_POSITION: 'top-right',

  // Czy pozwalamy na rejestrację?
  REGISTRATION_ENABLED: true,

  // Default paginator options
  PAGE_SIZES: [1, 10, 15, 20, 30, 100],
  // The default quantity on the page
  DEFAULT_PAGE_SIZE: 10,

  // Application languages
  enableLanguageChange: true,
  defaultLanguage: 'pl',
  LANGUAGES_AVAILABLE: [
    { title: 'Polski', data: { lang: 'pl' } },
    { title: 'English', data: { lang: 'en' } },
  ],

  // Account menu items
  ACCOUNT_MENU: [
    { title: 'pageTitle.account.changePassword', link: '/account/change-password'},
    { title: 'global.buttons.logout', data: { key: 'LOGOUT' } },
  ],

  // Checking the application version
  versionCheckEnabled: false,
  versionCheckUrl: 'version.json',

  // Saving the table state, i.e. filters, sorts, etc. when closing the browser
  persistTableStateBeforeUnload: true,
};
