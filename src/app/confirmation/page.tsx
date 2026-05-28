"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const AIRPORTS: Record<string, string> = {
  NZNE: "Dairy Flat",
  YSSY: "Sydney",
  NZRO: "Rotorua",
  NZGB: "Great Barrier Island",
  NZCI: "Chatham Islands",
  NZTL: "Lake Tekapo",
};

const TIMEZONES: Record<string, string> = {
  NZNE: "Pacific/Auckland",
  YSSY: "Australia/Sydney",
  NZRO: "Pacific/Auckland",
  NZGB: "Pacific/Auckland",
  NZCI: "Pacific/Chatham",
  NZTL: "Pacific/Auckland",
};

function formatLocal(utc: string, tz: string) {
  return new Date(utc).toLocaleString("en-NZ", {
    timeZone: tz,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface Booking {
  bookingRef: string;
  passenger: { firstName: string; lastName: string; email: string };
  bookedAt: string;
}

interface Flight {
  flightNumber: string;
  origin: string;
  destination: string;
  departureUtc: string;
  arrivalUtc: string;
  aircraft: string;
  priceNZD: number;
  bookings: Booking[];
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const [flight, setFlight] = useState<Flight | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.backgroundImage = "url('/confirmation.jpg')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.minHeight = "100vh";
    return () => {
      document.body.style.backgroundImage = "";
    };
  }, []);

  useEffect(() => {
    if (!ref) return;
    fetch(`/api/bookings/${ref}`)
      .then((r) => r.json())
      .then((data) => {
        setFlight(data.flight);
        setBooking(data.booking);
        setLoading(false);
      });
  }, [ref]);

  if (loading) {
    return (
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1rem" }}>
        <p>Loading...</p>
      </main>
    );
  }

  if (!flight || !booking) {
    return (
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1rem" }}>
        <p>Booking not found.</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1rem" }}>
      <div
        style={{
          background: "rgba(0,0,0,0.9)",
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 8, color: "#fff" }}>
          Booking confirmed
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 2, color: "#00FF00" }}>
          {booking.bookingRef}
        </div>
        <div style={{ fontSize: 14, color: "#fff", marginTop: 4 }}>
          Keep this reference number.
        </div>
      </div>

      <div
        style={{
          border: "1px solid #ffffff",
          borderRadius: 12,
          padding: 24,
          marginBottom: 16,
          background: "rgba(0,0,0,0.4)",
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
          Flight details
        </h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
          <tbody>
            <tr>
              <td style={{ color: "#888", padding: "6px 0", width: 160 }}>Flight</td>
              <td style={{ fontWeight: 500 }}>{flight.flightNumber}</td>
            </tr>
            <tr>
              <td style={{ color: "#888", padding: "6px 0" }}>Route</td>
              <td style={{ fontWeight: 500 }}>
                {AIRPORTS[flight.origin]} to {AIRPORTS[flight.destination]}
              </td>
            </tr>
            <tr>
              <td style={{ color: "#888", padding: "6px 0" }}>Departure</td>
              <td style={{ fontWeight: 500 }}>
                {formatLocal(flight.departureUtc, TIMEZONES[flight.origin])}
              </td>
            </tr>
            <tr>
              <td style={{ color: "#888", padding: "6px 0" }}>Arrival</td>
              <td style={{ fontWeight: 500 }}>
                {formatLocal(flight.arrivalUtc, TIMEZONES[flight.destination])}
              </td>
            </tr>
            <tr>
              <td style={{ color: "#888", padding: "6px 0" }}>Aircraft</td>
              <td style={{ fontWeight: 500 }}>{flight.aircraft}</td>
            </tr>
            <tr>
              <td style={{ color: "#888", padding: "6px 0" }}>Price</td>
              <td style={{ fontWeight: 700, fontSize: 18 }}>
                NZ${flight.priceNZD}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        style={{
          border: "1px solid #e0e0e0",
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
          Passenger
        </h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
          <tbody>
            <tr>
              <td style={{ color: "#888", padding: "6px 0", width: 160 }}>Name</td>
              <td style={{ fontWeight: 500 }}>
                {booking.passenger.firstName} {booking.passenger.lastName}
              </td>
            </tr>
            <tr>
              <td style={{ color: "#888", padding: "6px 0" }}>Email</td>
              <td style={{ fontWeight: 500 }}>{booking.passenger.email}</td>
            </tr>
            <tr>
              <td style={{ color: "#888", padding: "6px 0" }}>Booked at</td>
              <td style={{ fontWeight: 500 }}>
                {new Date(booking.bookedAt).toLocaleString("en-NZ")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <Link
          href="/"
          style={{
            background: "#111",
            color: "#00FF00",
            padding: "10px 24px",
            borderRadius: 8,
            textDecoration: "none",
            fontSize: 15,
          }}
        >
          Book another flight
        </Link>
        <Link
          href="/manage"
          style={{
            background: "#111",
            color: "#FF0000",
            padding: "10px 24px",
            borderRadius: 8,
            textDecoration: "none",
            fontSize: 15,
          }}
        >
          Manage bookings
        </Link>
      </div>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1rem" }}>
          <p>Loading...</p>
        </main>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}