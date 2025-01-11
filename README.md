# [Dodgy Stock Predictions](https://dodgy-stock-predictions.pages.dev/)

This repository is a stock predictions application demonstrating the integration between `CloudFlare Workers`, `CloudFlare AI Gateway`, `CloudFlare Pages` and `OpenAI API` for generating humorous stock predictions.

## Architecture

The application consists of three main components:
- A frontend web application built with vanilla JavaScript
- An OpenAI predictions worker for generating stock analysis
- A Polygon API worker for fetching historical stock data

### Key Features
- Real-time stock data fetching using Polygon.io API
- AI-powered stock predictions using OpenAI's GPT-4 model
- CORS-enabled API endpoints for cross-origin requests
- Smart placement optimization for CloudFlare Workers
- Configurable date ranges for historical data analysis

## Getting Started

### Prerequisites
- `node.js`
- `npm`
- A CloudFlare account with Workers and Pages enabled
- A Polygon.io API key
- An OpenAI API key

### Running the Frontend Locally
1. Clone the repository:
   ```sh
   git clone https://github.com/robinsalehjan/dodgy-stock-predictions.git
   cd dodgy-stock-predictions
   ```

2. Install dependencies and start the frontend:
   ```sh
   cd web && npm install && npm run start
   ```

### Deploying the Workers

1. Deploy the OpenAI predictions worker:
   ```sh
   cd workers/openai-stock-predictions-worker
   npm install
   npm run deploy
   ```

2. Deploy the Polygon API worker:
   ```sh
   cd workers/polygon-api-worker
   npm install
   npm run deploy
   ```

### Environment Variables

The following environment variables need to be set in your CloudFlare Workers:

#### OpenAI Predictions Worker
- `OPENAI_API_KEY`: Your OpenAI API key
- `AUTH_OPENAI_STOCK_PREDICTIONS_WORKER`: CloudFlare AI Gateway authorization token

#### Polygon API Worker
- `POLYGON_API_KEY`: Your Polygon.io API key

## Disclaimer

This application is for entertainment purposes only. The stock predictions are intentionally humorous and should not be used for actual financial decisions.
