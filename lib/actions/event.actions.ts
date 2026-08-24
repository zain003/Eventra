"use server";

import { cacheLife, cacheTag, revalidateTag } from "next/cache";
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

export type EventListItem = SimilarEvent;

export async function getEvents(): Promise<EventListItem[]> {
  "use cache";

  cacheLife("hours");
  cacheTag("events");
  await connectToDatabase();

  return Event.find()
    .select("slug image title location date time -_id")
    .sort({ date: 1 })
    .lean<EventListItem[]>();
}

export async function getEventBySlug(slug: string) {
  "use cache";

  cacheLife("hours");
  cacheTag("events", `event:${slug}`);
  await connectToDatabase();

  return Event.findOne({ slug }).select("-_id").lean();
}

export async function getSimilarEvents(
  currentSlug: string,
  tags: readonly string[],
): Promise<SimilarEvent[]> {
  "use cache";

  if (tags.length === 0) {
    return [];
  }

  cacheLife("hours");
  cacheTag("events", `similar-events:${currentSlug}`);
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

export async function revalidateEventCaches(slug: string): Promise<void> {
  revalidateTag("events", "max");
  revalidateTag(`event:${slug}`, "max");
  revalidateTag(`similar-events:${slug}`, "max");
}
