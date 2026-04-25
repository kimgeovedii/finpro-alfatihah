import axios from "axios";

export interface GoogleUserPayload {
  sub: string;       // Google user ID
  email: string;
  email_verified: boolean;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  aud: string;       // Audience (Client ID)
}

/**
 * Verifies a Google ID token using Google's tokeninfo endpoint.
 * Returns the decoded payload if valid.
 */
export async function verifyGoogleToken(credential: string): Promise<GoogleUserPayload> {
  try {
    const response = await axios.get<GoogleUserPayload>(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
    );

    const payload = response.data;

    // Validate the audience (client ID) matches our app
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (clientId && payload.aud !== clientId) {
      throw new Error("Token audience mismatch");
    }

    if (!payload.email || !payload.email_verified) {
      throw new Error("Google account email not verified");
    }

    return payload;
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error("Invalid Google token");
    }
    throw error;
  }
}
