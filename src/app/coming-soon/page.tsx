"use client";

import { ArrowRight, Globe, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import RealitywareFullText from "#/images/logos/realityware_fulltext.svg";
import FadeContent from "@/components/ui/fade-content";
import Particles from "@/components/ui/particles-bg";
import { store } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function Home() {
  const [email, setEmail] = useState("");

  const { setState: setDebugScreenState } = store.getActions().debugScreen;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    const encodedEmail = encodeURIComponent(email);

    const url = `https://realityware.fillout.com/rsvp?email=${encodedEmail}`;
    window.location.href = url;
  };

  return (
    <>
      <div
        className={cn(
          "noise grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 bg-slate-200 p-8 px-20 pb-20 font-sans sm:p-20",
        )}
      >
        <main className="relative z-10 row-span-2 flex flex-col items-center gap-[24px] text-center">
          {/* <h1 className="text-6xl">🏳️</h1> */}
          <FadeContent duration={1000} initialOpacity={0}>
            <div className="flex items-center justify-center">
              <Image
                src={RealitywareFullText}
                height={150}
                width={450}
                alt="Realityware Logo - Full Text"
              />
            </div>
          </FadeContent>
          <div>
            <FadeContent duration={1000} delay={100} initialOpacity={0}>
              <h1 className="font-pixel-square font-semibold text-xl tracking-tighter sm:text-3xl">
                Ship a solution to a real world problem, earn prizes
              </h1>
            </FadeContent>
            <FadeContent duration={1000} delay={200} initialOpacity={0}>
              <p className="max-w-screen-md font-medium sm:text-lg">
                Hold up, we're still cooking.
              </p>
            </FadeContent>
          </div>
          <FadeContent duration={1000} delay={300} initialOpacity={0}>
            <form
              onSubmit={handleSubmit}
              method="post"
              className="mx-auto flex w-fit justify-between gap-x-2"
            >
              <div className="flex h-14 items-center gap-2 rounded-xs border border-black bg-white px-3">
                <Mail />
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-80 flex-1 bg-transparent text-black placeholder-gray-400 focus:outline-none"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className={cn(
                    "flex h-14 items-center gap-x-2 rounded-xs border border-black px-6 font-medium transition-all duration-200",
                    !emailRegex.test(email)
                      ? "cursor-not-allowed bg-red-300"
                      : "cursor-pointer bg-green-300",
                  )}
                  disabled={!emailRegex.test(email)}
                >
                  RSVP
                  <ArrowRight />
                </button>
                {/*<p className="underline">or, sign in</p>*/}
              </div>
            </form>
          </FadeContent>
        </main>
        <footer className="relative z-10 flex flex-col items-center justify-center gap-1">
          <Link
            className="flex items-center gap-2 underline hover:underline-offset-4"
            href="https://hackclub.enterprise.slack.com/archives/C09QEU276SE"
          >
            #realityware
          </Link>
          <button
            className="flex cursor-pointer items-center gap-2 underline hover:underline-offset-4"
            type="button"
            onClick={() => setDebugScreenState("visible")}
          >
            open debug screen
          </button>
        </footer>
      </div>
      <Particles
        particleColors={["000000", "000000"]}
        particleCount={100}
        particleSpread={10}
        speed={0.05}
        particleBaseSize={100}
        alphaParticles={false}
        disableRotation={false}
        className="pointer-events-none fixed top-0 left-0 h-full min-h-screen w-full opacity-50"
      />
    </>
  );
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
