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
    <div className="flex h-full w-full items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia className="size-16!" variant="icon">
            <WarningIcon className="size-12! text-red-600!" />
          </EmptyMedia>
          <EmptyTitle className="font-semibold text-2xl">
            There's an error in our side.
          </EmptyTitle>
          <EmptyDescription>Please contact @hexaa for this.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="text-left md:max-w-2/3">
          <pre className="max-w-full overflow-x-auto rounded-md bg-muted p-2 font-mono text-xs">
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
