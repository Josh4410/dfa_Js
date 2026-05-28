import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await getClient();
    const db = client.db("dairy-flat-air");
    const flight = await db.collection("schedules").findOne({ _id: new ObjectId(id) });
    if (!flight) {
      return NextResponse.json({ error: "Flight not found" }, { status: 404 });
    }
    return NextResponse.json({
      ...flight,
      seatsRemaining: flight.capacity - (flight.bookings?.length ?? 0),
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}