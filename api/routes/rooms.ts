import { Router } from 'express';
import { db } from '../../db';
import { rooms, stories, items } from '../../db/schema';
import { eq, asc } from 'drizzle-orm';

const router = Router();

// GET /api/rooms
router.get('/', async (req, res) => {
  try {
    const allRooms = await db.select().from(rooms).orderBy(asc(rooms.order_index));
    res.json({ success: true, data: allRooms });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch rooms' });
  }
});

// GET /api/rooms/:id
router.get('/:id', async (req, res) => {
  try {
    const room = await db.select().from(rooms).where(eq(rooms.id, req.params.id)).get();
    if (!room) {
      return res.status(404).json({ success: false, error: 'Room not found' });
    }
    res.json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch room' });
  }
});

// GET /api/rooms/:id/story
router.get('/:id/story', async (req, res) => {
  try {
    const roomStories = await db
      .select()
      .from(stories)
      .where(eq(stories.room_id, req.params.id))
      .orderBy(asc(stories.sequence_order));
    res.json({ success: true, data: roomStories });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch stories' });
  }
});

// GET /api/rooms/:id/items
router.get('/:id/items', async (req, res) => {
  try {
    const roomItems = await db.select().from(items).where(eq(items.room_id, req.params.id));
    res.json({ success: true, data: roomItems });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch items' });
  }
});

export default router;
