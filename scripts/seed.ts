import { db } from '../db';
import { rooms, stories, items } from '../db/schema';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  console.log('Seeding database...');

  // Clear existing data
  await db.delete(items);
  await db.delete(stories);
  await db.delete(rooms);

  // Room 1: First Meeting
  const room1Id = uuidv4();
  await db.insert(rooms).values({
    id: room1Id,
    title: 'First Meeting',
    description: 'A cozy cafe where it all began.',
    order_index: 1,
    background_image: '/images/room1_cafe.jpg', // Placeholder
  });

  await db.insert(stories).values([
    { id: uuidv4(), room_id: room1Id, narrative_text: 'It was a rainy afternoon when you first saw them.', sequence_order: 1 },
    { id: uuidv4(), room_id: room1Id, narrative_text: 'The smell of roasted coffee filled the air.', sequence_order: 2 },
  ]);

  await db.insert(items).values([
    { id: uuidv4(), room_id: room1Id, item_name: 'Coffee Receipt', description: 'A receipt with a phone number scribbled on it.', is_required: true, pos_x: 100, pos_y: 200, image: 'receipt' },
    { id: uuidv4(), room_id: room1Id, item_name: 'Napkin', description: 'Just a plain napkin.', is_required: false, pos_x: 300, pos_y: 400, image: 'napkin' },
  ]);

  // Room 2: Growing Together
  const room2Id = uuidv4();
  await db.insert(rooms).values({
    id: room2Id,
    title: 'Growing Together',
    description: 'A park bench under the autumn leaves.',
    order_index: 2,
    background_image: '/images/room2_park.jpg',
  });

  await db.insert(stories).values([
    { id: uuidv4(), room_id: room2Id, narrative_text: 'Seasons changed, and so did you both.', sequence_order: 1 },
    { id: uuidv4(), room_id: room2Id, narrative_text: 'Walking through the park became a weekly tradition.', sequence_order: 2 },
  ]);

  await db.insert(items).values([
    { id: uuidv4(), room_id: room2Id, item_name: 'Handwritten Letter', description: 'A letter full of dreams and promises.', is_required: true, pos_x: 500, pos_y: 300, image: 'letter' },
    { id: uuidv4(), room_id: room2Id, item_name: 'Pinecone', description: 'A souvenir from a walk.', is_required: false, pos_x: 200, pos_y: 500, image: 'pinecone' },
  ]);

  // Room 3: Hard Times
  const room3Id = uuidv4();
  await db.insert(rooms).values({
    id: room3Id,
    title: 'Hard Times',
    description: 'A dim room, shadows flickering.',
    order_index: 3,
    background_image: '/images/room3_dim.jpg',
  });

  await db.insert(stories).values([
    { id: uuidv4(), room_id: room3Id, narrative_text: 'Not every day was sunny.', sequence_order: 1 },
    { id: uuidv4(), room_id: room3Id, narrative_text: 'Silence sometimes spoke louder than words.', sequence_order: 2 },
  ]);

  await db.insert(items).values([
    { id: uuidv4(), room_id: room3Id, item_name: 'Old Note', description: 'An apology note, tear-stained.', is_required: true, pos_x: 400, pos_y: 300, image: 'note' },
  ]);

  // Room 4: Proposal Moment
  const room4Id = uuidv4();
  await db.insert(rooms).values({
    id: room4Id,
    title: 'Proposal Moment',
    description: 'A breathtaking sunset viewpoint.',
    order_index: 4,
    background_image: '/images/room4_sunset.jpg',
  });

  await db.insert(stories).values([
    { id: uuidv4(), room_id: room4Id, narrative_text: 'The world seemed to stop at that moment.', sequence_order: 1 },
    { id: uuidv4(), room_id: room4Id, narrative_text: 'A question was asked, and a future began.', sequence_order: 2 },
  ]);

  await db.insert(items).values([
    { id: uuidv4(), room_id: room4Id, item_name: 'Ring Box', description: 'Velvet box containing a promise.', is_required: true, pos_x: 600, pos_y: 400, image: 'ringbox' },
  ]);

  // Final Room: Wedding Countdown
  const roomFinalId = uuidv4();
  await db.insert(rooms).values({
    id: roomFinalId,
    title: 'Wedding Countdown',
    description: 'A warm, glowing hall ready for celebration.',
    order_index: 5,
    background_image: '/images/room5_wedding.jpg',
  });

  await db.insert(stories).values([
    { id: uuidv4(), room_id: roomFinalId, narrative_text: 'The journey brings us here.', sequence_order: 1 },
    { id: uuidv4(), room_id: roomFinalId, narrative_text: 'Thank you for being part of our story.', sequence_order: 2 },
  ]);

  console.log('Seeding complete!');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
