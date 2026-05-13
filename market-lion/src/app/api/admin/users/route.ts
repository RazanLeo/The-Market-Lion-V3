import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

const prisma = new PrismaClient();

function isAdminRequest(req: NextRequest): boolean {
  const session = req.cookies.get("ml_admin_session")?.value;
  return !!session && session.length === 64;
}

const CreateUserSchema = z.object({
  email:    z.string().email(),
  name:     z.string().min(1),
  password: z.string().min(6).optional(),
  phone:    z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().optional().default("ar"),
  capital:  z.number().optional().default(10000),
  broker:   z.string().optional().default("capital"),
  plan:     z.enum(["INDIVIDUAL_MONTHLY", "INSTITUTION_MONTHLY"]).optional(),
  endsAt:   z.string().datetime().optional(),
});

// GET /api/admin/users — list all users with subscription info
export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    include: { subscription: true, tradingAccount: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ users });
}

// POST /api/admin/users — add a new user (with optional subscription)
export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = CreateUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { email, name, password, phone, timezone, language, capital, broker, plan, endsAt } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;

  const user = await prisma.user.create({
    data: {
      email,
      name,
      phone,
      timezone,
      language,
      passwordHash,
      role: "USER",
      tradingAccount: {
        create: {
          broker,
          accountType: broker === "capital" ? "REST" : "WEB_BRIDGE",
          loginNumber: "",
          serverName:  "",
          passwordEnc: "",
          capital,
          leverage:    500,
          status:      "PENDING",
        },
      },
      ...(plan ? {
        subscription: {
          create: {
            plan: plan as any,
            status: "ACTIVE",
            startsAt: new Date(),
            endsAt:   endsAt ? new Date(endsAt) : new Date(Date.now() + 30 * 86400_000),
            amountSAR: plan === "INDIVIDUAL_MONTHLY" ? 299 : 999,
          },
        },
      } : {}),
    },
    include: { subscription: true, tradingAccount: true },
  });

  return NextResponse.json({ user }, { status: 201 });
}
