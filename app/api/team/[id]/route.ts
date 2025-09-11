import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import Team from "@/models/team.model";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// ✅ GET single team (auth required)
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    interface JwtPayload {
      teamId: string;
      // add other properties if needed
      [key: string]: unknown;
    }
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Make sure the token matches the requested team ID
    if (decoded.teamId !== params.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const team = await Team.findById(params.id);
    if (!team)
      return NextResponse.json({ error: "Team not found" }, { status: 404 });

    return NextResponse.json(team, { status: 200 });
  } catch (err) {
    console.error("❌ Error fetching team:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ PUT update team
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connect();
    const { id } = params;
    const data = await req.json();

    const { teamLeader, teamMembers } = data;
    if (!teamLeader || !teamMembers) {
      return NextResponse.json(
        { error: "Missing teamLeader or teamMembers" },
        { status: 400 }
      );
    }

    const { name, email, phoneNumber, city, college, department } = teamLeader;
    if (!name || !email || !phoneNumber || !city || !college || !department) {
      return NextResponse.json(
        { error: "All leader fields are required" },
        { status: 400 }
      );
    }

    const updatedTeam = await Team.findByIdAndUpdate(
      id,
      {
        $set: {
          "teamLeader.name": teamLeader.name,
          "teamLeader.email": teamLeader.email,
          "teamLeader.phoneNumber": teamLeader.phoneNumber,
          "teamLeader.city": teamLeader.city,
          "teamLeader.college": teamLeader.college,
          "teamLeader.department": teamLeader.department,
          "teamLeader.teamSize": teamMembers.length + 1,
          teamMembers,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedTeam)
      return NextResponse.json({ error: "Team not found" }, { status: 404 });

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
