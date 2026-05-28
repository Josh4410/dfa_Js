import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

function generateRef() {
  return "DF-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function POST(req: NextRequest) {
  try {
    const { scheduleId, firstName, lastName, email } = await req.json();

    if (!scheduleId || !firstName || !lastName || !email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const client = await getClient();
    const db = client.db("dairy-flat-air");

    const flight = await db.collection("schedules").findOne({
      _id: new ObjectId(scheduleId),
    });

    if (!flight) {
      return NextResponse.json({ error: "Flight not found" }, { status: 404 });
    }

    if (flight.bookings.length >= flight.capacity) {
      return NextResponse.json({ error: "Flight is full" }, { status: 400 });
    }

    const bookingRef = generateRef();
    const booking = {
      bookingRef,
      passenger: { firstName, lastName, email },
      bookedAt: new Date(),
    };

await db.collection("schedules").updateOne(
  { _id: new ObjectId(scheduleId) },
  [{ $set: { bookings: { $concatArrays: ["$bookings", [booking]] } } }]
);

    return NextResponse.json({ bookingRef, scheduleId });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}