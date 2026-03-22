# 👶 Baby Monitor 🍼

Track your baby's formula milk consumption.

## Demo

https://my-baby-monitor.vercel.app/

> A.I. features are not enabled on the demo deployment.

## Background

If you are feeding your baby with formula, you want to have an overview over how much milk your baby consumes and what pattern the milk consumption has. With this application, the amount consumed can be submitted to a database for displaying the consumption of today and the previous two days in an area chart.

When accessing the application, a session is created by assigning a human-readable id. The URL containing the session id can be shared with someone else, so anyone feeding milk can access the same session.

A session an all its data is deleted after 10 days of inactivity.

More features to come—diaper change, poo and sleep tracking.

## Technology

While this is a Next.js project using Tailwind as UI library and MySQL to store data, my initial main interest was to apply Vega for rendering a somewhat complex chart. Using this project to keep in touch with certain technologies, it will increasingly incorporate A.I. features.

## Configuration

Create a `.env` file in the project root directory containing the credentials for your MySQL database, i.e.:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=secret
DB_NAME=baby-monitor
```

To create the database tables, access `/api/create` after starting the application. This will create the required tables, unless they already exist.

Quick actions for logging milk consumption just pressing a button without having to specify the amount of milk manually, may be configured in the `.env.local` file:

```
NEXT_PUBLIC_BOTTLE_SIZES=90,120,150,180,210,240
```

## A.I. features

At the moment, the Baby Monitor generates a simple daily summary in natural language.

The project uses [Vercel's AI SDK](https://ai-sdk.dev/) to interface to Anthropic. Having an `ANTHROPIC_API_KEY` in the local environment variables enables the A.I. features. The model can be picked per `.env` or  `.env.local`:

```
ANTHROPIC_API_KEY=...
NEXT_PUBLIC_ANTHROPIC_MODEL=claude-haiku-4-5
```

```bash
npm i
```

## Starting the application

```bash
npm run dev
```
