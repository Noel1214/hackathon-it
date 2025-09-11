// app/api/team/[id]/route.ts
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import Team from "@/models/team.model";

interface TeamMember {
  _id?: string;
  name: string;
  email: string;
  phoneNumber: string;
}

interface TeamLeader {
  name: string;
  email: string;
  phoneNumber: string;
  city: string;
  college: string;
  department: string;
}

interface UpdateTeamData {
  teamLeader: TeamLeader;
  teamMembers: TeamMember[];
}

export async function GET() {
  await connect();
  const teams = await Team.find().sort({ createdAt: -1 });
  return NextResponse.json(teams);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connect();

    const { id } = params;
    const data: UpdateTeamData = await req.json();

    // Basic validation
    const { name, email, phoneNumber, city, college, department } =
      data.teamLeader;
    if (!name || !email || !phoneNumber || !city || !college || !department) {
      return NextResponse.json(
        { error: "All leader fields are required" },
        { status: 400 }
      );
    }

    // Update team
    const updatedTeam = await Team.findByIdAndUpdate(
      id,
      {
        teamLeader: {
          ...data.teamLeader,
          teamSize: data.teamMembers.length + 1,
        },
        teamMembers: data.teamMembers,
      },
      { new: true, runValidators: true }
    );

    if (!updatedTeam) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Team updated successfully", team: updatedTeam },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error updating team:", err);
    return NextResponse.json(
      { error: "Failed to update team" },
      { status: 500 }
    );
  }
}
