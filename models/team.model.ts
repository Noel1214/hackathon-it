import bcrypt from "bcryptjs";
import mongoose, { Schema, Document, Model } from "mongoose";

interface TeamMember {
  name: string;
  email: string;
  phoneNumber: string;
}

interface Payment {
  amount: number;
  status: "pending" | "approved" | "rejected";
  updatedAt: Date;
}
export interface TeamDocument extends Document {
  teamId: string;
  teamLeader: {
    name: string;
    college: string;
    department: string;
    city: string;
    phoneNumber: string;
    email: string;
    password: string;
    teamSize: number;
  };
  teamMembers: TeamMember[];
  payment: {
    amount: number;
    status: "pending" | "approved" | "rejected";
    updatedAt: Date;
  };
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
  department: { type: String, required: true },
  city: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
  teamSize: { type: Number, required: true, min: 1, max: 4 },
});

const PaymentSchema = new Schema<Payment>({
  amount: { type: Number, required: true, default: 0 },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
    required: true,
  },
  updatedAt: { type: Date, required: true, default: Date.now },
});
const TeamSchema = new Schema(
  {
    teamId: { type: String, unique: true, required: true },
    teamLeader: { type: TeamLeaderSchema, required: true },
    teamMembers: [TeamMemberSchema],
    payment: { type: PaymentSchema, required: true }, // remove default
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
