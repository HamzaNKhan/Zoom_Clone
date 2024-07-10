"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

const API_Key = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const API_Secret = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
  const user = await currentUser();

  if (!user) throw new Error("User is not logged in");
  if (!API_Key) throw new Error("No API Key");
  if (!API_Secret) throw new Error("No API Secret");

  // since this file is server side we cannot use nextJS streamCLient SDK so we need to install and import node SDK
  const client = new StreamClient(API_Key, API_Secret);
  const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;

  const issued = Math.floor(Date.now() / 1000) - 60;

  const token = client.createToken(user.id, exp, issued);

  return token;
};
