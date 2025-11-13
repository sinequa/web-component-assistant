import { provideHttpClient } from '@angular/common/http';
import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';
import { APP_INITIALIZER } from '@angular/core';
import Flow from '@flowjs/flow.js';
import { FlowInjectionToken } from '@flowjs/ngx-flow';
import { provideTransloco } from '@jsverse/transloco';
import { provideTranslocoMessageformat } from '@jsverse/transloco-messageformat';
import { TranslocoHttpLoader } from './transloco-loader';

// @sinequa/assistant library
import {
  CustomElementsService,
  initializeCustomElements,
  ASSISTANT_MARKDOWN_IT_PLUGINS,
  markdownItCodeBlockPlugin,
  markdownItImageReferencePlugin,
  markdownItLinkPlugin,
  markdownItPageReferencePlugin,
  markdownItDocumentReferencePlugin,
  ASSISTANT_CUSTOM_ELEMENTS,
  DocumentReferenceComponent,
  PageReferenceComponent,
  ImageReferenceComponent,
  CodeBlockComponent,
  TableToolsComponent,
  markdownItTableToolsPlugin
} from '@sinequa/assistant/chat';

import { ChatWrapperComponent } from './wrapper/chat-wrapper';
import { SavedChatsWrapperComponent } from './wrapper/saved-chats-wrapper';
import { ChatSettingsWrapperComponent } from './wrapper/chat-settings-wrapper';
import { DocumentOverviewWrapperComponent } from './wrapper/document-overview-wrapper';
import { DocumentUploadWrapperComponent } from './wrapper/document-upload-wrapper';


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
    // Provides the custom elements to be registered for the assistant
    {
      provide: ASSISTANT_CUSTOM_ELEMENTS,
      useValue: {
        'document-reference': DocumentReferenceComponent, // Defines the template to be used by the associated plugin markdownItDocumentReferencePlugin
        'page-reference': PageReferenceComponent, // Defines the template to be used by the associated plugin markdownItPageReferencePlugin
        'image-reference': ImageReferenceComponent, // Defines the template to be used by the associated plugin markdownItImageReferencePlugin
        'code-block': CodeBlockComponent, // Defines the template to be used by the associated plugin markdownItCodeBlockPlugin
        'table-tools': TableToolsComponent, // Defines the template to be used by the associated plugin markdownItTableToolsPlugin
      },
    },
    // Provides an APP_INITIALIZER which will initialize the custom elements defined using ASSISTANT_CUSTOM_ELEMENTS
    // This is required to be able to use the custom elements in Angular components templates.
    {
        provide: APP_INITIALIZER,
        useFactory: initializeCustomElements,
        multi: true,
        deps: [CustomElementsService],
    },
    // Provides the markdown-it plugins to be used by the assistant
    {
      provide: ASSISTANT_MARKDOWN_IT_PLUGINS,
      useValue: [
        markdownItDocumentReferencePlugin, // Uses the template defined by the key 'document-reference' in ASSISTANT_CUSTOM_ELEMENTS
        markdownItPageReferencePlugin, // Uses the template defined by the key 'page-reference' in ASSISTANT_CUSTOM_ELEMENTS
        markdownItImageReferencePlugin, // Uses the template defined by the key 'image-reference' in ASSISTANT_CUSTOM_ELEMENTS
        markdownItLinkPlugin, // Standard link plugin (no custom element associated)
        markdownItCodeBlockPlugin, // Uses the template defined by the key 'code-block' in ASSISTANT_CUSTOM_ELEMENTS
        markdownItTableToolsPlugin, // Uses the template defined by the key 'table-tools' in ASSISTANT_CUSTOM_ELEMENTS
      ],
    },
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

    const ChatSettingsWrapper = createCustomElement(ChatSettingsWrapperComponent, {
      injector: app.injector,
    });
    customElements.define('sq-chat-settings-wrapper', ChatSettingsWrapper);

    const DocumentOverviewWrapper = createCustomElement(DocumentOverviewWrapperComponent, {
      injector: app.injector,
    });
    customElements.define('sq-document-overview-wrapper', DocumentOverviewWrapper);

    const documentUploadWrapper = createCustomElement(DocumentUploadWrapperComponent, {
      injector: app.injector,
    });
    customElements.define('sq-document-upload-wrapper', documentUploadWrapper);

  })
  .catch((err) => console.error(err));
