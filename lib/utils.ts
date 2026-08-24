import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatEventDate(date: string, style: "short" | "long" = "short"): string {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return date

  return parsed.toLocaleDateString("en-US", {
    dateStyle: style === "long" ? "long" : "medium",
  })
}

export function formatEventTime(time: string): string {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/)
  if (!match) return time

  const hour = Number(match[1])
  const minute = match[2]
  const period = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 || 12

  return `${displayHour}:${minute} ${period}`
}
