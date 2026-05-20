// import { integer, pgTable, text } from "drizzle-orm/pg-core";
// import { user } from "./auth";
// import { project as originalProject } from "./project";
//
// export const personalInfo = pgTable("hc_personal_info", {
//   id: text("id")
//     .primaryKey()
//     .references(() => user.id),
//   email: text("email")
//     .notNull()
//     .unique()
//     .references(() => user.email),
//   e_firstName: text("encrypted_first_name")
//     .notNull()
//     .references(() => user.encrypted_name),
//   e_addressOne: text("encrypted_address_one").notNull(),
//   e_addressTwo: text("encrypted_address_two"),
//   e_city: text("encrypted_city").notNull(),
//   e_state: text("encrypted_state").notNull(),
//   e_country: text("encrypted_country").notNull(),
//   e_zipCode: text("encrypted_zip_code").notNull(),
//   e_birthdate: text("encrypted_birthdate").notNull(),
// });
//
// export const project = pgTable("hc_project", {
//   id: integer("id").generatedAlwaysAsIdentity().primaryKey().notNull(),
//   projectId: integer("project_id")
//     .notNull()
//     .references(() => originalProject.id),
//   userId: text("user_id")
//     .notNull()
//     .references(() => personalInfo.id),
//   name: text("project_name").notNull(),
//   description: text("project_description").notNull(),
//   codeUrl: text("project_code_url").notNull(),
//   playableUrl: text("project_playable_url").notNull(),
// });
//
// // this is what i know
//
