import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import CreateEventForm from "@/components/CreateEventForm";

export default function CreateEventPage() {
  return (
    <main className="relative z-10 min-h-screen bg-[#030708]/80">
      <div className="container mx-auto px-5 py-8 sm:px-10">
        <Link href="/" className="mb-10 flex w-fit items-center gap-2 text-sm text-light-200 transition hover:text-blue"><ArrowLeft size={18} aria-hidden="true" />Back to events</Link>
        <div className="mb-10 max-w-2xl"><p className="mb-3 font-martian-mono text-xs uppercase tracking-[0.18em] text-blue">Event studio</p><h1>Create an event</h1><p className="mt-4 text-light-200">Add the details your community needs to find and join your event.</p></div>
        <CreateEventForm />
      </div>
    </main>
  );
}