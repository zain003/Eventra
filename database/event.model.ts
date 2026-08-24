import mongoose, { Document, Schema } from "mongoose";

export interface EventDocument extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const nonEmptyString = (field: string) => ({
  validator: (value: string): boolean => value.trim().length > 0,
  message: `${field} cannot be empty`,
});

const nonEmptyStringArray = (field: string) => ({
  validator: (value: string[]): boolean =>
    value.length > 0 && value.every((item) => item.trim().length > 0),
  message: `${field} must contain at least one non-empty value`,
});

const slugify = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeDate = (value: string): string => {
  const parsedDate = new Date(value.trim());
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("date must be a valid date");
  }

  // Persist one unambiguous ISO representation for every event.
  return parsedDate.toISOString();
};

const normalizeTime = (value: string): string => {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?$/i);
  if (!match) {
    throw new Error("time must use HH:mm or h:mm AM/PM format");
  }

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();

  if (minute > 59 || (meridiem && (hour < 1 || hour > 12)) || (!meridiem && hour > 23)) {
    throw new Error("time contains an invalid hour or minute");
  }

  if (meridiem) {
    hour = hour % 12 + (meridiem === "PM" ? 12 : 0);
  }

  // Store times consistently as zero-padded 24-hour values.
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

const eventSchema = new Schema<EventDocument>(
  {
    title: { type: String, required: true, validate: nonEmptyString("title") },
    slug: { type: String, required: true, trim: true },
    description: { type: String, required: true, validate: nonEmptyString("description") },
    overview: { type: String, required: true, validate: nonEmptyString("overview") },
    image: { type: String, required: true, validate: nonEmptyString("image") },
    venue: { type: String, required: true, validate: nonEmptyString("venue") },
    location: { type: String, required: true, validate: nonEmptyString("location") },
    date: { type: String, required: true, validate: nonEmptyString("date") },
    time: { type: String, required: true, validate: nonEmptyString("time") },
    mode: { type: String, required: true, validate: nonEmptyString("mode") },
    audience: { type: String, required: true, validate: nonEmptyString("audience") },
    agenda: { type: [String], required: true, validate: nonEmptyStringArray("agenda") },
    organizer: { type: String, required: true, validate: nonEmptyString("organizer") },
    tags: { type: [String], required: true, validate: nonEmptyStringArray("tags") },
  },
  { timestamps: true },
);

eventSchema.index({ slug: 1 }, { unique: true });

eventSchema.pre("validate", function () {
  // Populate the required slug before Mongoose runs required-field validation.
  if (this.isNew || this.isModified("title")) {
    const slug = slugify(this.title);
    if (!slug) {
      this.invalidate("slug", "title must contain letters or numbers to create a slug");
      return;
    }
    this.slug = slug;
  }
});

eventSchema.pre("save", async function () {
  const requiredFields: Array<keyof EventDocument> = [
    "title",
    "description",
    "overview",
    "image",
    "venue",
    "location",
    "date",
    "time",
    "mode",
    "audience",
    "agenda",
    "organizer",
    "tags",
  ];

  for (const field of requiredFields) {
    const value = this[field];
    if (typeof value === "string" && value.trim().length === 0) {
      throw new Error(`${field} cannot be empty`);
    }
    if (Array.isArray(value) && (value.length === 0 || value.some((item) => item.trim().length === 0))) {
      throw new Error(`${field} must contain at least one non-empty value`);
    }
  }

  // Generate a new slug only for new documents or title changes.
  if (this.isNew || this.isModified("title")) {
    const slug = slugify(this.title);
    if (!slug) {
      throw new Error("title must contain letters or numbers to create a slug");
    }
    this.slug = slug;
  }

  this.date = normalizeDate(this.date);
  this.time = normalizeTime(this.time);
});

export const Event =
  (mongoose.models.Event as mongoose.Model<EventDocument> | undefined) ??
  mongoose.model<EventDocument>("Event", eventSchema);
