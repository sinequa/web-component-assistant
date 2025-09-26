# AssistantElement

## Anatomy

- `dist/assistant-element/` contains the built web component files for `sq-chat-wrapper`. Files to be used for web components are `browser/main.js` and `browser/polyfills.js`, copy and paste them in your project static folder.
- `src/` contains the source code to build the web component and the chat component wrapper.
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

Use the `API_URL` constant from `vite.config.js` as your proxy URL:

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

The `initSinequaAssistant()` function calls a set of function to initialize the component, including fetching of the _csrf token_.
Once the challenge completed and the token is stored, the `initSinequaAssistant()` function sets up the DOM elements for the chat component.

## Build your page with the assistant as a web component

You can see an example of how to structure your page with the assistant as a web component in the last `.then()` block from `src/index.html`.

- A parent element `<div>` to contain the chat component.
- `sq-chat-wrapper` for the chat component.
- `sq-saved-chats-wrapper` for the saved chats component.

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
