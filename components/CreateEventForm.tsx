"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { CreateEventInput } from "@/lib/validations/event";
import { createEventSchema } from "@/lib/validations/event";

const initialForm: CreateEventInput = {
  title: "",
  description: "",
  overview: "",
  image: "/images/event1.png",
  venue: "",
  location: "",
  date: "",
  time: "",
  mode: "offline",
  audience: "",
  agenda: [""],
  organizer: "",
  tags: [""],
};

type FieldErrors = Partial<Record<keyof CreateEventInput, string>>;

export default function CreateEventForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = <Field extends keyof CreateEventInput>(field: Field, value: CreateEventInput[Field]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const updateList = (field: "agenda" | "tags", index: number, value: string) => {
    const values = [...form[field]];
    values[index] = value;
    updateField(field, values);
  };

  const addListItem = (field: "agenda" | "tags") => updateField(field, [...form[field], ""]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    const parsed = createEventSchema.safeParse(form);
    if (!parsed.success) {
      const nextErrors: FieldErrors = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof CreateEventInput | undefined;
        if (field && !nextErrors[field]) nextErrors[field] = issue.message;
      });
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result: { event?: { slug: string }; error?: string } = await response.json();
      if (!response.ok || !result.event) {
        setSubmitError(result.error ?? "Unable to create event");
        return;
      }
      router.push(`/events/${result.event.slug}`);
    } catch {
      setSubmitError("Unable to reach the events service");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full rounded-[6px] border border-white/10 bg-dark-200 px-4 py-3 text-light-100 outline-none focus:border-blue";

  return (
    <form onSubmit={handleSubmit} className="create-event-form">
      <div className="form-grid">
        <label>Title<input className={inputClass} value={form.title} onChange={(event) => updateField("title", event.target.value)} />{errors.title && <small>{errors.title}</small>}</label>
        <label>Image path or URL<input className={inputClass} value={form.image} onChange={(event) => updateField("image", event.target.value)} />{errors.image && <small>{errors.image}</small>}</label>
        <label>Description<textarea className={inputClass} rows={4} value={form.description} onChange={(event) => updateField("description", event.target.value)} />{errors.description && <small>{errors.description}</small>}</label>
        <label>Overview<textarea className={inputClass} rows={4} value={form.overview} onChange={(event) => updateField("overview", event.target.value)} />{errors.overview && <small>{errors.overview}</small>}</label>
        <label>Venue<input className={inputClass} value={form.venue} onChange={(event) => updateField("venue", event.target.value)} />{errors.venue && <small>{errors.venue}</small>}</label>
        <label>Location<input className={inputClass} value={form.location} onChange={(event) => updateField("location", event.target.value)} />{errors.location && <small>{errors.location}</small>}</label>
        <label>Date<input className={inputClass} type="date" value={form.date} onChange={(event) => updateField("date", event.target.value)} />{errors.date && <small>{errors.date}</small>}</label>
        <label>Time<input className={inputClass} type="time" value={form.time} onChange={(event) => updateField("time", event.target.value)} />{errors.time && <small>{errors.time}</small>}</label>
        <label>Mode<select className={inputClass} value={form.mode} onChange={(event) => updateField("mode", event.target.value as CreateEventInput["mode"])}><option value="offline">Offline</option><option value="online">Online</option><option value="hybrid">Hybrid</option></select></label>
        <label>Audience<input className={inputClass} value={form.audience} onChange={(event) => updateField("audience", event.target.value)} />{errors.audience && <small>{errors.audience}</small>}</label>
        <label>Organizer<input className={inputClass} value={form.organizer} onChange={(event) => updateField("organizer", event.target.value)} />{errors.organizer && <small>{errors.organizer}</small>}</label>
      </div>
      <div className="form-list">
        <fieldset><legend>Agenda</legend>{form.agenda.map((item, index) => <input className={inputClass} key={index} value={item} placeholder={`Agenda item ${index + 1}`} onChange={(event) => updateList("agenda", index, event.target.value)} />)}<button type="button" onClick={() => addListItem("agenda")}>+ Add agenda item</button>{errors.agenda && <small>{errors.agenda}</small>}</fieldset>
        <fieldset><legend>Tags</legend>{form.tags.map((item, index) => <input className={inputClass} key={index} value={item} placeholder={`Tag ${index + 1}`} onChange={(event) => updateList("tags", index, event.target.value)} />)}<button type="button" onClick={() => addListItem("tags")}>+ Add tag</button>{errors.tags && <small>{errors.tags}</small>}</fieldset>
      </div>
      {submitError && <p className="form-error" role="alert">{submitError}</p>}
      <button className="submit-event" type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating event..." : "Create event"}</button>
    </form>
  );
}