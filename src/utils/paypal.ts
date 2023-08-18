import { env } from "@/env.mjs";
const {
  PAYPAL_API_URL,
  PAYPAL_APP_SECRET,
  PAYPAL_CLIENT_ID,
} = env;

export async function generateAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID as string}:${PAYPAL_APP_SECRET as string}`).toString(
    "base64"
  );
  const response = await fetch(`${PAYPAL_API_URL as string}/v1/oauth2/token`, {
    method: "post",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  const jsonData = (await handleResponse(response)) as { access_token: string };
  return jsonData.access_token;
}

async function handleResponse(response: Response) {
  if (response.status === 200 || response.status === 201) {
    return response.json();
  }

  const errorMessage = await response.text();
  throw new Error(errorMessage);
}
