import { connectToDatabase, Event } from "@/database";
import { createEventSchema } from "@/lib/validations/event";

export const runtime = "nodejs";

const isDuplicateKeyError = (error: unknown): boolean =>
	typeof error === "object" && error !== null && "code" in error && error.code === 11000;

export async function GET() {
	try {
		await connectToDatabase();
		const events = await Event.find().sort({ date: 1 }).lean();

		return Response.json({ events });
	} catch (error: unknown) {
		console.error("Failed to fetch events", error);
		return Response.json({ error: "Unable to fetch events" }, { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		const body: unknown = await request.json();
		const parsedEvent = createEventSchema.safeParse(body);
		if (!parsedEvent.success) {
			return Response.json({ error: "Invalid event data", issues: parsedEvent.error.issues }, { status: 400 });
		}

		await connectToDatabase();
		const event = await Event.create(parsedEvent.data);

		return Response.json({ event }, { status: 201 });
	} catch (error: unknown) {
		if (isDuplicateKeyError(error)) {
			return Response.json({ error: "An event with this title already exists" }, { status: 409 });
		}

		if (error instanceof Error && error.name === "ValidationError") {
			return Response.json({ error: error.message }, { status: 400 });
		}

		console.error("Failed to create event", error);
		return Response.json({ error: "Unable to create event" }, { status: 500 });
	}
}
