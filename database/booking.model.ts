import mongoose, { Document, Schema, Types } from "mongoose";
import { Event } from "./event.model";

export interface BookingDocument extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const bookingSchema = new Schema<BookingDocument>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string): boolean => emailPattern.test(value),
        message: "email must be properly formatted",
      },
    },
  },
  { timestamps: true },
);

// Index bookings by event for fast attendee lookups.
bookingSchema.index({ eventId: 1 });

bookingSchema.pre("save", async function () {
  // Confirm the reference before a booking can be persisted.
  const eventExists = await Event.exists({ _id: this.eventId });
  if (!eventExists) {
    throw new Error("eventId must reference an existing event");
  }
});

export const Booking =
  (mongoose.models.Booking as mongoose.Model<BookingDocument> | undefined) ??
  mongoose.model<BookingDocument>("Booking", bookingSchema);
