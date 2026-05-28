import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const { email } = await params;
    const client = await getClient();
    const db = client.db("dairy-flat-air");

    const flights = await db.collection("schedules").find({
      "bookings.passenger.email": decodeURIComponent(email),
    }).toArray();

    const results = flights.flatMap((f) =>
      f.bookings
        .filter((b: { passenger: { email: string } }) =>
          b.passenger.email === decodeURIComponent(email)
        )
        .map((b: unknown) => ({
          flightNumber: f.flightNumber,
          origin: f.origin,
          destination: f.destination,
          departureUtc: f.departureUtc,
          arrivalUtc: f.arrivalUtc,
          aircraft: f.aircraft,
          priceNZD: f.priceNZD,
          booking: b,
        }))
    );

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}