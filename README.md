# HNNJ Community browser

This app is created for the HNNJ community BBS.

## Project structure

This app is created with SvelteKit.

The only backend is Supabase, which is for storing user-uploaded assets only.

A web proxy is required for reading/writing content from the community BBS.
See the supplemental [hnnj-proxy](https://github.com/a-konomi/hnnj-proxy) repository.

There is no management or user login in this app.

As of 2022/11/14, this app is hosted on Vercel.
[Visit the app](https://hnnj.vercel.app/).
Any updates to this repo will be reflected on the app in a short time.

## Developing

You will need to setup a `.env` file with proper Supabase, or other backend credentials.
Sample `.env` config:

```text
PROXY_URL="http://localhost:1234"
VITE_SUPABASE_URL="..."
VITE_SUPABASE_ANON_KEY="..."
```

Once you've created the `.env` file, started the proxy server, and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
