"use client";
import { useEffect, useState } from "react";

const AIRPORTS = [
  { code: "NZNE", name: "Dairy Flat" },
  { code: "YSSY", name: "Sydney" },
  { code: "NZRO", name: "Rotorua" },
  { code: "NZGB", name: "Great Barrier Island" },
  { code: "NZCI", name: "Chatham Islands" },
  { code: "NZTL", name: "Lake Tekapo" },
];

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

export default function Home() {
  const [origin, setOrigin] = useState("NZNE");
  const [destination, setDestination] = useState("YSSY");
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [flights, setFlights] = useState<Flight[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  document.body.style.backgroundImage = "url('/home.jpg')";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundAttachment = "fixed";
  document.body.style.minHeight = "100vh";
  return () => {
    document.body.style.backgroundImage = "";
  };
}, []);

  async function search() {
    console.log("date1:", date1, "date2:", date2); //debug log
    if (!date1 || !date2) {
      alert("Please select a date range");
      return;
    }
    if (origin === destination) {
      alert("Origin and destination must differ");
      return;
    }
    setLoading(true);
    const res = await fetch(
      `/api/schedules?orig=${origin}&dest=${destination}&date1=${date1}&date2=${date2}`
    );
    const data = await res.json();
    setFlights(data);
    setSearched(true);
    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1rem" }}>
      
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 4, color: "#FFF" }}>
        Dairy Flat Air
      </h1>

      <div style={{border: "1px solid #ffffff",borderRadius: 12,padding: 24,marginBottom: 16, background: "rgba(0,0,0,0.4)"}}>

        <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 16, color: "#fff" }}>
          Search flights
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4, color: "#fff" }}>
              From
            </label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 15,
                color: "#111",
              }}
            >
              {AIRPORTS.map((a) => (
                <option key={a.code} value={a.code}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4, color: "#fff" }}>
              To
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 15,
                color: "#111",
              }}
            >
              {AIRPORTS.map((a) => (
                <option key={a.code} value={a.code}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4, color: "#fff" }}>
              From date
            </label>
            <input
              type="date"
              value={date1}
              onChange={(e) => setDate1(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 15,
                color: "#111",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4, color: "#fff" }}>
              To date
            </label>
            <input
              type="date"
              value={date2}
              onChange={(e) => setDate2(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 15,
                color: "#111",
              }}
            />
          </div>
        </div>

        <button
          onClick={search}
          disabled={loading}
          style={{
            background: "#000000",
            color: "#00FF00",
            border: "none",
            borderRadius: 8,
            padding: "10px 24px",
            fontSize: 15,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {searched && flights.length === 0 && (
        <p style={{ color: "#fff" }}>
          No flights found for that route and date range.
        </p>
      )}

      {flights.map((f) => (
        <div
          key={f._id}
          style={{
            border: "1px solid #ffffff",
            borderRadius: 12,
            padding: 24,
            marginBottom: 10,
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
              <div
                style={{ fontWeight: 600, fontSize: 16, marginBottom: 4, color: "#fff" }}
              >
                {f.flightNumber} -{" "}
                {AIRPORTS.find((a) => a.code === f.origin)?.name} to {" "}
                {AIRPORTS.find((a) => a.code === f.destination)?.name}
              </div>
              <div style={{ fontSize: 14, color: "#fff", marginBottom: 2 }}>
                Dep: {formatLocal(f.departureUtc, TIMEZONES[f.origin])}
              </div>
              <div style={{ fontSize: 14, color: "#fff", marginBottom: 2 }}>
                Arr: {formatLocal(f.arrivalUtc, TIMEZONES[f.destination])}
              </div>
              <div style={{ fontSize: 13, color: "#fff", marginTop: 4 }}>
                {f.aircraft} - {f.seatsRemaining} of {f.capacity} seats
                remaining
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div
                style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: "#F54927" }}
              >
                NZ${f.priceNZD}
              </div>
              {f.seatsRemaining > 0 ? (
                <a href={`/book/${f._id}`}
                  style={{
                    background: "#111",
                    color: "#00FF00",
                    padding: "8px 18px",
                    borderRadius: 8,
                    textDecoration: "none",
                    fontSize: 14,
                    display: "inline-block",
                  }}
                >
                  Book
                </a>
              ) : (
                <span style={{ color: "#c00", fontSize: 14 }}>Full</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </main>
  );
}