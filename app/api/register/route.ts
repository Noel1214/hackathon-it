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
      from: process.env.SENDGRID_FROM_EMAIL as string, // must be verified sender in SendGrid
      subject: `Hackathon Registration Confirmed – See You on 16.09.2025!`,
      text: `Hi ${data.teamLeader.name},

Your team of ${
        data.teamLeader.teamSize
      } has been successfully registered for the Hackathon 🎉

📅 Date: 16th September 2025
⏰ Time: Reach before 8:30 AM
📍 Venue: Sail Hall, St. Joseph's College, Trichy

Please bring your College ID Card or show this confirmation email at the entry.

Team Details:
- Leader: ${data.teamLeader.name}, ${data.teamLeader.college}, ${
        data.teamLeader.city
      }, ${data.teamLeader.phoneNumber}, ${data.teamLeader.email}
${data.teamMembers
  .map((m: unknown, i: number) => {
    const member = m as { name: string; email: string; phoneNumber: string };
    return `- Member ${i + 1}: ${member.name}, ${member.email}, ${
      member.phoneNumber
    }`;
  })
  .join("\n")}

For corrections, contact us.
More info: hackathon.jwstechnologies.com

Best of luck,
Team Organizers

---
JWS Technologies (Tech Support)
`,

      html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
    <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #e5e7eb;">
      <h1 style="color: #111827; margin: 0;">🎉 Hackathon Registration Confirmed!</h1>
      <p style="color: #6b7280; margin: 4px 0 0;">${data.teamLeader.college}</p>
    </div>

    <div style="padding: 20px; color: #111827;">
      <p>Hi <strong>${data.teamLeader.name}</strong>,</p>
      <p>Your team of <strong>${
        data.teamLeader.teamSize
      }</strong> has been successfully registered for the upcoming Hackathon 🚀</p>

      <div style="background: #111827; color: #ffffff; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h2 style="margin: 0 0 10px;">📅 Event Details</h2>
        <p style="margin: 4px 0;">📌 <strong>Date:</strong> 16th September 2025</p>
        <p style="margin: 4px 0;">⏰ <strong>Time:</strong> Reach before <strong>8:30 AM</strong></p>
        <p style="margin: 4px 0;">🏫 <strong>Venue:</strong> College Campus</p>
        <p style="margin: 4px 0;">🎟️ <strong>Entry:</strong> Show your <strong>College ID Card</strong> or this email</p>
      </div>

      <h2 style="margin-top: 0;">👥 Team Details</h2>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Leader:</strong> ${data.teamLeader.name}, ${
        data.teamLeader.college
      }, ${data.teamLeader.city}, ${data.teamLeader.phoneNumber}, ${
        data.teamLeader.email
      }</li>
        ${data.teamMembers
          .map(
            (
              m: { name: string; email: string; phoneNumber: string },
              i: number
            ) =>
              `<li><strong>Member ${i + 1}:</strong> ${m.name}, ${m.email}, ${
                m.phoneNumber
              }</li>`
          )
          .join("")}
      </ul>

      <p style="margin-top: 20px;">For corrections, please <a href="mailto:hackathon@jwstechnologies.com" style="color: #2563eb; text-decoration: none;">contact us</a>.</p>
      <p>For more details, visit our website: <a href="https://hackathon.jwstechnologies.com" style="color: #2563eb; text-decoration: none;">https://hackathon.jwstechnologies.com</a></p>
    </div>

    <div style="text-align: center; padding: 15px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
      © 2025 Hackathon Team | All Rights Reserved <br/>
      <strong>JWS Technologies (Tech Support)</strong>
    </div>
  </div>
  `,
    };

    // ✅ Send email
    await sgMail.send(msg);

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

    return NextResponse.json({ error: "Failed to register" }, { status: 500 });
  }
}
