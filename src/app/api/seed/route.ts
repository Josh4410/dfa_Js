import { NextResponse } from "next/server";
import { getClient } from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await getClient();
    const db = client.db("dairy-flat-air");
    const count = await db.collection("schedules").countDocuments();
    return NextResponse.json({ schedules: count });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}