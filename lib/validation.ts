import { z } from "zod";

export const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid record ID");
const text = z.string().trim();
export const safeUrl = z.string().url().refine((value) => new URL(value).protocol === "https:", "Use an HTTPS URL");
export const jobPatch = z.object({
  title: text.min(1).max(200).optional(), description: text.max(30000).nullable().optional(),
  short_description: text.max(3000).nullable().optional(), tags: z.array(text.min(1).max(100)).max(30).optional(),
  shiftTiming: text.max(100).nullable().optional(), hourlyRate: text.max(100).nullable().optional(),
  yearsOfExperience: text.max(100).nullable().optional(), workMode: text.max(100).nullable().optional(),
  categoryId: objectId.nullable().optional(), companyId: objectId.nullable().optional(),
  imageUrl: safeUrl.nullable().optional(),
}).strict().refine((value) => Object.keys(value).length > 0, "No changes provided");
export const companyPatch = z.object({
  name: text.min(1).max(200).optional(), description: text.max(30000).nullable().optional(),
  overview: text.max(30000).nullable().optional(), whyJoinUs: text.max(30000).nullable().optional(),
  mail: z.union([z.string().email(), z.literal("")]).nullable().optional(),
  website: z.union([safeUrl, z.literal("")]).nullable().optional(),
  linkedIn: z.union([safeUrl, z.literal("")]).nullable().optional(),
  address_line_1: text.max(300).nullable().optional(), address_line_2: text.max(300).nullable().optional(),
  city: text.max(100).nullable().optional(), state: text.max(100).nullable().optional(), zipcode: text.max(30).nullable().optional(),
}).strict().refine((value) => Object.keys(value).length > 0, "No changes provided");
export const profilePatch = z.object({
  fullName: text.min(1).max(200).optional(), email: z.string().email().optional(),
  contact: text.max(100).optional(), activeResumeId: objectId.nullable().optional(),
}).strict().refine((value) => Object.keys(value).length > 0, "No changes provided");
export const resumeCreate = z.object({ name: text.min(1).max(200), url: safeUrl, userProfileId: z.string().min(1) }).strict();
export const applicationCreate = z.object({ jobId: objectId, resumeId: objectId, contactEmail: z.string().email() }).strict();
