"use client";
import { setCookie, useGetCookie } from "cookies-next/client";
import { StoreProvider, useStoreState } from "easy-peasy";
import { SendHorizonal } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { passwordVerifyPreProduction } from "@/lib/actions/password";
import { authClient } from "@/lib/auth/client";
import { type StoreModel, store } from "@/lib/store";
import { cn } from "@/lib/utils";

export function DebugScreen() {
  return (
    <StoreProvider store={store}>
      <StoredDebugScreen />
    </StoreProvider>
  );
}

export function StoredDebugScreen() {
  const [debugState, setDebugState] = useState<
    | "loading"
    | "preproduction-password-required"
    | "development-not-logged-in"
    | "development-logged-in"
    | "not-logged-in"
    | "logged-in"
  >("loading");
  const [debugPassword, setDebugPassword] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { setState: setDebugScreenState } = store.getActions().debugScreen;
  const debugScreenState = useStoreState(
    (state: StoreModel) => state.debugScreen.state,
  );

  const getCookie = useGetCookie();
  const user = authClient.useSession();

  // Run preproduction check in an effect (not during render)
  // biome-ignore lint/correctness/useExhaustiveDependencies: idk vro
  useEffect(() => {
    let cancelled = false;

    async function verifyPreproduction() {
      if (process.env.NODE_ENV === "development") {
        setDebugState("development-not-logged-in");
        return;
      }

      const preproductionPassword = getCookie("preproduction");
      const verified = await passwordVerifyPreProduction(
        preproductionPassword || "",
      );

      if (cancelled) return;

      if (!verified) {
        setDebugState("preproduction-password-required");
      }
    }

    verifyPreproduction();

    return () => {
      cancelled = true;
    };
  }, [getCookie]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: we need to recheck for each new window
  useEffect(() => {
    if (debugState === "preproduction-password-required") return;

    if (!user.isPending && debugState === "loading") {
      if (process.env.NODE_ENV === "development") {
        setDebugState(
          user.data ? "development-logged-in" : "development-not-logged-in",
        );
      } else {
        setDebugState(user.data ? "logged-in" : "not-logged-in");
      }
    }
  }, [debugState, user.isPending, user.data]);

  if (!mounted) return null;

  return (
    <div className="fixed top-8 right-8 z-50">
      {debugScreenState === "minimized" ? (
        <button
          className="bg-black/20 text-red-700/50"
          type="button"
          onClick={() => setDebugScreenState("visible")}
        >
          open debug screen
        </button>
      ) : (
        debugScreenState === "visible" && (
          <div className="flex flex-col items-end bg-black p-4 text-sm text-white">
            <h2 className="text-lg">cool debug screen</h2>
            {debugState === "loading" && <p>loading...</p>}
            {debugState === "preproduction-password-required" && (
              <>
                <p className="mt-2">input password to continue.</p>
                <div className="flex justify-center gap-1">
                  <input
                    className="bg-white/20 text-right font-mono"
                    type="password"
                    value={debugPassword}
                    onChange={(e) => setDebugPassword(e.target.value)}
                  ></input>
                  <button
                    className={cn(
                      "px-1",
                      debugPassword.length === 0
                        ? "cursor-not-allowed bg-white/10"
                        : "cursor-pointer bg-white/30",
                    )}
                    type="button"
                    disabled={debugPassword.length === 0}
                    onClick={() =>
                      toast.promise<boolean>(
                        // biome-ignore lint/suspicious/noAsyncPromiseExecutor: it must
                        new Promise(async (resolve) => {
                          const verified =
                            await passwordVerifyPreProduction(debugPassword);

                          setCookie("preproduction", debugPassword, {
                            maxAge: 60 * 60 * 24 * 30, // 30 days
                          });

                          return resolve(verified);
                        }),
                        {
                          loading: "Checking your password...",
                          success: (data) => {
                            if (data) {
                              setDebugState("loading");
                              window.location.reload();
                              return "You're logged in!";
                            } else {
                              return "It's wrong bro.";
                            }
                          },
                          error: "Error",
                        },
                      )
                    }
                  >
                    <SendHorizonal size={12} />
                  </button>
                </div>
              </>
            )}
            {(debugState === "not-logged-in" ||
              debugState === "development-not-logged-in") && (
              <>
                <button
                  className="cursor-pointer text-blue-300"
                  type="button"
                  onClick={() =>
                    authClient.signIn.oauth2({
                      providerId: "hackclub",
                      callbackURL: "/api/auth/completed",
                    })
                  }
                >
                  sign in
                </button>
                <button
                  className="cursor-pointer text-blue-300 hover:text-red-600"
                  type="button"
                  disabled
                >
                  sign up (not implemented)
                </button>
              </>
            )}
            <br />
            <button
              className="cursor-pointer text-red-300"
              type="button"
              onClick={() => setDebugScreenState("minimized")}
            >
              minimize debug screen
            </button>
          </div>
        )
      )}
    </div>
  );
}
