import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import Team from "@/models/team.model";

export async function GET() {
  await connect();
  const teams = await Team.find().sort({ createdAt: -1 });
  return NextResponse.json(teams);
}
