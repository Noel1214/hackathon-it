import bcrypt from "bcryptjs";
import mongoose, { Schema, Document, Model } from "mongoose";

interface TeamMember {
  name: string;
  email: string;
  phoneNumber: string;
}

export interface TeamDocument extends Document {
  teamLeader: {
    name: string;
    college: string;
    city: string;
    phoneNumber: string;
    email: string;
    password: string;
    teamSize: number;
  };
  teamMembers: TeamMember[];
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema = new Schema<TeamMember>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

const TeamLeaderSchema = new Schema({
  name: { type: String, required: true },
  college: { type: String, required: true },
  city: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
  teamSize: { type: Number, required: true, min: 1, max: 4 },
});
const TeamSchema = new Schema(
  {
    teamLeader: { type: TeamLeaderSchema, required: true },
    teamMembers: [TeamMemberSchema],
  },
  { timestamps: true }
);
// 🔑 Middleware to hash only leader password
TeamSchema.pre("save", async function (next) {
  const team = this as TeamDocument;

  if (team.isModified("teamLeader.password")) {
    team.teamLeader.password = await bcrypt.hash(team.teamLeader.password, 10);
  }

  next();
});
// delete mongoose.models.Team;

// Avoid OverwriteModelError in Next.js hot-reloads
const Team: Model<TeamDocument> =
  mongoose.models.Team || mongoose.model<TeamDocument>("Team", TeamSchema);

export default Team;
