import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ ref: string }> }
) {
  try {
    const { ref } = await params;
    const client = await getClient();
    const db = client.db("dairy-flat-air");

    const flight = await db.collection("schedules").findOne({
      "bookings.bookingRef": ref,
    });

    if (!flight) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const booking = flight.bookings.find(
      (b: { bookingRef: string }) => b.bookingRef === ref
    );

    return NextResponse.json({ flight, booking });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ ref: string }> }
) {
  try {
    const { ref } = await params;
    const client = await getClient();
    const db = client.db("dairy-flat-air");

    await db.collection("schedules").updateOne(
    { "bookings.bookingRef": ref },
    [{ $set: { bookings: { $filter: { input: "$bookings", cond: { $ne: ["$$this.bookingRef", ref] } } } } }]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}