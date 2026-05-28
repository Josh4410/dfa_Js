import "dotenv/config";
import { getClientPromise } from "./mongodb";
import clientPromise from "./mongodb";

const airports: Record<string, unknown>[] = [
  { _id: "NZNE", name: "Dairy Flat", timezone: "Pacific/Auckland" },
  { _id: "YSSY", name: "Sydney Kingsford Smith", timezone: "Australia/Sydney" },
  { _id: "NZRO", name: "Rotorua", timezone: "Pacific/Auckland" },
  { _id: "NZGB", name: "Claris (Great Barrier Island)", timezone: "Pacific/Auckland" },
  { _id: "NZCI", name: "Tuuta (Chatham Islands)", timezone: "Pacific/Chatham" },
  { _id: "NZTL", name: "Lake Tekapo", timezone: "Pacific/Auckland" },
];

// All times as UTC. NZ is UTC+12, Chatham UTC+12:45, Sydney UTC+10
const weeklyRoutes = [
  // Sydney prestige - Friday 10:00 NZST = 22:00 Thu UTC, arrives ~13:45 AEST = 03:45 UTC
  { flightNumber: "DF101", origin: "NZNE", destination: "YSSY", dayOfWeek: 5, depHourUtc: 22, depMinUtc: 0, durationMins: 225, aircraft: "SyberJet SJ30i", capacity: 6, priceNZD: 1800 },
  // Sydney return - Sunday 14:00 AEST = 04:00 UTC, arrives ~19:15 NZST = 07:15 UTC
  { flightNumber: "DF102", origin: "YSSY", destination: "NZNE", dayOfWeek: 0, depHourUtc: 4, depMinUtc: 0, durationMins: 195, aircraft: "SyberJet SJ30i", capacity: 6, priceNZD: 1800 },

  // Rotorua shuttle AM - 07:00 NZST = 19:00 UTC prev day
  { flightNumber: "DF201", origin: "NZNE", destination: "NZRO", dayOfWeek: 1, depHourUtc: 19, depMinUtc: 0, durationMins: 45, aircraft: "Cirrus SF50", capacity: 4, priceNZD: 280 },
  { flightNumber: "DF201", origin: "NZNE", destination: "NZRO", dayOfWeek: 2, depHourUtc: 19, depMinUtc: 0, durationMins: 45, aircraft: "Cirrus SF50", capacity: 4, priceNZD: 280 },
  { flightNumber: "DF201", origin: "NZNE", destination: "NZRO", dayOfWeek: 3, depHourUtc: 19, depMinUtc: 0, durationMins: 45, aircraft: "Cirrus SF50", capacity: 4, priceNZD: 280 },
  { flightNumber: "DF201", origin: "NZNE", destination: "NZRO", dayOfWeek: 4, depHourUtc: 19, depMinUtc: 0, durationMins: 45, aircraft: "Cirrus SF50", capacity: 4, priceNZD: 280 },
  { flightNumber: "DF201", origin: "NZNE", destination: "NZRO", dayOfWeek: 5, depHourUtc: 19, depMinUtc: 0, durationMins: 45, aircraft: "Cirrus SF50", capacity: 4, priceNZD: 280 },

  // Rotorua return AM
  { flightNumber: "DF202", origin: "NZRO", destination: "NZNE", dayOfWeek: 1, depHourUtc: 20, depMinUtc: 15, durationMins: 45, aircraft: "Cirrus SF50", capacity: 4, priceNZD: 280 },
  { flightNumber: "DF202", origin: "NZRO", destination: "NZNE", dayOfWeek: 2, depHourUtc: 20, depMinUtc: 15, durationMins: 45, aircraft: "Cirrus SF50", capacity: 4, priceNZD: 280 },
  { flightNumber: "DF202", origin: "NZRO", destination: "NZNE", dayOfWeek: 3, depHourUtc: 20, depMinUtc: 15, durationMins: 45, aircraft: "Cirrus SF50", capacity: 4, priceNZD: 280 },
  { flightNumber: "DF202", origin: "NZRO", destination: "NZNE", dayOfWeek: 4, depHourUtc: 20, depMinUtc: 15, durationMins: 45, aircraft: "Cirrus SF50", capacity: 4, priceNZD: 280 },
  { flightNumber: "DF202", origin: "NZRO", destination: "NZNE", dayOfWeek: 5, depHourUtc: 20, depMinUtc: 15, durationMins: 45, aircraft: "Cirrus SF50", capacity: 4, priceNZD: 280 },

  // Rotorua shuttle PM - 16:30 NZST = 04:30 UTC same day
  { flightNumber: "DF203", origin: "NZNE", destination: "NZRO", dayOfWeek: 1, depHourUtc: 4, depMinUtc: 30, durationMins: 45, aircraft: "Cirrus SF50", capacity: 4, priceNZD: 280 },
  { flightNumber: "DF203", origin: "NZNE", destination: "NZRO", dayOfWeek: 2, depHourUtc: 4, depMinUtc: 30, durationMins: 45, aircraft: "Cirrus SF50", capacity: 4, priceNZD: 280 },
  { flightNumber: "DF203", origin: "NZNE", destination: "NZRO", dayOfWeek: 3, depHourUtc: 4, depMinUtc: 30, durationMins: 45, aircraft: "Cirrus SF50", capacity: 4, priceNZD: 280 },
  { flightNumber: "DF203", origin: "NZNE", destination: "NZRO", dayOfWeek: 4, depHourUtc: 4, depMinUtc: 30, durationMins: 45, aircraft: "Cirrus SF50", capacity: 4, priceNZD: 280 },
  { flightNumber: "DF203", origin: "NZNE", destination: "NZRO", dayOfWeek: 5, depHourUtc: 4, depMinUtc: 30, durationMins: 45, aircraft: "Cirrus SF50", capacity: 4, priceNZD: 280 },

  // Rotorua return PM
  { flightNumber: "DF204", origin: "NZRO", destination: "NZNE", dayOfWeek: 1, depHourUtc: 7, depMinUtc: 0, durationMins: 45, aircraft: "Cirrus SF50", capacity: 4, priceNZD: 280 },
  { flightNumber: "DF204", origin: "NZRO", destination: "NZNE", dayOfWeek: 2, depHourUtc: 7, depMinUtc: 0, durationMins: 45, aircraft: "Cirrus SF50", capacity: 4, priceNZD: 280 },
  { flightNumber: "DF204", origin: "NZRO", destination: "NZNE", dayOfWeek: 3, depHourUtc: 7, depMinUtc: 0, durationMins: 45, aircraft: "Cirrus SF50", capacity: 4, priceNZD: 280 },
  { flightNumber: "DF204", origin: "NZRO", destination: "NZNE", dayOfWeek: 4, depHourUtc: 7, depMinUtc: 0, durationMins: 45, aircraft: "Cirrus SF50", capacity: 4, priceNZD: 280 },
  { flightNumber: "DF204", origin: "NZRO", destination: "NZNE", dayOfWeek: 5, depHourUtc: 7, depMinUtc: 0, durationMins: 45, aircraft: "Cirrus SF50", capacity: 4, priceNZD: 280 },

  // Great Barrier Island - Mon/Wed/Fri 09:00 NZST = 21:00 UTC prev day
  { flightNumber: "DF301", origin: "NZNE", destination: "NZGB", dayOfWeek: 1, depHourUtc: 21, depMinUtc: 0, durationMins: 40, aircraft: "Cirrus SF50", capacity: 4, priceNZD: 220 },
  { flightNumber: "DF301", origin: "NZNE", destination: "NZGB", dayOfWeek: 3, depHourUtc: 21, depMinUtc: 0, durationMins: 40, aircraft: "Cirrus SF50", capacity: 4, priceNZD: 220 },
  { flightNumber: "DF301", origin: "NZNE", destination: "NZGB", dayOfWeek: 5, depHourUtc: 21, depMinUtc: 0, durationMins: 40, aircraft: "Cirrus SF50", capacity: 4, priceNZD: 220 },

  // Great Barrier return - Tue/Thu/Sat 09:00 NZST = 21:00 UTC prev day
  { flightNumber: "DF302", origin: "NZGB", destination: "NZNE", dayOfWeek: 2, depHourUtc: 21, depMinUtc: 0, durationMins: 40, aircraft: "Cirrus SF50", capacity: 4, priceNZD: 220 },
  { flightNumber: "DF302", origin: "NZGB", destination: "NZNE", dayOfWeek: 4, depHourUtc: 21, depMinUtc: 0, durationMins: 40, aircraft: "Cirrus SF50", capacity: 4, priceNZD: 220 },
  { flightNumber: "DF302", origin: "NZGB", destination: "NZNE", dayOfWeek: 6, depHourUtc: 21, depMinUtc: 0, durationMins: 40, aircraft: "Cirrus SF50", capacity: 4, priceNZD: 220 },

  // Chatham Islands - Tue/Fri 10:00 NZST = 22:00 UTC prev day
  { flightNumber: "DF401", origin: "NZNE", destination: "NZCI", dayOfWeek: 2, depHourUtc: 22, depMinUtc: 0, durationMins: 135, aircraft: "HondaJet Elite", capacity: 5, priceNZD: 950 },
  { flightNumber: "DF401", origin: "NZNE", destination: "NZCI", dayOfWeek: 5, depHourUtc: 22, depMinUtc: 0, durationMins: 135, aircraft: "HondaJet Elite", capacity: 5, priceNZD: 950 },

  // Chatham return - Wed/Sat 10:00 Chatham time = 21:15 UTC prev day
  { flightNumber: "DF402", origin: "NZCI", destination: "NZNE", dayOfWeek: 3, depHourUtc: 21, depMinUtc: 15, durationMins: 120, aircraft: "HondaJet Elite", capacity: 5, priceNZD: 950 },
  { flightNumber: "DF402", origin: "NZCI", destination: "NZNE", dayOfWeek: 6, depHourUtc: 21, depMinUtc: 15, durationMins: 120, aircraft: "HondaJet Elite", capacity: 5, priceNZD: 950 },

  // Lake Tekapo - Monday 10:00 NZST = 22:00 UTC prev day (Sunday)
  { flightNumber: "DF501", origin: "NZNE", destination: "NZTL", dayOfWeek: 1, depHourUtc: 22, depMinUtc: 0, durationMins: 90, aircraft: "HondaJet Elite", capacity: 5, priceNZD: 420 },

  // Tekapo return - Tuesday 11:00 NZST = 23:00 UTC prev day (Monday)
  { flightNumber: "DF502", origin: "NZTL", destination: "NZNE", dayOfWeek: 2, depHourUtc: 23, depMinUtc: 0, durationMins: 80, aircraft: "HondaJet Elite", capacity: 5, priceNZD: 420 },
];

