import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orig = searchParams.get("orig");
    const dest = searchParams.get("dest");
    const date1 = searchParams.get("date1");
    const date2 = searchParams.get("date2");

    if (!orig || !dest || !date1 || !date2) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const client = await getClient();
    const db = client.db("dairy-flat-air");

    const flights = await db.collection("schedules").find({
      origin: orig,
      destination: dest,
      departureUtc: {
        $gte: new Date(date1),
        $lte: new Date(date2),
      },
    }).sort({ departureUtc: 1 }).toArray();

    // Return flights with seats remaining, not raw bookings array
    const result = flights.map((f) => ({
      _id: f._id,
      flightNumber: f.flightNumber,
      origin: f.origin,
      destination: f.destination,
      departureUtc: f.departureUtc,
      arrivalUtc: f.arrivalUtc,
      aircraft: f.aircraft,
      capacity: f.capacity,
      priceNZD: f.priceNZD,
      seatsRemaining: f.capacity - (f.bookings?.length ?? 0),
    }));

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}