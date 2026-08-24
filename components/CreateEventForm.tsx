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

  const inputClass =
    "w-full rounded-md border border-white/10 bg-[#182830] px-3 py-2.5 text-sm text-[#f7f2e8] outline-none focus:border-[#94eaff]";
  const labelClass = "flex flex-col gap-1.5 text-sm font-medium text-[#d9d4df]";

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

  return (
    <form onSubmit={handleSubmit} className="flex max-w-4xl flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-2">
        <label className={labelClass}>
          Title
          <input className={inputClass} value={form.title} onChange={(event) => updateField("title", event.target.value)} />
          {errors.title && <small className="text-red-300">{errors.title}</small>}
        </label>
        <label className={labelClass}>
          Image path or URL
          <input className={inputClass} value={form.image} onChange={(event) => updateField("image", event.target.value)} />
          {errors.image && <small className="text-red-300">{errors.image}</small>}
        </label>
        <label className={`${labelClass} md:col-span-2`}>
          Description
          <textarea className={inputClass} rows={4} value={form.description} onChange={(event) => updateField("description", event.target.value)} />
          {errors.description && <small className="text-red-300">{errors.description}</small>}
        </label>
        <label className={`${labelClass} md:col-span-2`}>
          Overview
          <textarea className={inputClass} rows={3} value={form.overview} onChange={(event) => updateField("overview", event.target.value)} />
          {errors.overview && <small className="text-red-300">{errors.overview}</small>}
        </label>
        <label className={labelClass}>
          Venue
          <input className={inputClass} value={form.venue} onChange={(event) => updateField("venue", event.target.value)} />
          {errors.venue && <small className="text-red-300">{errors.venue}</small>}
        </label>
        <label className={labelClass}>
          Location
          <input className={inputClass} value={form.location} onChange={(event) => updateField("location", event.target.value)} />
          {errors.location && <small className="text-red-300">{errors.location}</small>}
        </label>
        <label className={labelClass}>
          Date
          <input className={inputClass} type="date" value={form.date} onChange={(event) => updateField("date", event.target.value)} />
          {errors.date && <small className="text-red-300">{errors.date}</small>}
        </label>
        <label className={labelClass}>
          Time
          <input className={inputClass} type="time" value={form.time} onChange={(event) => updateField("time", event.target.value)} />
          {errors.time && <small className="text-red-300">{errors.time}</small>}
        </label>
        <label className={labelClass}>
          Mode
          <select className={inputClass} value={form.mode} onChange={(event) => updateField("mode", event.target.value as CreateEventInput["mode"])}>
            <option value="offline">Offline</option>
            <option value="online">Online</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </label>
        <label className={labelClass}>
          Audience
          <input className={inputClass} value={form.audience} onChange={(event) => updateField("audience", event.target.value)} />
          {errors.audience && <small className="text-red-300">{errors.audience}</small>}
        </label>
        <label className={labelClass}>
          Organizer
          <input className={inputClass} value={form.organizer} onChange={(event) => updateField("organizer", event.target.value)} />
          {errors.organizer && <small className="text-red-300">{errors.organizer}</small>}
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {(["agenda", "tags"] as const).map((field) => (
          <div className="flex flex-col gap-3" key={field}>
            <h3 className="text-base font-semibold text-[#f7f2e8]">{field === "agenda" ? "Agenda" : "Tags"}</h3>
            <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-[#0d161a] p-4">
              {form[field].map((item, index) => (
                <input
                  className={inputClass}
                  key={index}
                  value={item}
                  placeholder={`${field === "agenda" ? "Agenda item" : "Tag"} ${index + 1}`}
                  onChange={(event) => updateList(field, index, event.target.value)}
                />
              ))}
              <button
                className="w-fit cursor-pointer text-sm text-[#94eaff] transition hover:text-[#b9f0ff]"
                type="button"
                onClick={() => addListItem(field)}
              >
                + Add {field === "agenda" ? "agenda item" : "tag"}
              </button>
              {errors[field] && <small className="text-red-300">{errors[field]}</small>}
            </div>
          </div>
        ))}
      </div>

      {submitError && (
        <p className="text-sm text-red-300" role="alert">
          {submitError}
        </p>
      )}

      <button
        className="w-fit cursor-pointer rounded-md bg-[#94eaff] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#b9f0ff] disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating event..." : "Create event"}
      </button>
    </form>
  );
}
