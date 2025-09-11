"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, MapPin, Phone, Mail, Pencil } from "lucide-react";

interface TeamMember {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
}

interface TeamData {
    _id: string;
    teamId: string;
    teamLeader: {
        name: string;
        college: string;
        department: string;
        city: string;
        phoneNumber: string;
        email: string;
        teamSize: number;
    };
    teamMembers: TeamMember[];
    payment: {
        amount: number;
        status: "pending" | "approved" | "rejected";
        updatedAt: string;
    };
}

export default function AdminDashboard() {
    const [teams, setTeams] = useState<TeamData[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [editingTeam, setEditingTeam] = useState<TeamData | null>(null);
    const [formData, setFormData] = useState<TeamData | null>(null);


    // preload form when opening edit
    useEffect(() => {
        if (editingTeam) {
            setFormData(editingTeam);
        }
    }, [editingTeam]);

    const fetchTeams = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/teams");
            const data = await res.json();
            setTeams(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const handleSaveEdit = async () => {
        if (!editingTeam) return;

        try {
            const res = await fetch(`/api/admin/teams/${editingTeam._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                await fetchTeams(); // refresh list
                setEditingTeam(null); // close modal
            } else {
                console.error("Failed to update team");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handlePayment = async (
        teamId: string,
        action: "approve" | "reject"
    ) => {
        setActionLoading(teamId);
        try {
            const res = await fetch(`/api/admin/payment/${teamId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action }),
            });
            if (res.ok) fetchTeams();
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center text-purple-400">
                Loading...
            </div>
        );

    return (
        <div className="min-h-screen bg-[#0c0c0f] text-gray-200 p-6">
            <h1 className="text-2xl font-bold text-purple-400 mb-6">
                Admin Dashboard
            </h1>

            <div className="grid gap-6">
                {teams.length === 0 && <p>No teams registered yet.</p>}

                {teams.map((team) => (
                    <Card
                        key={team._id}
                        className="bg-[#121214] border-purple-800/40"
                    >
                        <CardContent className="p-4 sm:p-6 space-y-4">
                            {/* Team Header */}
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-purple-400">
                                    {team.teamLeader.name}’s Team ({team.teamId})
                                </h2>

                                <div className="flex items-center gap-2">
                                    <span
                                        className={`px-3 py-1 rounded-full text-white ${team.payment.status === "pending"
                                            ? "bg-yellow-500"
                                            : team.payment.status === "approved"
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                            }`}
                                    >
                                        {team.payment.status.toUpperCase()}
                                    </span>

                                    {/* ✏️ Edit button */}
                                    <button
                                        onClick={() => setEditingTeam(team)}
                                        className="p-2 rounded-full bg-purple-600/30 hover:bg-purple-600"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Leader Details */}
                            <div className="grid sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <p className="flex items-center text-white gap-2">
                                        <User size={16} /> {team.teamLeader.name}
                                    </p>
                                    <p className="flex items-center gap-2 text-gray-300 text-sm">
                                        <MapPin size={16} /> {team.teamLeader.college},<br /> {team.teamLeader.department}, <br />
                                        {team.teamLeader.city}
                                    </p>

                                    <p className="flex items-center gap-2 text-gray-300 text-sm">
                                        <Phone size={16} /> {team.teamLeader.phoneNumber}
                                    </p>
                                    <p className="flex items-center gap-2 text-gray-300 text-sm">
                                        <Mail size={16} /> {team.teamLeader.email}
                                    </p>
                                </div>

                                {/* Members */}
                                <div className="space-y-1">
                                    <h4 className="text-purple-300 font-semibold">
                                        Team Members
                                    </h4>
                                    {team.teamMembers.length > 0 ? (
                                        <ul className="text-sm text-gray-200">
                                            {team.teamMembers.map((m, idx) => (
                                                <li key={m._id}>
                                                    {idx + 1}. {m.name} - {m.phoneNumber}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-400 italic">No members added</p>
                                    )}
                                </div>
                            </div>

                            {/* Payment Actions */}
                            {team.payment.status === "pending" && (
                                <div className="flex gap-3 mt-3">
                                    <Button
                                        onClick={() => handlePayment(team._id, "approve")}
                                        className="bg-green-600 hover:bg-green-500"
                                        disabled={actionLoading === team._id}
                                    >
                                        {actionLoading === team._id
                                            ? "Processing..."
                                            : "Approve Payment"}
                                    </Button>
                                    <Button
                                        onClick={() => handlePayment(team._id, "reject")}
                                        className="bg-red-600 hover:bg-red-500"
                                        disabled={actionLoading === team._id}
                                    >
                                        {actionLoading === team._id
                                            ? "Processing..."
                                            : "Reject Payment"}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}

                {/* ✅ Edit Modal outside the map */}
                {editingTeam && formData && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
                        <div className="bg-[#121214] p-6 rounded-xl w-full max-w-lg text-gray-200">
                            <h2 className="text-lg font-bold mb-4 text-purple-400">
                                Edit Team – {editingTeam.teamId}
                            </h2>

                            <div className="space-y-3">
                                {/* Leader Name */}
                                <input
                                    className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                                    value={formData.teamLeader?.name || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            teamLeader: {
                                                ...formData.teamLeader,
                                                name: e.target.value,
                                            },
                                        })
                                    }
                                    placeholder="Leader Name"
                                />

                                {/* Leader College */}
                                <input
                                    className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                                    value={formData.teamLeader?.college || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            teamLeader: {
                                                ...formData.teamLeader,
                                                college: e.target.value,
                                            },
                                        })
                                    }
                                    placeholder="College"
                                />

                                {/* Leader Phone */}
                                <input
                                    className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                                    value={formData.teamLeader?.phoneNumber || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            teamLeader: {
                                                ...formData.teamLeader,
                                                phoneNumber: e.target.value,
                                            },
                                        })
                                    }
                                    placeholder="Phone Number"
                                />

                                {/* Team Members */}
                                <div>
                                    <h4 className="text-purple-300 font-semibold mb-2">
                                        Team Members
                                    </h4>
                                    {formData.teamMembers?.map(
                                        (m: TeamMember, idx: number) => (
                                            <input
                                                key={m._id || idx}
                                                className="w-full p-2 mb-2 rounded bg-gray-800 border border-gray-600"
                                                value={m.name || ""}
                                                onChange={(e) => {
                                                    const newMembers = [...formData.teamMembers];
                                                    newMembers[idx].name = e.target.value;
                                                    setFormData({
                                                        ...formData,
                                                        teamMembers: newMembers,
                                                    });
                                                }}
                                                placeholder={`Member ${idx + 1} Name`}
                                            />
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3 mt-6">
                                <Button variant="ghost" onClick={() => setEditingTeam(null)}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSaveEdit}
                                    className="bg-purple-600 hover:bg-purple-500"
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
