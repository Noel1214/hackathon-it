import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
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
    const { password, confirmPassword, ...leader } = data.teamLeader;

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }
    console.log("📩 Incoming:", JSON.stringify(data, null, 2));

    // 3. Generate Team ID
    const lastTeam = await Team.findOne().sort({ createdAt: -1 });

    let nextNumber = 101; // starting point
    if (lastTeam?.teamId) {
      const lastNumber = parseInt(lastTeam.teamId.replace("HIT", ""), 10);
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    const newTeamId = `HIT${nextNumber}`; // ✅ This will give HIT101, HIT102...

    // 3. Save to MongoDB (hash via schema middleware)

    const newTeam = new Team({
      teamId: newTeamId, // ✅ save custom teamId
      teamLeader: {
        ...leader,
        password,
        teamSize: data.teamLeader.teamSize,
      },
      teamMembers: data.teamMembers || [],
    });

    await newTeam.save();
    console.log("✅ Team saved to DB:", newTeam._id);

    // 4. Prepare confirmation email
    const msg = {
      to: data.teamLeader.email,
      from: process.env.SENDGRID_FROM_EMAIL as string,
      subject: `✅ Hackathon Registration Confirmed – See You on 16.09.2025!`,
      text: `Dear ${data.teamLeader.name},

Congratulations! Your team of ${
        data.teamLeader.teamSize
      } has been successfully registered for the Hackathon 🎉

📅 Date: 16th September 2025
⏰ Reporting Time: Before 8:45 AM
📍 Venue: Sail Hall, St. Joseph’s College, Tiruchirappalli

Kindly bring your College ID Card or show this confirmation email at the entry.

👥 Team Details:
- Leader: ${data.teamLeader.name}, ${data.teamLeader.phoneNumber}, ${
        data.teamLeader.email
      }
${data.teamMembers
  .map(
    (m: { name: string; email: string; phoneNumber: string }, i: number) =>
      `- Member ${i + 1}: ${m.name}, ${m.email}, ${m.phoneNumber}`
  )
  .join("\n")}

🔑 Login Reminder: Use the password you set during registration.

For any corrections or support, contact us directly.  
More details: hackathon.jwstechnologies.com

We look forward to your participation and wish you the very best! 🚀

Warm regards,  
Hackathon Organizing Team  
JWS Technologies (Technical Support)`,
      html: `
  <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; padding: 24px; background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
    <!-- Header -->
    <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #e5e7eb;">
      <h1 style="color: #111827; margin: 0;">🎉 Registration Confirmed</h1>
      <p style="color: #6b7280; margin: 6px 0 0; font-size: 14px;">
        Hackathon 2025 • St. Joseph’s College, Tiruchirappalli
      </p>
    </div>

    <!-- Greeting -->
    <div style="padding: 20px; color: #111827; font-size: 15px; line-height: 1.6;">
      <p>Dear <strong>${data.teamLeader.name}</strong>,</p>
      <p>We are excited to inform you that your team of <strong>${
        data.teamLeader.teamSize
      }</strong> has been successfully registered for the upcoming Hackathon 🚀</p>

      <!-- Event Details -->
      <div style="background: #111827; color: #ffffff; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <h2 style="margin: 0 0 12px; font-size: 18px;">📅 Event Details</h2>
        <p><strong>Date:</strong> 16th September 2025</p>
        <p><strong>Reporting Time:</strong> Before 8:45 AM</p>
        <p><strong>Venue:</strong> Sail Hall, St. Joseph’s College</p>
        <p><strong>Entry:</strong> College ID Card or this confirmation email</p>
      </div>

      <!-- Team Details -->
      <h2 style="font-size: 18px; margin-top: 20px;">👥 Team Information</h2>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li style="margin-bottom: 8px;">
          <strong>Leader:</strong> ${data.teamLeader.name}, ${
        data.teamLeader.college
      }, ${data.teamLeader.city}, ${data.teamLeader.phoneNumber}, ${
        data.teamLeader.email
      }
        </li>
        ${data.teamMembers
          .map(
            (
              m: { name: string; email: string; phoneNumber: string },
              i: number
            ) =>
              `<li style="margin-bottom: 6px;"><strong>Member ${
                i + 1
              }:</strong> ${m.name}, ${m.email}, ${m.phoneNumber}</li>`
          )
          .join("")}
      </ul>

      <!-- Instructions -->
      <p style="margin-top: 20px;">🔑 <strong>Login Reminder:</strong> Use the password you created during registration.</p>
      <p>For any corrections or support, please <a href="tel:+916385266784" style="color: #2563eb; text-decoration: none;">contact us</a>.</p>
      <p>For more information, visit <a href="https://hackathon.jwstechnologies.com" style="color: #2563eb; text-decoration: none;">hackathon.jwstechnologies.com</a>.</p>

      <p style="margin-top: 20px;">We are excited to see you showcase your skills and creativity. Best wishes to your team!</p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 15px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
      © 2025 Hackathon Team | All Rights Reserved <br/>
      <strong>JWS Technologies – Technical Support</strong>
    </div>
  </div>
  `,
    };

    // ✅ Send email
    await sgMail.send(msg);

    return NextResponse.json(
      {
        message: "✅ Registration successful!",
        teamId: newTeam.teamId,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("❌ Error in /api/register:", err);
    return NextResponse.json({ error: "Failed to register" }, { status: 500 });
  }
}
