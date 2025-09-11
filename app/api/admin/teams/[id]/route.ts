import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import Team from "@/models/team.model";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connect();
  const { id } = await context.params; // ✅ await the params

  const body = await req.json();

  try {
    const updated = await Team.findByIdAndUpdate(id, body, { new: true });
    if (!updated) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update team" },
      { status: 500 }
    );
  }
}
