import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  overview: z.string().trim().min(1, "Overview is required"),
  image: z.string().trim().min(1, "Image path or URL is required"),
  venue: z.string().trim().min(1, "Venue is required"),
  location: z.string().trim().min(1, "Location is required"),
  date: z.string().trim().min(1, "Date is required"),
  time: z.string().trim().min(1, "Time is required"),
  mode: z.enum(["online", "offline", "hybrid"]),
  audience: z.string().trim().min(1, "Audience is required"),
  agenda: z.array(z.string().trim().min(1, "Agenda items cannot be empty")).min(1, "Add at least one agenda item"),
  organizer: z.string().trim().min(1, "Organizer is required"),
  tags: z.array(z.string().trim().min(1, "Tags cannot be empty")).min(1, "Add at least one tag"),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
