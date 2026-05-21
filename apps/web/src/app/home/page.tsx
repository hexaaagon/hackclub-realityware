"use client";
import { EnvelopeIcon } from "@phosphor-icons/react/dist/ssr";
import { authClient } from "@realityware/auth/client";
import { env } from "@realityware/env";
import posthog from "@realityware/telemetry";
import { cn } from "@realityware/util";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import Graffiti from "#/images/graffiti.svg";
import Depot17Logo from "#/images/logos/depot17.svg";
import HackClubLogo from "#/images/logos/hackclub.svg";
import RealitywareFullText from "#/images/logos/realityware_fulltext.svg";
import ZoomLock from "@/components/zoom-lock";

const RAILING_LEFT_OFFSET = 96;

const steps = [
  {
    title: "Identify an Issue",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur varius a nisl nec iaculis.",
  },
  {
    title: "Build a Solution",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur varius a nisl nec iaculis.",
  },
  {
    title: "Implement it in real life",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur varius a nisl nec iaculis.",
  },
  {
    title: "Earn Prizes",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur varius a nisl nec iaculis.",
  },
];
const faqs: Array<{ q: string; a: string }> = [
  {
    q: "What can I make?",
    a: "Any hardware or software project, that solves a real world issue. Unsure if your project qualifies? Ask in #realityware",
  },
  {
    q: "What are cities, and how do they work?",
    a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur varius a nisl nec iaculis.",
  },
  {
    q: "How do the grants work?",
    a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur varius a nisl nec iaculis.",
  },
  {
    q: "What's Hack Club & Depot17?",
    a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur varius a nisl nec iaculis.",
  },
  {
    q: "What are bounties?",
    a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur varius a nisl nec iaculis.",
  },
  {
    q: 'Can I "double dip" with other Hack Club YSWS events?',
    a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur varius a nisl nec iaculis.",
  },
  {
    q: "Who's eligible?",
    a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur varius a nisl nec iaculis.",
  },
];
const happening = "Sometimes 1st - Sometimes 1st (2026)";

