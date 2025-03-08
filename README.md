> 🏗️ Very early stage work in progress!

# 👶 Baby Monitor 🍼

Track your baby's formula milk consumption.

## Background

If you are feeding your baby with formula, you want to have an overview over how much milk your baby consumes and what pattern the milk consumption has. This application allows submitting a consumed amount to a database, displaying the consumption of today and the previous two days in an area chart.

Lots of more features to come—fast adding, deleting, multi-user, poo and sleep tracking, responsiveness.

## Technology

While this is a Next.js project using Tailwind as UI library and MySQL to store data, my main interest was to apply Vega for rendering a somewhat complex chart.

## Configuration

Create a `.env` file in the project root directory containing the credentials for your MySQL database, i.e.:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=secret
DB_NAME=baby-monitor
```

Installation needs to be done using `--legacy-peer-deps` since *react-vega* does not yet officially support React 19.

```bash
npm i --legacy-peer-deps
```

## Starting the application

```bash
npm run dev
```
