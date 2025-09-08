import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import Team from "@/models/team.model";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connect();
  const { action } = await req.json();
  const team = await Team.findById(params.id);
  if (!team)
    return NextResponse.json({ error: "Team not found" }, { status: 404 });

  if (action === "approve") team.payment.status = "approved";
  if (action === "reject") team.payment.status = "rejected";

  team.payment.updatedAt = new Date();
  await team.save();

  if (action === "approve") {
    await sgMail.send({
      to: team.teamLeader.email,
      from: process.env.SENDGRID_FROM_EMAIL as string,
      subject: "✅ Payment Approved – Hackathon Registration Confirmed",
      text: `Dear ${team.teamLeader.name}, your payment of ₹${team.payment.amount} has been approved. Team ID: ${team.teamId}`,
    });
  }

  return NextResponse.json({
    message: `Payment ${action}d`,
    payment: team.payment,
  });
}
