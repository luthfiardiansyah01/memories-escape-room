import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const rooms = sqliteTable('rooms', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  order_index: integer('order_index').notNull(),
  background_image: text('background_image'),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const stories = sqliteTable('stories', {
  id: text('id').primaryKey(),
  room_id: text('room_id').references(() => rooms.id).notNull(),
  narrative_text: text('narrative_text').notNull(),
  sequence_order: integer('sequence_order').notNull(),
});

export const items = sqliteTable('items', {
  id: text('id').primaryKey(),
  room_id: text('room_id').references(() => rooms.id).notNull(),
  item_name: text('item_name').notNull(),
  description: text('description'),
  image: text('image'),
  is_required: integer('is_required', { mode: 'boolean' }).default(false),
  pos_x: integer('pos_x').default(0),
  pos_y: integer('pos_y').default(0),
});

export const user_progress = sqliteTable('user_progress', {
  id: text('id').primaryKey(),
  session_id: text('session_id').notNull(),
  current_room: text('current_room'),
  items_found: text('items_found').default('[]'), // JSON string
  completed_rooms: text('completed_rooms').default('[]'), // JSON string
  updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const rewards = sqliteTable('rewards', {
  id: text('id').primaryKey(),
  session_id: text('session_id').notNull(),
  reward_code: text('reward_code').notNull(),
  redeemed: integer('redeemed', { mode: 'boolean' }).default(false),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});
