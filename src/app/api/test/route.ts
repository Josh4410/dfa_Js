import { NextResponse } from "next/server";
import { getClient } from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await getClient();
    const db = client.db("dairy-flat-air");
    const collections = await db.listCollections().toArray();
    return NextResponse.json({ connected: true, collections });
  } catch (error) {
    return NextResponse.json({ connected: false, error: String(error) }, { status: 500 });
  }
}