import { db } from ".";
import { logUser, type userActionEnum } from "./schema/audit-log";

export class Logger {
  constructor(public mode: "user" | "admin" | "system") {}

  log(
    action: (typeof userActionEnum.enumValues)[number],
    userId: "system" | `${"user-" | "admin-"}${number}`,
    ...args: string[]
  ) {
    db.insert(logUser).values({
      userId,
      action,
      data: {
        args,
      },
    });
  }
}
