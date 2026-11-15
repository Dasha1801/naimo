import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const jobs = sqliteTable('jobs', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  company: text('company').notNull(),
  salary: text('salary'),
  url: text('url').notNull(),
  source: text('source').notNull(),
  publishedAt: integer('published_at', { mode: 'timestamp' }).notNull(),
  isRemote: integer('is_remote', { mode: 'boolean' }).notNull().default(false),
  
  // AI-данные
  aiScore: integer('ai_score'), // 0-100
  aiSummary: text('ai_summary'), // Краткий вывод AI
  
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});