import { getMemberById, Member } from "@/lib/data";
import { getSessionMemberId } from "@/lib/session";

export async function requireAdminMember(): Promise<Member | null> {
  const id = getSessionMemberId();
  const member = await getMemberById(id);
  if (!member || member.role !== "ADMIN") return null;
  return member;
}
