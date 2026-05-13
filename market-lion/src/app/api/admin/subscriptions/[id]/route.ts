import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

function isAdminRequest(req: NextRequest): boolean {
  const session = req.cookies.get("ml_admin_session")?.value;
  return !!session && session.length === 64;
}

const PatchSchema = z.object({
  status: z.enum(["ACTIVE", "PAUSED", "CANCELLED", "EXPIRED"]),
  endsAt: z.string().datetime().optional(),
});

// PATCH /api/admin/subscriptions/[id] — pause / activate / cancel a subscription
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { status, endsAt } = parsed.data;

  const sub = await prisma.subscription.findUnique({ where: { id: params.id } });
  if (!sub) {
    return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
  }

  const updated = await prisma.subscription.update({
    where: { id: params.id },
    data: {
      status: status as any,
      ...(endsAt ? { endsAt: new Date(endsAt) } : {}),
    },
  });

  return NextResponse.json({ subscription: updated });
}

// GET /api/admin/subscriptions/[id] — get single subscription
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sub = await prisma.subscription.findUnique({
    where: { id: params.id },
    include: { user: { select: { email: true, name: true } } },
  });

  if (!sub) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ subscription: sub });
}
