"use client";

import { useContext } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { userContext } from "../context";

export default function UserAuditLogPage() {
  const { user } = useContext(userContext);

  if (!user) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No user data available
      </div>
    );
  }

  const getActionVariant = (action: string) => {
    switch (action) {
      case "user-modify":
        return "default";
      case "project-draft":
        return "secondary";
      case "project-ship":
        return "success" as any; // fallback/custom handles safely
      case "project-delete":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Audit Log ({user.logs?.length ?? 0})</CardTitle>
          <CardDescription>
            History of activity and actions performed by this user account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!user.logs || user.logs.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No log entries found for this user.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead className="w-[150px]">Action</TableHead>
                  <TableHead>Metadata</TableHead>
                  <TableHead className="w-[180px] text-end">
                    Timestamp
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-muted-foreground text-xs">
                      {log.id}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getActionVariant(log.action)}
                        className="font-medium capitalize"
                      >
                        {log.action.replace("-", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {log.data && Object.keys(log.data).length > 0 ? (
                        <div
                          className="max-w-[400px] select-all overflow-hidden truncate rounded border border-border/40 bg-muted/60 px-2 py-1 font-mono text-xs xl:max-w-[600px]"
                          title={JSON.stringify(log.data)}
                        >
                          {JSON.stringify(log.data)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">
                          No metadata
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-end text-muted-foreground text-xs tabular-nums">
                      {new Date(log.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
