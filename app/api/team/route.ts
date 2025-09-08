import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import Team from "@/models/team.model";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connect();
    const data = await req.json();

    const team = await Team.findById(params.id);
    if (!team)
      return NextResponse.json({ error: "Team not found" }, { status: 404 });

    team.teamLeader = { ...team.teamLeader, ...data.teamLeader };
    team.teamMembers = data.teamMembers || team.teamMembers;

    await team.save();
    return NextResponse.json({ message: "Team updated", team });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update team" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connect();
    const { action, amount } = await req.json();
    const team = await Team.findById(params.id);
    if (!team)
      return NextResponse.json({ error: "Team not found" }, { status: 404 });

    if (action === "mark-sent") {
      team.payment = {
        amount: amount || team.payment?.amount || 0,
        status: "pending",
        updatedAt: new Date(),
      };
      await team.save();
      return NextResponse.json({
        message: "Payment marked as sent",
        payment: team.payment,
      });
    }

    if (action === "approve") {
      if (!team.payment)
        return NextResponse.json(
          { error: "No payment to approve" },
          { status: 400 }
        );

      team.payment.status = "approved";
      team.payment.updatedAt = new Date();
      await team.save();

      await sgMail.send({
        to: team.teamLeader.email,
        from: process.env.SENDGRID_FROM_EMAIL as string,
        subject: `✅ Payment Approved – Hackathon Registration Confirmed`,
        text: `Dear ${team.teamLeader.name},\n\nYour payment of ₹${team.payment.amount} has been approved. Your team registration is now confirmed!\n\nTeam ID: ${team.teamId}\n\nSee you on 16th September 2025.\n\nBest regards,\nHackathon Team`,
      });

      return NextResponse.json({
        message: "Payment approved & email sent",
        payment: team.payment,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update payment" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        teamId: string;
      };
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const team = await Team.findById(decoded.teamId);
    if (!team)
      return NextResponse.json({ error: "Team not found" }, { status: 404 });

    return NextResponse.json(team, { status: 200 });
  } catch (err) {
    console.error("❌ Error fetching team:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
