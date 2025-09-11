import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import Team from "@/models/team.model";

connect();

// ✅ Update team by ID
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const updatedTeam = await Team.findByIdAndUpdate(id, body, { new: true });

    if (!updatedTeam) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTeam, { status: 200 });
  } catch (error: unknown) {
    console.error("PUT /api/admin/teams/[id] error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update team",
      },
      { status: 500 }
    );
  }
}

// ✅ Get team by ID
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const team = await Team.findById(id);

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
    return NextResponse.json(team, { status: 200 });
  } catch (error: unknown) {
    console.error("GET /api/admin/teams/[id] error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch team",
      },
      { status: 500 }
    );
  }
}

// ✅ Delete team by ID
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const deletedTeam = await Team.findByIdAndDelete(id);

    if (!deletedTeam) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Team deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("DELETE /api/admin/teams/[id] error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to delete team",
      },
      { status: 500 }
    );
  }
}
