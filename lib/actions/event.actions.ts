"use server";

import { connectToDatabase, Event } from "@/database";

const SIMILAR_EVENTS_LIMIT = 3;

export type SimilarEvent = {
  slug: string;
  image: string;
  title: string;
  location: string;
  date: string;
  time: string;
};

export async function getSimilarEvents(
  currentSlug: string,
  tags: readonly string[],
): Promise<SimilarEvent[]> {
  if (tags.length === 0) {
    return [];
  }

  await connectToDatabase();

  const events = await Event.find({
    slug: { $ne: currentSlug },
    tags: { $in: tags },
  })
    .select("slug image title location date time -_id")
    .sort({ date: 1 })
    .limit(SIMILAR_EVENTS_LIMIT)
    .lean<SimilarEvent[]>();

  return events;
}
