import { provideHttpClient } from '@angular/common/http';
import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';
import Flow from '@flowjs/flow.js';
import { FlowInjectionToken } from '@flowjs/ngx-flow';
import { provideTransloco } from '@jsverse/transloco';
import { provideTranslocoMessageformat } from '@jsverse/transloco-messageformat';


import { TranslocoHttpLoader } from './transloco-loader';
import { ChatWrapperComponent } from './wrapper/chat-wrapper';
import { SavedChatsWrapperComponent } from './wrapper/saved-chats-wrapper';

createApplication({
  providers: [
    // Add any necessary providers here
    provideHttpClient(),
    { provide: FlowInjectionToken, useValue: Flow },

    provideTransloco({
      config: {
        availableLangs: ['en', 'fr', 'de'],
        defaultLang: 'en',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: false,
        prodMode: true,
        fallbackLang: 'en',
        // missingHandler: {
        //   logMissingKey: false,
        //   useFallbackTranslation: false,
        // },
      },
      loader: TranslocoHttpLoader,
    }),
    provideTranslocoMessageformat(),
  ],
})
  .then((app) => {
    const ChatWrapper = createCustomElement(ChatWrapperComponent, {
      injector: app.injector,
    });
    customElements.define('sq-chat-wrapper', ChatWrapper);

    const SavedChatsWrapper = createCustomElement(SavedChatsWrapperComponent, {
      injector: app.injector,
    });
    customElements.define('sq-saved-chats-wrapper', SavedChatsWrapper);

  })
  .catch((err) => console.error(err));
