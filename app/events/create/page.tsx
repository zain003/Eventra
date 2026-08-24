import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import CreateEventForm from "@/components/CreateEventForm";

export default function CreateEventPage() {
  return (
    <main className="relative z-10 min-h-screen bg-[#08070d] px-5 pb-12 pt-[calc(var(--page-top)+1rem)] text-[#f7f2e8] sm:px-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-8 flex w-fit items-center gap-2 text-sm text-[#bdb5c4] transition hover:text-[#94eaff]"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to events
        </Link>
        <div className="mb-8 max-w-2xl">
          <p className="mb-2 font-[var(--font-martian-mono)] text-xs uppercase tracking-[0.18em] text-[#94eaff]">
            Event studio
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Create an event</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#bdb5c4] sm:text-base">
            Add the details your community needs to find and join your event.
          </p>
        </div>
        <CreateEventForm />
      </div>
    </main>
  );
}
