import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const result = await prisma.$queryRawUnsafe<{ now: Date }[]>(
      "SELECT NOW() as now"
    );
    const now = result?.[0]?.now ?? null;
    return NextResponse.json({ ok: true, now });
  } catch (error: any) {
    const message = error?.message ?? "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
