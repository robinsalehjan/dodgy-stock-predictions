# Dodgy Stock Predictions

This repository demonstrates a sample integration of CloudFlare Workers, Pages, and OpenAI to create a stock prediction application.

## Getting Started

### Prerequisites
- `Node.js`
- `npm`

### Running frontend locally with workers on CloudFlare
1. Clone the repository:
   ```sh
   git clone https://github.com/robinsalehjan/dodgy-stock-predictions.git
   cd dodgy-stock-predictions
   ```

2. Install dependencies for `web` and start the client on `http://localhost:5173/`
   ```sh
   cd web && npm install && npm run start
   ```

## Running workers locally
1. [Create API key for `OpenAI`](https://platform.openai.com/settings/profile?tab=api-keys)

2. [Create API key for `Polygon`](https://polygon.io/dashboard/keys)

3. Create `.dev.vars` file at the root of `openai-stock-predictions-worker` and `polygon-api-worker` projects

4. Install dependencies for each seperate `worker` and start them locally
  ```sh
  cd workers && cd openai-stock-predictions-worker && npm install && npm run start
  cd workers && cd polygon-api-worker && npm install && npm run start
  ```
