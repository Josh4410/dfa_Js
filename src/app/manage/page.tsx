"use client";
import React, { useEffect, useState } from "react";
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

interface FlightWithBooking {
  flightNumber: string;
  origin: string;
  destination: string;
  departureUtc: string;
  arrivalUtc: string;
  aircraft: string;
  priceNZD: number;
  booking: Booking;
}

export default function ManagePage() {
  const [email, setEmail] = useState("");
  const [results, setResults] = useState<FlightWithBooking[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.backgroundImage = "url('/manage.jpg')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.minHeight = "100vh";
    return () => {
      document.body.style.backgroundImage = "";
    };
  }, []);

  async function lookup() {
    if (!email) return;
    setLoading(true);
    const res = await fetch(`/api/passengers/${encodeURIComponent(email)}/bookings`);
    const data = await res.json();
    setResults(Array.isArray(data) ? data : []);
    setSearched(true);
    setLoading(false);
  }

  async function cancel(bookingRef: string) {
    if (!confirm(`Cancel booking ${bookingRef}?`)) return;
    setCancelling(bookingRef);
    await fetch(`/api/bookings/${bookingRef}`, { method: "DELETE" });
    setResults((prev) => prev.filter((r) => r.booking.bookingRef !== bookingRef));
    setCancelling(null);
  }

  return (
    <main style={{maxWidth: 720,  margin: "0 auto",  padding: "2rem 1rem",}}>
      <Link
        href="/"
        style={{
          fontSize: 14,
          color: "#fff",
          textDecoration: "none",
          display: "block",
          marginBottom: 24,
        }}
      >
        Back to search
      </Link>

      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>
        Manage bookings
      </h1>

      <div style={{border: "1px solid #ffffff",borderRadius: 12,padding: 24,marginBottom: 16, background: "rgba(0,0,0,0.4)"}}>

        <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 16, color: "#fff" }}>
          Look up your bookings
        </h2>
        <label style={{ display: "block", fontSize: 13, marginBottom: 4, color: "#fff" }}>
          Email address
        </label>
        <div style={{ display: "flex", gap: 12 }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@firm.co.nz"
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #ddd",
              fontSize: 15,
              color: "#111",
            }}
          />
          <button
            onClick={lookup}
            disabled={loading}
            style={{
              background: "#111",
              color: "#00FF00",
              border: "none",
              borderRadius: 8,
              padding: "8px 20px",
              fontSize: 15,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {searched && results.length === 0 && (
        <p style={{ color: "#fff" }}>No bookings found for that email.</p>
      )}

      {results.map((r) => (
        <div
          key={r.booking.bookingRef}
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: 12,
            padding: 20,
            marginBottom: 12,
            background: "rgba(0,0,0,0.4)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
                {r.flightNumber} - {AIRPORTS[r.origin]} to {AIRPORTS[r.destination]}
              </div>
              <div style={{ fontSize: 14, color: "#fff", marginBottom: 2 }}>
                Dep: {formatLocal(r.departureUtc, TIMEZONES[r.origin])}
              </div>
              <div style={{ fontSize: 14, color: "#fff", marginBottom: 2 }}>
                Arr: {formatLocal(r.arrivalUtc, TIMEZONES[r.destination])}
              </div>
              <div style={{ fontSize: 13, color: "#fff", marginTop: 4 }}>
                {r.aircraft} - NZ${r.priceNZD}
              </div>
              <div style={{ fontSize: 13, color: "#fff" }}>
                Ref: <strong>{r.booking.bookingRef}</strong>
              </div>
              <div style={{ fontSize: 13, color: "#fff " }}>
                Passenger: {r.booking.passenger.firstName} {r.booking.passenger.lastName}
              </div>
            </div>
            <button
              onClick={() => cancel(r.booking.bookingRef)}
              disabled={cancelling === r.booking.bookingRef}
              style={{
                background: "#111",
                color: "#FF0000",
                border: "1px solid #FF0000",
                borderRadius: 8,
                padding: "8px 16px",
                fontSize: 14,
                cursor: "pointer",
                opacity: cancelling === r.booking.bookingRef ? 0.6 : 1,
              }}
            >
              {cancelling === r.booking.bookingRef ? "Cancelling..." : "Cancel"}
            </button>
          </div>
        </div>
      ))}
    </main>
  );
}