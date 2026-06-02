import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { project, shippedProject } from "./project";
import { account } from "./user";

// notes
//
export const reviewerUserNote = pgTable("reviewer_user_note", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey().notNull(),
  reviewerId: integer("reviewer_id")
    .notNull()
    .references(() => account.id),
  userId: integer("user_id")
    .notNull()
    .references(() => account.id),
  note: text("note").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}).enableRLS();

export const reviewerProjectNote = pgTable("reviewer_project_note", {
  id: integer("id")
    .primaryKey()
    .references(() => project.id),
  reviewerId: integer("reviewer_id")
    .notNull()
    .references(() => account.id),
  projectId: integer("project_id")
    .notNull()
    .references(() => project.id),
  note: text("note").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}).enableRLS();

// project
//
export const reviewStatusEnum = pgEnum("review_status", [
  "pending",
  "on-review",
  "on-review-drafted",
  "silently-rejected",
  "changes-needed",
  "approved",
]);
export const projectReview = pgTable("reviewer_project", {
  id: integer("id")
    .primaryKey()
    .references(() => shippedProject.id),
  projectId: integer("project_id")
    .notNull()
    .references(() => project.id),
  reviewerId: integer("reviewer.id").references(() => account.id),
  reviewedAt: timestamp("reviewed_at"),
  drafted: boolean("drafted").notNull().default(false),
  draftedAt: timestamp("drafted_at"),
  status: reviewStatusEnum("status").notNull().default("pending"),
  fraudPassed: boolean("fraud_passed"),
  fraudScore: integer("fraud_score").notNull().default(-1),
}).enableRLS();

export const projectApprovedReview = pgTable("reviewer_approved_project", {
  id: integer("id")
    .primaryKey()
    .references(() => projectReview.id),
  projectId: integer("project_id")
    .notNull()
    .references(() => project.id),
  reviewerId: integer("reviewer.id")
    .notNull()
    .references(() => account.id),
  shipJustification: text("ship_justification").notNull(),
  comment: text("comment"),
}).enableRLS();

export const projectNeedChangesReview = pgTable(
  "reviewer_need_changes_project",
  {
    id: integer("id")
      .primaryKey()
      .references(() => projectReview.id),
    projectId: integer("project_id")
      .notNull()
      .references(() => project.id),
    reviewerId: integer("reviewer.id")
      .notNull()
      .references(() => account.id),
    comment: text("comment").notNull(),
    permanentRejection: boolean("permanent_rejection").notNull().default(false),
  },
).enableRLS();
