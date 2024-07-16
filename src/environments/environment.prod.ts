import { env } from './env';

export const environment = {
  // App version
  APP_VERSION: env.APP_VERSION,

  // The variable determines whether the build is production or local
  production: true,

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
  ENABLE_LANGUAGE_CHANGE: true,
  DEFAULT_LANGUAGE: 'pl',
  LANGUAGES_AVAILABLE: [
    { title: 'Polski', data: { lang: 'pl' } },
    { title: 'English', data: { lang: 'en' } },
  ],

  // Checking the application version
  versionCheckEnabled: false,
  versionCheckUrl: 'version.json',

  // Saving the table state, i.e. filters, sorts, etc. when closing the browser
  persistTableStateBeforeUnload: true,
};
