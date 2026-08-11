import { google } from "googleapis";
import { config } from "../config/env.js";

// Required scopes for the application
export const SCOPES = [
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.compose",
  "https://www.googleapis.com/auth/documents"
];

let oAuth2Client: InstanceType<typeof google.auth.OAuth2> | null = null;

export function getAuthClient() {
  if (oAuth2Client) return oAuth2Client;

  oAuth2Client = new google.auth.OAuth2(
    config.GOOGLE_CLIENT_ID,
    config.GOOGLE_CLIENT_SECRET,
    config.GOOGLE_REDIRECT_URI
  );

  if (config.GOOGLE_REFRESH_TOKEN) {
    oAuth2Client.setCredentials({
      refresh_token: config.GOOGLE_REFRESH_TOKEN,
    });
  }

  return oAuth2Client;
}

export function getAuthUrl() {
  const client = getAuthClient();
  return client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent", // Force to get refresh token
  });
}
