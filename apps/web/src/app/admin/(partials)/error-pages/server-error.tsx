"use client";
import {
  ArrowClockwiseIcon,
  ArrowUpRightIcon,
  WarningIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function ServerError({ reason }: { reason: string | object }) {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia className="size-16!" variant="icon">
            <WarningIcon className="text-red-600! size-12!" />
          </EmptyMedia>
          <EmptyTitle className="text-2xl font-semibold">
            There's an error in our side.
          </EmptyTitle>
          <EmptyDescription>Please contact @hexaa for this.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="text-left md:max-w-2/3">
          <pre className="font-mono bg-muted overflow-x-auto max-w-full text-xs p-2 rounded-md">
            {typeof reason === "string"
              ? reason
              : JSON.stringify(reason, null, 2)}
          </pre>
        </EmptyContent>
        <EmptyContent className="flex-row justify-center gap-2">
          <Button onClick={() => window.location.reload()}>
            <ArrowClockwiseIcon /> Refresh
          </Button>
          <Link
            href="https://hackclub.enterprise.slack.com/team/U082WTQLCVA"
            target="_blank"
            className={buttonVariants({ variant: "outline" })}
          >
            <ArrowUpRightIcon /> DM Hexaa
          </Link>
        </EmptyContent>
      </Empty>
    </div>
  );
}
