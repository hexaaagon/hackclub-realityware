"use client";
import { authClient } from "@realityware/auth/client";
import Link from "next/link";
import { toast } from "sonner";
import useSWRImmutable from "swr/immutable";
import { Button, buttonVariants } from "@/components/ui/button";

export default function Home() {
  const {
    isLoading: isUserLoading,
    data: userData,
    mutate: _mutateUser,
  } = useSWRImmutable("auth/user", async () => await authClient.getSession());
  const {
    isLoading: isHackatimeLinkLoading,
    data: hackatimeLinkData,
    mutate: mutateHackatimeLink,
  } = useSWRImmutable("auth/linked-hackatime", async () => {
    const data = await authClient.getAccessToken({
      providerId: "hackatime",
    });
    await mutateHackatimeProfile();
    return data;
  });
  const {
    isLoading: isHackatimeProfileLoading,
    data: hackatimeProfileData,
    mutate: mutateHackatimeProfile,
  } = useSWRImmutable(
    hackatimeLinkData?.data ? "hackatime/profile" : null,
    async () => {
      const response = await fetch(
        "https://hackatime.hackclub.com/api/v1/authenticated/me",
        {
          headers: {
            Authorization: `Bearer ${hackatimeLinkData?.data?.accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user info from Hackatime");
      }

      const data = (await response.json()) as {
        id: number;
        emails: string[];
        slack_id: string | null;
        github_username: string;
        trust_factor: {
          trust_level: "yellow" | "green" | "red" | "blue";
          trust_score: 1 | 2 | 3 | 0;
        };
      };

      return data;
    },
  );

  return (
    <main className="noise flex min-h-screen flex-col gap-2 p-5">
      <div className="mx-2 flex w-max flex-col gap-4 border-2 bg-secondary p-4">
        <h1 className="underline">(temporary) debug screen</h1>
        <span className="border p-4">
          <h2>account data</h2>
          <pre className="bg-accent-foreground/10 font-mono text-xs">
            {isUserLoading ? "loading..." : JSON.stringify(userData, null, 2)}
          </pre>
        </span>
        <span className="border p-4">
          <h2>hackatime linked data</h2>
          <pre className="bg-accent-foreground/10 font-mono text-xs">
            {isHackatimeLinkLoading
              ? "loading..."
              : JSON.stringify(hackatimeLinkData, null, 2)}
          </pre>
        </span>
        <span className="border p-4">
          <h2>hackatime profile data</h2>
          <pre className="bg-accent-foreground/10 font-mono text-xs">
            {isHackatimeProfileLoading
              ? "loading..."
              : isHackatimeLinkLoading
                ? "loading..."
                : hackatimeProfileData
                  ? JSON.stringify(hackatimeProfileData, null, 2)
                  : "no hackatime account linked"}
          </pre>
        </span>
        <span className="grid grid-cols-2 gap-2">
          <Button
            disabled={isHackatimeLinkLoading || !!hackatimeLinkData?.data}
            onClick={async () => {
              toast.promise(
                authClient.oauth2.link({
                  providerId: "hackatime",
                  callbackURL: `${window.location.origin}`,
                }),
                {
                  loading: "Redirecting to Hackatime...",
                  success: (c) => {
                    return "Redirected! Please complete sign in to continue.";
                  },
                  error: "Failed to redirect. Please try again.",
                },
              );
            }}
          >
            link hackatime account
          </Button>
          <Button
            disabled={isHackatimeLinkLoading || !hackatimeLinkData?.data}
            onClick={async () => {
              toast.promise(
                authClient.unlinkAccount({
                  providerId: "hackatime",
                }),
                {
                  loading: "Unlinking Hackatime account...",
                  success: (c) => {
                    mutateHackatimeLink();
                    return "Unlinked!";
                  },
                  error: "Failed to redirect. Please try again.",
                },
              );
            }}
          >
            unlink hackatime account
          </Button>
        </span>
        <span className="grid grid-cols-7 gap-2">
          <Link className={buttonVariants()} href="/home">
            homepage
          </Link>
          <Button disabled>settings</Button>
          <Button disabled>docs & swagger</Button>
          <Link className={buttonVariants()} href="/">
            user's dashboard
          </Link>
          <Link className={buttonVariants()} href="/admin">
            admin dashboard
          </Link>
          <Link className={buttonVariants()} href="/admin/reviewer">
            reviewer's dashboard
          </Link>
          <Link className={buttonVariants()} href="/admin/fulfillment">
            fulfillment dashboard
          </Link>
        </span>
        <Button
          onClick={async () => {
            await authClient.signOut();
            window.location.reload();
          }}
          variant="destructive"
        >
          log out
        </Button>
      </div>
    </main>
  );
}
