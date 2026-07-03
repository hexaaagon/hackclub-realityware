"use client";

import { ChatCircleDotsIcon } from "@phosphor-icons/react";
import Image from "next/image";
import RealitywareLogo from "#/images/realityware.svg";
import { Stagger, StaggerItem, Tilt } from "@/components/motion";

// Placeholder destinations — swap for the real Slack invite / sticker form.
const SLACK_URL = "https://hackclub.slack.com";
const STICKER_URL = "https://forms.hackclub.com";

export function HomeCards() {
  return (
    <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <StaggerItem className="h-full">
        <Tilt asChild lift={3}>
          <a
            href={STICKER_URL}
            target="_blank"
            rel="noreferrer"
            className="flex h-full items-center gap-3 border-2 border-black/20 bg-card p-4"
          >
            <span className="grid size-16 shrink-0 place-items-center border-2 border-black/20 bg-green/10">
              <Image src={RealitywareLogo} alt="" className="h-9 w-auto" />
            </span>
            <div className="min-w-0">
              <h3 className="font-medium text-base">
                Get your <u>very own</u> stickers for free!
              </h3>
              <p className="text-black/55 text-xs">
                Present your hardware project for the first time, gets a sticker
                with your project signed!
              </p>
            </div>
          </a>
        </Tilt>
      </StaggerItem>

      <StaggerItem className="h-full">
        <Tilt asChild lift={3}>
          <a
            href={SLACK_URL}
            target="_blank"
            rel="noreferrer"
            className="flex h-full items-center gap-3 border-2 border-black/20 bg-card p-4"
          >
            <span className="noise grid size-16 shrink-0 place-items-center border-2 border-black/20 bg-orange/10 text-orange">
              <ChatCircleDotsIcon weight="fill" className="size-8" />
            </span>
            <div className="min-w-0">
              <h3 className="font-medium text-base">Join our Slack Channel!</h3>
              <p className="text-black/55 text-xs">
                Wanna ask question? talking and yapping around? join{" "}
                <span className="text-dark-blue underline">#realityware</span>{" "}
                my bro 👊😎
              </p>
            </div>
          </a>
        </Tilt>
      </StaggerItem>
    </Stagger>
  );
}