function HRule({
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none border-black/20 border-t-2",
        className,
      )}
      style={{ width: "200dvw", marginLeft: "calc(-100vw + 50%)" }}
      {...props}
    />
  );
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number>(0);
  const [email, setEmail] = useState("");

  return (
    <>
      <style>{`
          html, body {
            margin: 0 !important;
            padding: 0 !important;
          }
        `}</style>
      <ZoomLock />
      <main
        className="noise flex min-h-[calc(100dvh/var(--zoom-scale,1))] w-full flex-col overflow-x-hidden p-8"
        id="zoom-wrapper"
      >
        <div className="absolute top-0 left-0 z-10 size-[33.5px] border-black/20 border-r-2 border-b-2" />
        <div className="absolute top-0 right-0 z-10 size-[33.5px] border-black/20 border-b-2 border-l-2" />
        <div className="absolute bottom-0 left-0 z-10 size-[33.5px] border-black/20 border-t-2 border-r-2" />
        <div className="absolute right-0 bottom-0 z-10 size-[33.5px] border-black/20 border-t-2 border-l-2" />
        <div className="relative overflow-hidden border-2 border-black/20 bg-background font-sans tracking-tight">
          <div
            aria-hidden
            className="*:-ml-20 pointer-events-none absolute inset-y-0 hidden border-black/20 border-l-2 leading-20 *:text-black/40 lg:block"
            style={{
              width: `calc(100% - ${RAILING_LEFT_OFFSET * 2}px)`,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {[...Array(20)].map((_, i) => (
              <p key={i}>{18 + i}N</p>
            ))}
          </div>

          <header className="relative flex min-h-40 w-full items-center justify-around">
            <div className="absolute left-0 flex h-full w-full flex-col gap-2 border-black/20 bg-background p-4 pr-24 [@media(width>=1410px)]:max-w-[calc(3/12*100%)] [@media(width>=1410px)]:border-r-2 [@media(width>=2048px)]:max-w-[calc(2/12*100%)]">
              <div className="flex items-center gap-2">
                <Image
                  src={HackClubLogo}
                  alt="Hack Club Logo"
                  className="h-8 w-auto"
                />
                <span className="text-black/40 text-sm leading-none">|</span>
                <Image
                  src={Depot17Logo}
                  alt="Depot17 Logo"
                  className="h-8 w-auto"
                />
              </div>
              <div className="flex flex-col items-start font-semibold leading-4 *:w-max sm:mt-auto sm:text-lg">
                <span>A Hack Club</span>
                <span>&amp; Depot17 Event</span>
              </div>
              <div className="mt-auto flex flex-col items-start text-sm sm:mt-0 lg:hidden">
                {happening}
              </div>
            </div>
            <div className="absolute right-0 ml-auto flex h-full w-full flex-row gap-2 border-black/20 [@media(width>=1410px)]:max-w-[calc(2/12*100%)] [@media(width>=1410px)]:border-l-2">
              <svg
                width={186 * 1.2}
                height={197 * 1.2}
                viewBox="0 0 164 197"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="-top-0.5 -right-0.5 absolute h-[calc(186px*0.88)] w-[calc(197px*0.88)] [@media(width>=2048px)]:h-[calc(186px*1.1)] [@media(width>=2048px)]:w-[calc(197px*1.1)]"
              >
                <path
                  d="M149 103C149 133.928 123.928 159 93 159C62.0721 159 37 133.928 37 103M149 103V1H37V31.001V103M149 103H93H37M149 103L185 104M37 103H1M185 104C185 154.81 143.81 196 93 196C42.1898 196 1 153.81 1 103M185 104V1H1V103M1 103V196"
                  stroke="#BEC3C8"
                  className="stroke-2 [@media(width>=2048px)]:stroke-[1.5]"
                />
              </svg>
            </div>
          </header>

          <section className="relative border-black/20 border-t-2">
            <div className="relative mx-auto w-full border-black/20 px-[max(20px,7.5vw)] pt-2 pb-20 lg:max-w-[calc(8/12*100%+3px)] [@media(width>=1410px)]:border-x-2">
              <p className="line-clamp-1 hidden max-w-full truncate text-right text-black text-lg tracking-tighter lg:block">
                {happening}
              </p>
              <HRule className="mt-1 mb-2 hidden lg:block" />
              <div className="mt-5 flex w-full items-center justify-center lg:mt-0">
                <Image
                  src={RealitywareFullText}
                  className="h-auto w-full"
                  alt="Realityware"
                />
              </div>
              <HRule className="mt-2 hidden lg:block" />
              <p className="mt-4 mb-4 font-semibold text-3xl leading-8">
                Ship a solution to a real problem, earn prizes.
              </p>

              <form
                className="flex w-fit items-center gap-2"
                onSubmit={async (e) => {
                  e.preventDefault();

                  if (!email) {
                    toast.error("Please enter your email address.");
                    return;
                  }

                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(email)) {
                    toast.error("Please enter a valid email address.");
                    return;
                  }

                  if (env.NEXT_PUBLIC_SIGNUP_ACCESS_DISABLED === "true") {
                    window.location.href = `${env.NEXT_PUBLIC_APP_URL}/api/rsvp?email=${encodeURIComponent(email)}&anon_id=${encodeURIComponent(posthog.get_distinct_id())}`;
                  } else {
                    toast.promise(
                      authClient.signIn.oauth2({
                        providerId: "hca",
                        additionalData: {
                          login_hint: email,
                          anon_id: posthog.get_distinct_id(),
                        },
                      }),
                      {
                        loading: "Redirecting to Hack Club Auth...",
                        success: (m) => {
                          if (m.error) {
                            return `Failed to redirect: ${m.error.message}`;
                          } else
                            return "Redirected! Please complete sign in to continue.";
                        },
                        error: "Failed to redirect. Please try again.",
                      },
                    );
                  }
                }}
              >
                <div className="flex h-12 items-center gap-2 rounded-xs border-2 border-black bg-white/50 px-4">
                  <EnvelopeIcon size={16} />
                  <input
                    type="email"
                    placeholder="orpheus@hackclub.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-full w-full bg-transparent text-md placeholder-black/35 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="h-12 whitespace-nowrap rounded-xs border bg-orange px-4 font-medium text-lg uppercase transition-colors"
                >
                  {env.NEXT_PUBLIC_SIGNUP_ACCESS_DISABLED === "true"
                    ? "RSVP NOW"
                    : "ENTER"}
                </button>
              </form>
              <p className="pt-1 text-md">
                For students aged 13&nbsp;–&nbsp;18 only.
              </p>
            </div>
            <Image
              src={Graffiti}
              className="-bottom-1/2 pointer-events-none absolute right-0 h-100 w-auto opacity-50"
              alt="Grafitti"
            />
          </section>

          <section className="-mt-px relative border-black/20 border-t-2">
            <div className="relative mx-auto w-full border-black/20 px-[max(20px,7.5vw)] pt-2 lg:max-w-[calc(8/12*100%+3px)] [@media(width>=1410px)]:border-x-2">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black bg-white text-base">
                  01
                </span>
                <h2 className="font-sacco text-3xl text-black">How It Works</h2>
              </div>
              <HRule className="my-2" />
              <div className="space-y-4 p-4">
                {steps.map((step) => (
                  <div key={step.title}>
                    <p className="font-bold text-black text-xl">{step.title}</p>
                    <p className="mt-0.5 text-base leading-snug">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="-mt-px relative border-black/20 border-t-2">
            <div className="relative mx-auto w-full border-black/20 px-[max(20px,7.5vw)] py-2 lg:max-w-[calc(8/12*100%+3px)] [@media(width>=1410px)]:border-x-2">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black bg-white text-base">
                  02
                </span>
                <h2 className="font-sacco text-3xl text-black">
                  Frequently Asked Questions
                </h2>
              </div>
              <HRule className="my-2" />
              <div className="relative rounded-xs border border-green bg-white">
                <span className="absolute top-2 right-2 h-3 w-3 rounded-full bg-orange" />

                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="border-black/15 border-b last:border-b-0"
                  >
                    <button
                      className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left font-medium font-medium text-xl transition-colors hover:bg-black/5"
                      onClick={() => setOpenFaq(i)}
                    >
                      <span>{faq.q}</span>
                    </button>
                    {openFaq === i && faq.a && (
                      <div className="px-4 pb-3 text-base leading-snug">
                        {faq.a.includes("#realityware") ? (
                          <>
                            {faq.a.split("#realityware")[0]}
                            <span className="font-medium underline">
                              #realityware
                            </span>
                          </>
                        ) : (
                          faq.a
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="-mt-px relative border-black/20 border-y-2">
            <div className="relative mx-auto w-full border-black/20 px-2 pt-4 pb-2 lg:max-w-[calc(8/12*100%+3px)] [@media(width>=1410px)]:border-x-2">
              <p className="text-right font-semibold text-lg leading-6">
                MORE QUESTIONS? <br />
                ASK IN{" "}
                <a
                  href="https://hackclub.enterprise.slack.com/archives/C09QCT8NEMC"
                  className="underline"
                >
                  #REALITYWARE-HELP
                </a>
              </p>
            </div>
          </section>
          <footer className="relative flex w-full items-end justify-between">
            {/* <HRule /> */}
            <div>
              <div className="w-30 rounded-xs border-2 p-2">
                <svg
                  width="100%"
                  height="auto"
                  viewBox="0 0 553 155"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M41.6524 53.2167C41.6524 54.8241 41.3656 56.1444 40.7918 57.1778C40.2181 58.0963 39.4723 58.9 38.5543 59.5889C37.6364 60.2778 36.6037 60.8518 35.4562 61.3111C34.3088 61.7704 33.2187 62.287 32.186 62.8611C38.8412 65.9611 42.054 71.0704 41.8246 78.1889V155H25.1292V70.6111H16.8675V155H0V0H28.5715C33.1613 0 36.4889 1.03333 38.5543 3.1C40.7345 5.05185 41.8246 7.75 41.8246 11.1944L41.6524 53.2167ZM24.6128 54.5944V15.5H12.9088L16.6739 20.9896L17.2117 54.5944H24.6128Z"
                    fill="#1C1C1C"
                  />
                  <path
                    d="M72.5031 70.6111L72.6753 85.5944V140.017H84.5514V155H55.6356V0H84.3792V15.5H72.8474V55.2833H84.5514V70.6111H72.5031Z"
                    fill="#1C1C1C"
                  />
                  <path
                    d="M140.157 0V155H123.462V70.7833H115.2V155H98.1608V14.1222C98.1608 9.3 99.3656 5.74074 101.775 3.44444C104.185 1.14815 108.086 0 113.479 0H140.157ZM115.545 55.4556H122.946V15.5H110.801L114.566 21.5278L115.545 55.4556Z"
                    fill="#1C1C1C"
                  />
                  <path
                    d="M153.964 155V0H170.144V140.017H182.536V155H153.964Z"
                    fill="#1C1C1C"
                  />
                  <path d="M196.153 0H213.193V155H196.153V0Z" fill="#1C1C1C" />
                  <path
                    d="M254.156 155H237.288V15.5H224.896V0H266.032V15.5H254.156V155Z"
                    fill="#1C1C1C"
                  />
                  <path
                    d="M304.909 0H321.776C321.547 1.26296 321.26 2.87037 320.916 4.82222C320.572 6.65926 320.17 8.5537 319.711 10.5056C319.367 12.4574 319.022 14.3519 318.678 16.1889C318.334 18.0259 317.99 19.5759 317.646 20.8389L308.007 69.0611L298.54 121.589L292.344 155H275.993C276.911 150.293 277.714 145.643 278.403 141.05C279.206 136.457 280.009 131.865 280.812 127.272L290.967 70.6111L276.165 0H292.344L298.885 34.7889L304.909 0Z"
                    fill="#1C1C1C"
                  />
                  <path
                    d="M398.75 155H345.222C340.517 154.656 337.075 153.45 334.895 151.383C332.829 149.317 331.797 145.872 331.797 141.05V0H349.009V138.983H357.098V0H373.793V139.156H382.399V0H398.923V2.41111C398.923 25.4889 398.923 48.4518 398.923 71.3C398.923 94.0333 398.865 116.939 398.75 140.017V155Z"
                    fill="#1C1C1C"
                  />
                  <path
                    d="M454.642 0V155H437.946V70.7833H429.685V155H412.645V14.1222C412.645 9.3 413.85 5.74074 416.259 3.44444C418.669 1.14815 422.57 0 427.963 0H454.642ZM430.029 55.4556H437.43V15.5L427.066 15.6076L430.029 21.7925V55.4556Z"
                    fill="#1C1C1C"
                  />
                  <path
                    d="M510.101 53.2167C510.101 54.8241 509.814 56.1444 509.241 57.1778C508.667 58.0963 507.921 58.9 507.003 59.5889C506.085 60.2778 505.052 60.8518 503.905 61.3111C502.757 61.7704 501.667 62.287 500.635 62.8611C507.29 65.9611 510.503 71.0704 510.273 78.1889V155H493.578V70.6111H485.316V155H468.449V0H497.02C501.61 0 504.938 1.03333 507.003 3.1C509.183 5.05185 510.273 7.75 510.273 11.1944L510.101 53.2167ZM493.061 54.5944V15.5H483.005L485.66 20.9896V54.5944H493.061Z"
                    fill="#1C1C1C"
                  />
                  <path
                    d="M537.329 70.6111L541.124 75.8854V140.017H553V155H524.084V0H552.828V15.5H537.329L540.952 20.9896L541.296 55.2833H553V70.6111H537.329Z"
                    fill="#1C1C1C"
                  />
                </svg>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}
