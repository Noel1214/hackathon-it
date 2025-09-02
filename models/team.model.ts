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

const TeamSchema = new Schema<TeamDocument>(
  {
    teamLeader: {
      name: { type: String, required: true },
      college: { type: String, required: true },
      city: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      email: { type: String, required: true },
      teamSize: { type: Number, required: true, min: 1, max: 4 },
    },
    teamMembers: [TeamMemberSchema],
  },
  { timestamps: true }
);

// Avoid OverwriteModelError in Next.js hot-reloads
const Team: Model<TeamDocument> =
  mongoose.models.Team || mongoose.model<TeamDocument>("Team", TeamSchema);

export default Team;
