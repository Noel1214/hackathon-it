import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import Team from "@/models/team.model";

export async function GET() {
  try {
    await connect();
    const teams = await Team.find().sort({ createdAt: -1 });
    return NextResponse.json(teams, { status: 200 });
  } catch (err) {
    console.error("❌ Error fetching teams:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