function getNextWeekday(from: Date, targetDay: number, hour: number, min: number): Date {
  const d = new Date(from);
  d.setUTCHours(hour, min, 0, 0);
  const diff = (targetDay - d.getUTCDay() + 7) % 7;
  d.setUTCDate(d.getUTCDate() + diff);
  return d;
}

async function seed() {
  const client = await getClientPromise();
  const db = client.db("dairy-flat-air");

  // Clear existing data
  await db.collection("airports").deleteMany({});
  await db.collection("schedules").deleteMany({});

  // Insert airports
  await db.collection("airports").insertMany(airports);
  console.log("Airports seeded");

  // Generate 10 weeks of flights starting from this Monday
  const now = new Date();
  const schedules: Record<string, unknown>[] = [];


  for (let week = 0; week < 10; week++) { // 10 weeks enough data??
    const weekStart = new Date(now);
    weekStart.setUTCDate(now.getUTCDate() + week * 7);

    for (const route of weeklyRoutes) {
      const dep = getNextWeekday(weekStart, route.dayOfWeek, route.depHourUtc, route.depMinUtc);
      // Skip if in the past
      if (dep < now) continue;

      const arr = new Date(dep.getTime() + route.durationMins * 60000);

      schedules.push({
        flightNumber: route.flightNumber,
        origin: route.origin,
        destination: route.destination,
        departureUtc: dep,
        arrivalUtc: arr,
        aircraft: route.aircraft,
        capacity: route.capacity,
        priceNZD: route.priceNZD,
        bookings: [],
      });
    }
  }

await db.collection("schedules").insertMany(schedules);
  console.log(`Seeded ${schedules.length} scheduled flights`);

  process.exit(0);
}

seed().catch(console.error);