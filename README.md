# Dairy Flat Air: Flight Booking

**Live:** https://dfa-js.vercel.app/

A booking system for a fictitious light-jet airline based at Dairy Flat Airport (NZNE), built for 159.352 Advanced Web Development at Massey University (Assignment 2, 2026).

Built with Next.js (App Router), MongoDB Atlas and Vercel.

## Features

- Search flights between two airports across a date range, since some routes only fly once or twice a week
- Book a seat, get a unique booking reference (`DF-XXXXXX`) and an invoice page with the price and local departure and arrival times
- Look up all bookings for an email address and cancel them
- Full flights can't be booked
- Rolling weekly timetable loaded for 10 weeks of real calendar dates
- Times shown in each airport's own timezone: NZ (+12), Chatham Islands (+12:45), Sydney (+10)

## Routes

All routes go to and from Dairy Flat (NZNE): Sydney (YSSY), Rotorua (NZRO), Great Barrier Island (NZGB), Chatham Islands (NZCI) and Lake Tekapo (NZTL).

## API

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/schedules?orig&dest&date1&date2` | Search flights, with seats remaining |
| GET | `/api/flights/[id]` | One scheduled flight |
| POST | `/api/bookings` | Create a booking |
| GET / DELETE | `/api/bookings/[ref]` | View or cancel a booking |
| GET | `/api/passengers/[email]/bookings` | All bookings for a passenger |

## Run locally

```sh
npm install
# .env.local: MONGODB_URI=<your Atlas connection string>
npm run dev
```

## Known issues

From marking feedback, tracked in Issues:
- [#1](../../issues/1) The search accepts routes the airline doesn't fly, e.g. Sydney to Chatham Islands
- [#2](../../issues/2) Confirmation page text is black on black under a light OS theme
