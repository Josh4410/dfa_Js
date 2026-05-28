"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

interface Flight {
  _id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureUtc: string;
  arrivalUtc: string;
  aircraft: string;
  capacity: number;
  priceNZD: number;
  seatsRemaining: number;
}

export default function BookPage() {
  const { id } = useParams();
  const router = useRouter();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
  document.body.style.backgroundImage = "url('/book.jpg')";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundAttachment = "fixed";
  document.body.style.minHeight = "100vh";
  return () => {
    document.body.style.backgroundImage = "";
  };
  }, []);

  useEffect(() => {
    fetch(`/api/flights/${id}`)
      .then((r) => r.json())
      .then(setFlight);
  }, [id]);

  async function submit() {
    if (!firstName || !lastName || !email) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scheduleId: id, firstName, lastName, email }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Booking failed");
      setLoading(false);
      return;
    }
    router.push(`/confirmation?ref=${data.bookingRef}`);
  }

  if (!flight) {
    return (
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1rem" }}>
        <p>Loading...</p>
      </main>
    );
  }

return (
    <main style={{maxWidth: 720,  margin: "0 auto", padding: "2rem 1rem", }}>
      
        <Link href="/"
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
        Book your flight
      </h1>

      <div style={{border: "1px solid #ffffff",borderRadius: 12,padding: 24,marginBottom: 16,background: "rgba(0,0,0,0.4)"}}>

        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8, color: "#fff" }}>
          {flight.flightNumber} -- {AIRPORTS[flight.origin]} to {" "}
          {AIRPORTS[flight.destination]}
        </div>
        <div style={{ fontSize: 14, color: "#fff", marginBottom: 2 }}>
          Departure: {formatLocal(flight.departureUtc, TIMEZONES[flight.origin])}
        </div>
        <div style={{ fontSize: 14, color: "#fff", marginBottom: 2 }}>
          Arrival: {formatLocal(flight.arrivalUtc, TIMEZONES[flight.destination])}
        </div>
        <div style={{ fontSize: 13, color: "#fff", marginTop: 4 }}>
          {flight.aircraft} -- {flight.seatsRemaining} seats remaining
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, marginTop: 12, color: "#F54927" }}>
          NZ${flight.priceNZD}
        </div>
      </div>

      <div style={{border: "1px solid #ffffff",borderRadius: 12,padding: 24,marginBottom: 16,background: "rgba(0,0,0,0.4)"}}>

        <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 16, color: "#fff" }}>
          Passenger details
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <div>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4, color: "#fff" }}>
              First name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Josh"
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 15,
                boxSizing: "border-box",
                color: "#111",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4, color: "#fff" }}>
              Last name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Smith"
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 15,
                boxSizing: "border-box",
                color: "#111",
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 13, marginBottom: 4, color: "#fff" }}>
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@firm.co.nz"
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #ddd",
              fontSize: 15,
              boxSizing: "border-box",
              color: "#111",
            }}
         />
        </div>

        {error && (
          <p style={{ color: "#c00", fontSize: 14, marginBottom: 12 }}>
            {error}
          </p>
        )}

        <button
          onClick={submit}
          disabled={loading}
          style={{
            background: "#111",
            color: "#00FF00",
            border: "none",
            borderRadius: 8,
            padding: "10px 24px",
            fontSize: 15,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Booking..." : "Confirm booking"}
        </button>
      </div>
    </main>
  );
}