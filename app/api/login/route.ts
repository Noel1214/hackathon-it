import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connect } from "@/dbconfig/db";
import Team from "@/models/team.model";

export async function POST(req: Request) {
  try {
    await connect();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // 🔎 Find team leader by email and explicitly include password
    const team = await Team.findOne({ "teamLeader.email": email }).select(
      "teamLeader.email teamLeader.password teamLeader.name teamLeader.college teamLeader.city teamLeader.teamSize"
    );

    if (!team || !team.teamLeader.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log("DB stored hash:", team.teamLeader.password);
    console.log("Plain password received:", password);

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, team.teamLeader.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 🔑 Generate JWT
    const token = jwt.sign(
      { teamId: team._id, email: team.teamLeader.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    // 🍪 Set cookie
    const response = NextResponse.json(
      {
        message: "Login successful",
        team: {
          id: team._id,
          name: team.teamLeader.name,
          email: team.teamLeader.email,
          college: team.teamLeader.college,
          city: team.teamLeader.city,
          teamSize: team.teamLeader.teamSize,
        },
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("❌ Error in /api/login:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
