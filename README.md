# NextJS Boilerplate

## Setup

---

First, setup the husky to enable pre-commit check:

```
npm run husky
```

Next, run the development server:

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

---

To deploy, you can use either:

```
npm run start
```

or

utilize the `docker-compose`

## Documentation

---

### Environment Variables

For the env files, the developers need to make sure that these files has the same _variables_ to make sure there is no error in other environment. For default, the env files are:

1. development: `.env.development`
2. test: `.env.test`
3. staging: `.env.staging`
4. production `.env.production`

The developer could utilize `.env.local` that will overwrite the other `.env.*`. So it does not need to be the same as other file and just need to initialize variables that the developer wants to overwrite. Also, `.env.local` will not be pushed to the git repository since it is ignored by the `.gitignore`.

For more info, please read the [official documentation](https://nextjs.org/docs/basic-features/environment-variables#default-environment-variables).

---

### Pages

In this project, the developer can create a new page by creating a file

```
<page_name>.page.{tsx,ts,jsx,js}
```

- Since the `page_name` will be use as-is, it is recommended to use `kebab-case` as this naming convention is the common convention for url.

- Component without `.page` will be treat as a child component that could be used inside the page component.

> To change on how the page is determined, the developer can go to the `next.config.js` file and take a look at the `pageExtensions` key.

Absolute import has been setup for pages folder. To utilize it, the developer can import it by:

```
@pages/<page_name>
```

Please visit the [official documentaion](https://nextjs.org/docs/routing/introduction) to learn more about routing.

---

### Components

A re-usable components should be put inside the `src/components` folder. Since it might be hard to know which component is ready-to-use by other developers, it is recommend to add a folder structure like [Atomic Design Methodology](https://atomicdesign.bradfrost.com/chapter-2/) and [storybook](https://storybook.js.org/docs/react/get-started/introduction).

Absolute imports has been setup for components folder. To utilize it, the developer can import it by:

```
@components/<component_name>
```

---

### Core

The `src/core` is used for:

- global configuration: `src/core/config.ts`
- global variables: `src/core/const.ts`
- global functions: `src/core/utils.ts`
- global test utility functions: `src/core/test-utils.tsx`

> The developer could add re-usable config, variables, functions, or utility functions to the respective file if needed.

#### Data Fetching

To have the same experience of data fetching in the project, the data fetching module is created. This module is using several packages:

- [axios](https://axios-http.com/docs/intro): Promise based HTTP client
- [swr](https://swr.vercel.app/docs/getting-started): hooks for the data fetching

Please take a look at the [request.ts](https://github.com/ieuanign/next-boilerplate/blob/main/src/core/http/request.ts) file to understand how to utilize the data fetching module.

Absolute imports has been setup for components folder. To utilize it, the developer can import it by:

```
@core/<module_name>
```

---

### Logo

As logo is one of the important assets in the project, this project already setup the example for it and already connect it to the [Head Component](https://github.com/ieuanign/next-boilerplate/blob/main/src/components/Head.tsx). To change the logo, the developer should:

1. Get the logo in `.{png,jpg,gif}` file extension with recommended size of **310x310px**
2. Go to the https://www.favicon-generator.org/ to generate the logo.
3. Replace the [favicons](https://github.com/ieuanign/next-boilerplate/tree/main/public/static/favicons) folder inside the `public/static` with the generated favicons.

> **Don't** modify the `manifest.json` file unless you know what you are doing.

---

### Localization

To utilize the localization, the developers can take a look at the [public/locales](https://github.com/ieuanign/next-boilerplate/tree/main/public/locales) folder to add the localization for the respective language.

Currently, the localization has been used by the [Head Component](https://github.com/ieuanign/next-boilerplate/blob/main/src/components/Head.tsx) that will change the title and the meta tag according to the language used by the path:

- http://localhost:3000/en/\*
- http://localhost:3000/id/\*

With that, every Page Component must return `serverSideTranslations` with the respective `locale` variable in the `getServerSideProps`. To simplify it, the developer could use `ssrLangProps` function from the `@core/utils`. For example:

```
import { ssrLangProps } from "@core/utils";

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
	const transalations = await ssrLangProps(locale);

	return {
		props: transalations,
	};
};
```

> Since not every project might use localization, it is recommended to remove the setup for localization if it is not needed.

**To remove the localization:**

- Uninstall the `next-i18next` and `i18next` packages

```
npm uninstall next-i18next i18next
```

- Remove every usage of the uninstalled packages including `appWithTranslation`, `useTranslation`, `ssrLangProps`, etc.
- Delete the `public/locales`folder
- Delete the `next-i18next.config.js` and remove `i18n` in the `next.config.js`
- Remove the code related to the localization in the `src/middleware.page.ts`.

---

### Styling

visit ./src/styles

#### Fonts

---

### Mock

---

### Unit Testing
