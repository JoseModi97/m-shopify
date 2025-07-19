# M-Shopify: A Modern Point-of-Sale with M-Pesa Integration

This is a Next.js-based e-commerce application designed to showcase a modern point-of-sale system integrated with M-Pesa for payments, built within Firebase Studio.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed on your system:
- [Node.js](httpss://nodejs.org/en/) (v18 or later recommended)
- [npm](httpss://www.npmjs.com/get-npm) or [yarn](httpss://yarnpkg.com/getting-started/install)

### Installation

1.  **Clone the repository or download the source code.**

2.  **Install dependencies:**
    Navigate to the project directory and run the following command to install the required npm packages:
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a new file named `.env` in the root of your project directory. This file will hold your secret credentials for the Daraja API.

    Copy the following variables into your `.env` file and replace the placeholder values with your actual credentials from the Safaricom developer portal.

    ```env
    # Daraja API Credentials
    DARAJA_CONSUMER_KEY="YOUR_CONSUMER_KEY"
    DARAJA_CONSUMER_SECRET="YOUR_CONSUMER_SECRET"
    DARAJA_BUSINESS_SHORT_CODE="YOUR_BUSINESS_SHORTCODE"
    DARAJA_PASSKEY="YOUR_PASSKEY"
    
    # The callback URL for Daraja to send transaction results.
    # For local development, you might need a tool like ngrok to expose your local server.
    DARAJA_CALLBACK_URL="https://your-callback-url.com/api/callback"
    ```

    **Important:** The `.env` file is included in `.gitignore` by default to prevent your secret keys from being committed to version control.

### Running the Development Server

Once you have installed the dependencies and configured your environment variables, you can start the development server:

```bash
npm run dev
```

This will run the application in development mode. Open [http://localhost:9002](http://localhost:9002) (or the port specified in your terminal) to view it in the browser. The page will auto-update as you make changes to the code.

## Available Scripts

In the project directory, you can run:

-   `npm run dev`: Runs the app in development mode.
-   `npm run build`: Builds the app for production.
-   `npm start`: Starts the production server (run `npm run build` first).
-   `npm run lint`: Lints the project files.
