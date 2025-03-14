import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Users table (minimal data needed for auth)
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  image: text("image"),
});

// Accounts table for OAuth providers
export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

// Notion credentials table
export const notionCredentials = sqliteTable("notion_credentials", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  integrationKey: text("integration_key").notNull(),
  workspaceId: text("workspace_id"),
  workspaceName: text("workspace_name"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
