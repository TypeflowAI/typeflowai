import z from "zod";

import { ZUuid } from "./user";

export const ZMembershipRole = z.enum(["owner", "admin", "editor", "developer", "viewer"]);

export type TMembershipRole = z.infer<typeof ZMembershipRole>;

export const ZMembership = z.object({
  teamId: z.string(),
  userId: ZUuid,
  accepted: z.boolean(),
  role: ZMembershipRole,
});

export type TMembership = z.infer<typeof ZMembership>;

export const ZMember = z.object({
  name: z.string().nullable(),
  email: z.string(),
  userId: ZUuid,
  accepted: z.boolean(),
  role: ZMembershipRole,
});

export type TMember = z.infer<typeof ZMember>;

export const ZMembershipUpdateInput = z.object({
  role: ZMembershipRole,
});
export type TMembershipUpdateInput = z.infer<typeof ZMembershipUpdateInput>;
