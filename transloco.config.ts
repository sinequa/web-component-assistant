import { TranslocoGlobalConfig } from '@jsverse/transloco-utils';

const config: TranslocoGlobalConfig = {
  rootTranslationsPath: 'src/assets/i18n/',
  langs: ['en', 'fr', 'de', 'pl'],
  keysManager: {},
  scopedLibs: [
    {
      src: '@sinequa/assistant',
      dist: ['src/assets/i18n'],
    },
  ],
  defaultLang: 'en',
};

export default config;
