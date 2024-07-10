'use client'

import { tokenProvider } from "@/actions/stream.actions";
import { useUser } from "@clerk/nextjs";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { Loader } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
//   const userId = 'user-id';
//   const token = 'authentication-token';
//   const user: User = { id: userId };

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [VideoClient, setVideoClient] = useState<StreamVideoClient>();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;
    if (!apiKey) throw new Error("Stream API key is missing");

    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: user?.id,
        name: user?.username || user?.id,
        image: user?.imageUrl,
      },
      //token is a secret key that should only be accessable from server for security 
    //   purposes for that reason we have created an actions file and used "user server" directive
      tokenProvider: tokenProvider,
    });

    setVideoClient(client)
  }, [user, isLoaded]);

  if (!VideoClient) return <Loader />

  return <StreamVideo client={VideoClient}>
    {children}
  </StreamVideo>;
};

export default StreamVideoProvider;
