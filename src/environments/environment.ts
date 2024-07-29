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

  // Do we allow registration?
  REGISTRATION_ENABLED: true,

  // Default paginator options
  PAGE_SIZES: [1, 10, 15, 20, 30, 100],
  // The default quantity on the page
  DEFAULT_PAGE_SIZE: 10,
  // Saving table state, i.e. filters, sorts, etc. when closing the browser
  PERSIST_TABLE_STATE_BEFORE_UNLOAD: true,

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
};
