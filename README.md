# Assistant Web Components

## Anatomy

- `dist/assistant-element/` contains the built web components files. 
Files to be used for web components are: 

- `browser/main.js`.
- `browser/polyfills.js`.
- `browser/atomic.js`.
- `browser/styles.css`.
- `browser/assets` folder (if you need to customize translations, you can find them in `assets/i18n` folder).
copy and paste them in your project static folder.

- `src/` contains the source code to build the web component and all the components wrapper.
- `vite/` contains a simple Vite configuration file to test the web component. Vite server will serve files from the `dist/assistant-element/browser` folder.

## Build the Assistant as a web component

Install the dependencies:

```bash
npm ci --legacy-peer-deps
```

Build the project:

```bash
npm run build
```

## Configuration

### Configure the back-end URL

Use the `API_URL` constant from `vite.config.ts` as your proxy URL:

```typescript
const API_URL = "https://my-backend-url.com";
```

Then, go to `src/index.html` and set your global configuration:

```typescript
import { setGlobalConfig } from "./atomic.js";

setGlobalConfig({
  app: "your-app-name",
});
```

You can see more details about the global configuration in the [Atomic documentation](https://sinequa.github.io/sba-mint/mint/how-to/configuration#global-configuration).

### Configure the assistant instance
The `assistantConfig` constant specifies the configuration used by the Assistant instance.
You should replace the placeholder values with your own:

```typescript
const assistantConfig = {
  instanceId: "<your-instance-name>",          // Replace with the name of your Assistant instance
  additionalWorkflowProperties: {},            // Optional workflow-specific properties
  query: { 
    name: "<your-query-web-service-name>"      // Replace with the name of your Query web service
  },
};

```

### Authentication

Authentication is handled through the `SessionStorage` browser API, with the key `assistant-web-component-token`.
The web component will automatically check for this token when it is initialized.

#### Static token

You can specify a Sinequa Access Token using:

```typescript
sessionStorage.setItem("assistant-web-component-token", "your-token");
```

Then call the `initSinequaAssistant()` function to initialize the component with the token.

Access token must have the following `Allowed JSON methods`: `security.webtoken,/endpoints/v1/assistant,audit.notify,dev.plugin`

#### Dynamic authentication

You need to call the `login()` function to prompt the authentication process configured in the backend.

You can override the default authentication by passing a username and a password to the `login()`, see more details in the [Atomic documentation](https://sinequa.github.io/sba-mint/atomic/authentication/login).

The `initSinequaAssistant()` function calls a set of functions to initialize components, including fetching of the _csrf token_.
Once the challenge is completed and the token is stored, the `initSinequaAssistant()` function sets up the DOM elements for all components.

## Build your page with the assistant as a web component

You can see an example of how to structure your page with the assistant as a web component in the `src/index.html` file. The initialization process is handled by the `initSinequaAssistant` and `initDocumentsUpload` functions, which set up all the necessary components.

The following components are available:

- `sq-chat-wrapper`: The main chat component.
- `sq-chat-settings-wrapper`: The settings component for the chat.
- `sq-saved-chats-wrapper`: The component for displaying saved chats.
- `sq-document-overview-wrapper`: The component for displaying an overview of uploaded documents.
- `sq-document-upload-wrapper`: The component for uploading documents.

## How-to tricks

This section provides tips and tricks for customizing the assistant web component to fit your needs.

### Customizing the look and feel

The global styling for the web component is defined in the `src/styles.css` file. You can modify this file to change the appearance of the components. For example, you can change the colors, fonts, and layout to match your application's design.

### Customizing the behavior

The `sq-chat-wrapper` component dispatches events when the user clicks on the "open preview" or "open document" icons. You can listen for these events to implement custom behavior, such as displaying a modal window or navigating to a different page.

Here is an example of how to add event listeners to the `sq-chat-wrapper` component:

```html
<script>
    // Chat Wrapper
    var chatElement = document.createElement("sq-chat-wrapper");
    chatElement.style = "display: block; width: 100%; height: 100%;";
    chatElement.appConfig = globalConfig;
    chatElement.instanceId = assistantConfig.instanceId;
    chatElement.additionalWorkflowProperties = assistantConfig.additionalWorkflowProperties;
    chatElement.query = assistantConfig.query;

    // Event listeners
    chatElement.addEventListener("openDocument", (e) => console.log("openDocument", e));
    chatElement.addEventListener("openPreview", (e) => console.log("openPreview", e));

    document.getElementById("chat").appendChild(chatElement);
</script>
```

This example demonstrates how to listen for the `openDocument` and `openPreview` events and log the event data to the console. You can replace the `console.log` statements with your own custom logic to perform actions based on these events.

## Use in React

Here's a simple example of how to use the web component in a React application:

```ts
// App.tsx
const [isAuth, setIsAuth] = useState(false);
const sqChatWrapper = useRef<any>(null);

async function connect() {
  await logout();

  login().then((value) => {
    if (value) {
      console.log("Logged in");
      setIsAuth(true);
    } else {
      console.log("Not logged in");
    }
  });
}

useEffect(() => {
  if (sqChatWrapper.current) {
    sqChatWrapper.current.appConfig = globalConfig;
    sqChatWrapper.current.instanceId = /* Your assistant instanceId */;
    sqChatWrapper.current.query = { name: /* Your query name */ };

    sqChatWrapper.current.addEventListener("openDocument", (e) => console.log("openDocument", e));
    sqChatWrapper.current.addEventListener("openPreview", (e) => console.log("openPreview", e));
  }
}, [isAuth]);

return <div>{isAuth && <sq-chat-wrapper class="overflow-auto" ref={astRef} />}</div>;
```

**IMPORTANT:** You need to ensure configuration **and** authentication are done before rendering the component.
The `SqChatWrapper` component tests for defined values for `appConfig`, `instanceId` and `query` properties, but nothing more.

## Test the chat web element

```bash
cd vite
npm ci # for the first time only
npm run vite
```

## Translations

The web component uses [Transloco](https://jsverse.github.io/transloco/) for internationalization. Language support has two dimensions: which languages are **available** (configured at build time) and which language is **active** (can be switched at runtime).

### Configuring available languages (build time)

To add or change the supported languages, update `availableLangs` and `defaultLang` in `src/main.ts`:

```ts
provideTransloco({
  config: {
    availableLangs: ['en', 'fr', 'de'],   // languages your deployment supports
    defaultLang: 'en',                    // fallback when no match is found
    reRenderOnLangChange: true,
    fallbackLang: 'en',
  },
}),
```

Then provide the corresponding translation files in `src/assets/i18n/` (e.g. `fr.json`, `de.json`) and rebuild the project. The built assets will include all translation files for the declared languages.

### Switching the active language at runtime

The active language can be changed at any time after the web component has loaded, without a page reload. Two mechanisms are available.

#### 1. Automatic detection from the page language

When the web component initialises it reads `<html lang="...">` and activates the matching language automatically. This requires no extra code on the host page, standard CMS platforms (WordPress, Drupal, etc.) already set this attribute.

```html
<!-- WordPress / any CMS — the web component picks this up on load -->
<html lang="fr-FR">
```

Full BCP 47 locale codes (`fr-FR`, `en-US`) are accepted; only the primary language subtag is used (`fr`, `en`).

#### 2. Event-based switching

To switch language after the page has loaded, dispatch a `sinequa-set-language` custom event on `document`:

```javascript
document.dispatchEvent(
  new CustomEvent('sinequa-set-language', { detail: { lang: 'fr' } })
);
```

The `lang` value can be a bare tag (`fr`) or a full BCP 47 code (`fr-FR`). Only languages declared in `availableLangs` at build time are accepted; unsupported values are silently ignored.

#### Confirmation event

Once the language switch has been applied, the web component dispatches a `sinequa-language-changed` event back on `document`. Listen for it to confirm the change or to react to it in the host page:

```javascript
document.addEventListener('sinequa-language-changed', (event) => {
  console.log('Active language:', event.detail.lang); // e.g. 'fr'
});
```

#### Full example — language picker in a host page

```html
<select onchange="setLanguage(this.value)">
  <option value="en">English</option>
  <option value="fr">Français</option>
  <option value="de">Deutsch</option>
</select>

<script>
  function setLanguage(lang) {
    document.dispatchEvent(
      new CustomEvent('sinequa-set-language', { detail: { lang } })
    );
  }

  // Optional: react to the confirmation
  document.addEventListener('sinequa-language-changed', (e) => {
    console.log('Language switched to:', e.detail.lang);
  });
</script>
```
