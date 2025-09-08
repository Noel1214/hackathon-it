import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import sgMail from "@sendgrid/mail";
import { connect } from "@/dbconfig/db";
import Team from "@/models/team.model";
// import QRCode from "qrcode";

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

// Define TypeScript interfaces
interface TeamMember {
  name: string;
  email: string;
  phoneNumber: string;
}

interface TeamLeader {
  name: string;
  email: string;
  college: string;
  city: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

interface RegistrationData {
  teamLeader: TeamLeader;
  teamMembers: TeamMember[];
}

export async function POST(req: Request) {
  try {
    // 1. Connect to DB
    await connect();

    // 2. Parse incoming JSON with type assertion
    const data: RegistrationData = await req.json();
    const { password, confirmPassword, ...leader } = data.teamLeader;

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    // 3. Generate Team ID
    const lastTeam = await Team.findOne().sort({ createdAt: -1 });
    let nextNumber = 101;
    if (lastTeam?.teamId) {
      const lastNumber = parseInt(lastTeam.teamId.replace("HIT", ""), 10);
      if (!isNaN(lastNumber)) nextNumber = lastNumber + 1;
    }
    const newTeamId = `HIT${nextNumber}`;

    // 4. Save to MongoDB
    const finalTeamSize = data.teamMembers.length + 1;
    const newTeam = new Team({
      teamId: newTeamId,
      teamLeader: {
        ...leader,
        password: await bcrypt.hash(password, 10), // Hash the password
        teamSize: finalTeamSize,
      },
      teamMembers: data.teamMembers || [],
    });

    newTeam.set("payment", {
      amount: finalTeamSize * 200,
      status: "pending",
      updatedAt: new Date(),
    });

    await newTeam.save();

    // 6. Prepare email
    const paymentAmount = finalTeamSize * 200;
    const upiId = "rakeshjoe52-1@oksbi";

    const msg = {
      to: data.teamLeader.email,
      from: process.env.SENDGRID_FROM_EMAIL as string,
      subject: "✅ Hackathon 2025 Registration Confirmed – Payment Pending",
      text: `Hi ${data.teamLeader.name},

Your team of ${finalTeamSize} has been successfully registered for Hackathon 2025.

💳 Payment Pending: ₹${paymentAmount}

Please complete the payment using any UPI app:

UPI ID: ${upiId}
Amount: ₹${paymentAmount}
Transaction Reference / Note: ${newTeamId}

Once payment is complete, your registration will be confirmed.

Team Details:
Leader: ${data.teamLeader.name}, ${data.teamLeader.college}, ${
        data.teamLeader.city
      }, ${data.teamLeader.phoneNumber}, ${data.teamLeader.email}
Members:
${data.teamMembers
  .map(
    (m: TeamMember, i: number) =>
      `Member ${i + 1}: ${m.name}, ${m.email}, ${m.phoneNumber}`
  ) // ✅ Added types
  .join("\n")}

Event Date: 16th September 2025
Reporting Time: Before 8:45 AM
Venue: Sail Hall, St. Joseph's College

For support, contact: +91 6385266784
Website: https://jwstechnologies.com
`,
      html: `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: auto; padding: 24px; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px;">
  <div style="text-align: center; border-bottom: 1px solid #e0e0e0; padding-bottom: 20px; margin-bottom: 20px;">
    <h1 style="color: #111827; margin: 0;">🎉 Registration Confirmed!</h1>
    <p style="color: #6b7280; margin: 6px 0 0; font-size: 14px;">Hackathon 2025 • St. Joseph's College</p>
  </div>

  <div style="color: #111827; font-size: 15px; line-height: 1.6;">
    <p>Hi <strong>${data.teamLeader.name}</strong>,</p>
    <p>Your team of <strong>${finalTeamSize}</strong> has been successfully registered for Hackathon 2025 🚀</p>

    <p style="background-color: #fffbeb; color: #b45309; padding: 10px 15px; border-radius: 8px; font-weight: bold;">
      💳 Payment Pending: ₹${paymentAmount}
    </p>

    <p>Please complete the payment using any UPI app:</p>
    <ul>
      <li><strong>UPI ID:</strong> ${upiId}</li>
      <li><strong>Amount:</strong> ₹${paymentAmount}</li>
      <li><strong>Transaction Reference / Note:</strong> ${newTeamId}</li>
    </ul>

    <h3>👥 Team Details</h3>
    <ul>
      <li><strong>Leader:</strong> ${data.teamLeader.name}, ${
        data.teamLeader.college
      }, ${data.teamLeader.city}, ${data.teamLeader.phoneNumber}, ${
        data.teamLeader.email
      }</li>
      ${data.teamMembers
        .map(
          (
            m: TeamMember,
            i: number // ✅ Added types
          ) =>
            `<li><strong>Member ${i + 1}:</strong> ${m.name}, ${m.email}, ${
              m.phoneNumber
            }</li>`
        )
        .join("")}
    </ul>

    <p>📅 Event Date: 16th September 2025<br/>
    ⏰ Reporting Time: Before 8:45 AM<br/>
    📍 Venue: Sail Hall, St. Joseph's College</p>

    <p style="text-align:center; margin: 25px 0;">
      <a href="https://hackathon.jwstechnologies.com/login" target="_blank" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
        Login to Dashboard
      </a>
    </p>

    <p>For support, call: <a href="tel:+916385266784" style="color: #2563eb; text-decoration: none;">+91 6385266784</a></p>
  </div>

  <div style="text-align: center; padding: 15px; border-top: 1px solid #e0e0e0; color: #6b7280; font-size: 12px; margin-top: 20px;">
    © 2025 Hackathon Team | <a href="https://jwstechnologies.com" target="_blank" style="color: #2563eb; text-decoration: none;">JWS Technologies – Technical Support</a>
  </div>
</div>
`,
    };

    await sgMail.send(msg);

    return NextResponse.json(
      { message: "✅ Registration successful!", teamId: newTeam.teamId },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("❌ Error in /api/register:", err);
    return NextResponse.json({ error: "Failed to register" }, { status: 500 });
  }
}
