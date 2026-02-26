import express from 'express';
import { db } from '../db';
import { rooms, stories, items } from '../db/schema';
import { eq, asc } from 'drizzle-orm';

const app = express();

app.use(express.json());

/**
 * GET /api/rooms
 */
app.get('/', async (req, res) => {

  try {

    const allRooms = await db
      .select()
      .from(rooms)
      .orderBy(asc(rooms.order_index));

    res.json({
      success: true,
      data: allRooms
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: 'Failed to fetch rooms'
    });

  }

});


/**
 * GET /api/rooms/:id
 */
app.get('/:id', async (req, res) => {

  try {

    const room = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, req.params.id)) // ✅ FIXED
      .limit(1);

    if (!room.length) {

      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });

    }

    res.json({
      success: true,
      data: room[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: 'Failed to fetch room'
    });

  }

});


/**
 * GET /api/rooms/:id/story
 */
app.get('/:id/story', async (req, res) => {

  try {

    const roomStories = await db
      .select()
      .from(stories)
      .where(eq(stories.room_id, req.params.id)) // ✅ FIXED
      .orderBy(asc(stories.sequence_order));

    res.json({
      success: true,
      data: roomStories
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: 'Failed to fetch stories'
    });

  }

});


/**
 * GET /api/rooms/:id/items
 */
app.get('/:id/items', async (req, res) => {

  try {

    const roomItems = await db
      .select()
      .from(items)
      .where(eq(items.room_id, req.params.id)); // ✅ FIXED

    res.json({
      success: true,
      data: roomItems
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: 'Failed to fetch items'
    });

  }

});


export default app;