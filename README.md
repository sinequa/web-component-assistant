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

We do **not** provide system to update translations dynamically, but we do provide Transloco scoped libraries support, which means you _can_ have translations for your web component, but at **build time** only.

To update translations, you need to add your language to `availableLangs` and update `defaultLang` properties in `src/main.ts`:

```ts
import ...

createApplication({
  providers: [
    ...,

    provideTransloco({
      config: {
        availableLangs: ['en', 'fr'],   // <-- There
        defaultLang: 'en',              // <-- And there
        ...
      },
    }),
  ],
})
  .then((app) => {
    ...
  });
```

Once updated, build the project again and your web component will point to the new default language. You will have to provide the translation files for your language in the `src/assets/i18n/` folder.
