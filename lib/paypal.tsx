import {
  LiveEnvironment,
  SandboxEnvironment,
} from "@paypal/checkout-server-sdk/lib/core/paypal_environment";
import { PayPalHttpClient } from "@paypal/checkout-server-sdk/lib/core/paypal_http_client";

const configureEnvironment = function (): LiveEnvironment | SandboxEnvironment {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId) {
    throw new Error("PayPal client ID is missing");
  }
  if (!clientSecret) {
    throw new Error("PayPal client Secret is missing");
  }

  return process.env.NODE_ENV === "production"
    ? new LiveEnvironment(clientId, clientSecret)
    : new SandboxEnvironment(clientId, clientSecret);
};

const client = function (): PayPalHttpClient {
  return new PayPalHttpClient(configureEnvironment());
};

export default client;
