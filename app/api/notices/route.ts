import { NextResponse } from "next/server";

const notices = [
  { id: 1, title: "Hackathon Rules", url: "/docs/rules.pdf" },
  { id: 2, title: "Event Schedule", url: "/docs/schedule.pdf" },
  { id: 3, title: "Venue Map", url: "/docs/venue-map.pdf" },
  { id: 4, title: "Code of Conduct", url: "/docs/conduct.pdf" },
];

export async function GET() {
  return NextResponse.json(notices);
}
