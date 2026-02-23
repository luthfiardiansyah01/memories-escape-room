import { Router } from 'express';
import { db } from '../../db';
import { user_progress, rewards } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// GET /api/progress/:session
router.get('/:session', async (req, res) => {
  try {
    const progress = await db
      .select()
      .from(user_progress)
      .where(eq(user_progress.session_id, req.params.session))
      .get();

    if (!progress) {
      // Create new session if not exists
      const newId = uuidv4();
      await db.insert(user_progress).values({
        id: newId,
        session_id: req.params.session,
        current_room: null,
        items_found: '[]',
        completed_rooms: '[]',
      });
      const newProgress = await db.select().from(user_progress).where(eq(user_progress.id, newId)).get();
      return res.json({ success: true, data: newProgress });
    }

    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch progress' });
  }
});

// POST /api/progress/save
router.post('/save', async (req, res) => {
  const { session_id, current_room, items_found, completed_rooms } = req.body;

  if (!session_id) {
    return res.status(400).json({ success: false, error: 'Session ID required' });
  }

  try {
    const existing = await db.select().from(user_progress).where(eq(user_progress.session_id, session_id)).get();

    if (existing) {
      await db
        .update(user_progress)
        .set({
          current_room,
          items_found: JSON.stringify(items_found),
          completed_rooms: JSON.stringify(completed_rooms),
          updated_at: new Date().toISOString(),
        })
        .where(eq(user_progress.id, existing.id));
    } else {
      await db.insert(user_progress).values({
        id: uuidv4(),
        session_id,
        current_room,
        items_found: JSON.stringify(items_found),
        completed_rooms: JSON.stringify(completed_rooms),
      });
    }

    res.json({ success: true, message: 'Progress saved' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to save progress' });
  }
});

// POST /api/reward/generate
router.post('/reward/generate', async (req, res) => {
  const { session_id } = req.body;
  if (!session_id) {
    return res.status(400).json({ success: false, error: 'Session ID required' });
  }

  try {
    // Check if reward already exists
    const existing = await db.select().from(rewards).where(eq(rewards.session_id, session_id)).get();
    if (existing) {
      return res.json({ success: true, data: existing });
    }

    const code = 'LOVE-' + uuidv4().substring(0, 8).toUpperCase();
    const id = uuidv4();

    await db.insert(rewards).values({
      id,
      session_id,
      reward_code: code,
    });

    const newReward = await db.select().from(rewards).where(eq(rewards.id, id)).get();
    res.json({ success: true, data: newReward });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate reward' });
  }
});

// GET /api/reward/:session
router.get('/reward/:session', async (req, res) => {
  try {
    const reward = await db.select().from(rewards).where(eq(rewards.session_id, req.params.session)).get();
    if (!reward) {
      return res.status(404).json({ success: false, error: 'Reward not found' });
    }
    res.json({ success: true, data: reward });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch reward' });
  }
});

export default router;
