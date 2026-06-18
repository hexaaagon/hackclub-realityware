import type { logUser } from "../schema/audit-log";
import type { project } from "../schema/project";
import type { account } from "../schema/user";

export type UserInfo = typeof account.$inferSelect & {
  project: (typeof project.$inferSelect)[];
  logs: (typeof logUser.$inferSelect)[];
};
