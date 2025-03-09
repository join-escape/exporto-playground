"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaGoogle, FaGithub } from "react-icons/fa";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignIn = async (provider: string) => {
    setIsLoading(true);
    await signIn(provider, { callbackUrl: "/playground" });
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="mx-auto max-w-md w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Sign in to your account to access the Notion converter
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            onClick={() => handleSignIn("google")}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              "Loading..."
            ) : (
              <>
                <FaGoogle className="mr-2 h-4 w-4" />
                Sign in with Google
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSignIn("github")}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              "Loading..."
            ) : (
              <>
                <FaGithub className="mr-2 h-4 w-4" />
                Sign in with GitHub
              </>
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="mt-2 text-xs text-center text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
