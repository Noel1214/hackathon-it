import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { connect } from "@/dbconfig/db";
import Team from "@/models/team.model";

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function POST(req: Request) {
  try {
    // 1. Connect to DB
    await connect();

    // 2. Parse incoming JSON
    const data = await req.json();
    console.log("Incoming data:", data);

    // 3. Save to MongoDB
    const newTeam = new Team({
      teamLeader: data.teamLeader,
      teamMembers: data.teamMembers || [],
    });

    await newTeam.save();
    console.log("✅ Team saved to DB:", newTeam._id);

    // 4. Prepare confirmation email
    const msg = {
      to: data.teamLeader.email,
      from: process.env.SENDGRID_FROM_EMAIL as string, // must be verified in SendGrid
      subject: "Registration Confirmation",
      text: `Hi ${data.teamLeader.name}, your team of ${data.teamLeader.teamSize} has been registered!`,
      html: `<p>Hi <strong>${data.teamLeader.name}</strong>,</p>
             <p>Your team of <strong>${data.teamLeader.teamSize}</strong> has been successfully registered 🎉</p>
             <p>Thank you,<br/>Team</p>`,
    };

    // Uncomment when ready to send
    // await sgMail.send(msg);

    return NextResponse.json(
      {
        message: "✅ Registration successful!",
        teamId: newTeam._id,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("❌ Error in /api/register:", err.message, err.stack);
    } else {
      console.error("❌ Unknown error:", err);
    }

    return NextResponse.json(
      { error: "Failed to register" },
      { status: 500 }
    );
  }
}
