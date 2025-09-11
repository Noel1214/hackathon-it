"use client";

import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    LogOut,
    Shield,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Clock,
    FileDown,
    Building,
} from "lucide-react";

interface TeamMember {
    _id?: string;
    name: string;
    email: string;
    phoneNumber: string;
}

interface TeamLeader {
    name: string;
    email: string;
    phoneNumber: string;
    city: string;
    college: string;
    department: string;
}

interface TeamData {
    _id: string;
    teamId: string;
    teamLeader: TeamLeader & { teamSize: number };
    teamMembers: TeamMember[];
    payment: {
        amount: string;
        status: string;
    };
}

interface Notice {
    _id: string;
    title: string;
    fileUrl: string;
}

export default function Dashboard() {
    const [tab, setTab] = useState("overview");
    const [team, setTeam] = useState<TeamData | null>(null);
    const [notices, setNotices] = useState<Notice[]>([]);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const [formData, setFormData] = useState<TeamLeader>({
        name: "",
        email: "",
        phoneNumber: "",
        city: "",
        college: "",
        department: "",
    });

    // ===== Fetch team =====
    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await fetch("/api/team", { credentials: "include" });
                if (!res.ok) throw new Error("Failed to fetch team");
                const data: TeamData[] = await res.json();

                // pick the first team (or filter by logged-in user if needed)
                const myTeam = data[0];
                if (!myTeam) throw new Error("Team not found");

                setTeam(myTeam);

                setFormData({
                    name: myTeam.teamLeader.name,
                    email: myTeam.teamLeader.email,
                    phoneNumber: myTeam.teamLeader.phoneNumber,
                    city: myTeam.teamLeader.city,
                    college: myTeam.teamLeader.college,
                    department: myTeam.teamLeader.department,
                });
            } catch (error: unknown) {
                console.error("❌ Error fetching team:", error);
                if (error instanceof Error) {
                    setAuthError(error.message || "Failed to load team");
                } else {
                    setAuthError("Failed to load team");
                }
            }
        };

        fetchTeam();
    }, []);

    // ===== Fetch notices =====
    useEffect(() => {
        const fetchNotices = async () => {
            const res = await fetch("/api/notices");
            if (res.ok) {
                const data: Notice[] = await res.json();
                setNotices(data);
            }
        };
        fetchNotices();
    }, []);

    // ===== Save edits =====
    const handleSave = async () => {
        if (!team) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/team/${team._id}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    teamLeader: formData,
                    teamMembers: team.teamMembers.map((m) => ({
                        name: m.name,
                        email: m.email,
                        phoneNumber: m.phoneNumber,
                    })),
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData?.error || "Update failed");
            }

            const { team: updatedTeam } = await res.json();
            setTeam(updatedTeam);
            setEditing(false);
            alert("Team updated successfully ✅");
        } catch (error: unknown) {
            console.error("❌ Error updating team:", error);
            if (error instanceof Error) {
                alert(error.message || "Failed to update team");
            } else {
                alert("Failed to update team");
            }
        } finally {
            setSaving(false);
        }
    };

    // ===== Logout =====
    const handleLogout = async () => {
        try {
            await fetch("/api/logout", { method: "POST" }).catch(() => { });
        } finally {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
    };

    const eventInfo = useMemo(
        () => [
            { icon: <Calendar className="mx-auto mb-2" />, title: "September 16", subtitle: "Event Date" },
            { icon: <Clock className="mx-auto mb-2" />, title: "6 Hours", subtitle: "Duration" },
            { icon: <Building className="mx-auto mb-2" />, title: "Sail Hall, St. Joseph's College", subtitle: "Venue" },
        ],
        []
    );

    // ===== Auth / Loading states =====
    if (authError) {
        return (
            <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-[#0c0c0f] text-purple-200 p-4">
                <p className="text-lg text-center">{authError}</p>
                <Button className="bg-purple-700 hover:bg-purple-600" onClick={() => (window.location.href = "/login")}>
                    Go to Login
                </Button>
            </div>
        );
    }

    if (!team) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0c0c0f] text-purple-400 p-4">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0c0c0f] text-gray-200 font-mono">
            {/* Navbar */}
            <header className="relative flex justify-between items-center p-4 border-b border-gray-800 bg-black/40 backdrop-blur-md z-20">
                <div className="flex items-center gap-3">
                    <Shield className="text-purple-500 w-6 h-6" />
                    <div className="sm:block">
                        <h1 className="text-base sm:text-lg font-bold text-white">Team Leader Portal</h1>
                        <p className="text-xs sm:text-sm text-gray-300">Welcome back, {team.teamLeader.name}</p>
                    </div>
                </div>
                <button
                    className="sm:flex items-center gap-2 text-sm text-gray-300 hover:text-purple-400 transition-colors"
                    onClick={handleLogout}
                    aria-label="Logout"
                >
                    <LogOut size={16} /> Logout
                </button>
            </header>

            <main className="max-w-6xl mx-auto p-4 sm:p-6">
                {/* Team Card */}
                <Card className="bg-gradient-to-r from-purple-950 via-black to-purple-900 border-purple-700/30 shadow-lg shadow-purple-800/30 mb-6">
                    <CardContent className="flex flex-col sm:flex-row justify-between items-center py-5 gap-4 sm:gap-0">
                        <div className="flex items-center gap-4">
                            <User className="text-purple-400 w-8 h-8 sm:w-10 sm:h-10" />
                            <div>
                                <h2 className="text-lg sm:text-xl font-semibold text-purple-400">{team.teamLeader.name}’s Team</h2>
                                <p className="text-xs sm:text-sm text-gray-400">Team ID: {team.teamId}</p>
                            </div>
                        </div>
                        <span className="bg-purple-700/80 px-3 py-1 rounded-full text-xs sm:text-sm text-white">
                            Confirmed
                        </span>
                    </CardContent>
                </Card>

                {/* Tabs */}
                <Tabs value={tab} onValueChange={setTab} className="w-full">
                    <TabsList className="bg-[#121214] border border-gray-800 w-full flex overflow-x-auto">
                        <TabsTrigger value="overview" className="flex-1 min-w-[100px] text-xs sm:text-sm text-white data-[state=active]:text-purple-400">Overview</TabsTrigger>
                        <TabsTrigger value="edit" className="flex-1 min-w-[100px] text-xs sm:text-sm text-white data-[state=active]:text-purple-400">Edit</TabsTrigger>
                        <TabsTrigger value="notices" className="flex-1 min-w-[100px] text-xs sm:text-sm text-white data-[state=active]:text-purple-400">Notices</TabsTrigger>
                    </TabsList>

                    {/* Overview */}
                    <TabsContent value="overview" className="mt-6 space-y-6">
                        {/* Leader & Members */}
                        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                            {/* Leader */}
                            <Card className="bg-[#121214] border-purple-800/40 hover:border-purple-500 transition">
                                <CardContent className="p-4 sm:p-5">
                                    <h3 className="text-lg font-bold mb-4 text-purple-400">Team Leader</h3>
                                    <p className="font-semibold text-white">{team.teamLeader.name}</p>
                                    <p className="flex items-center gap-2 text-sm sm:text-base text-gray-300 mt-2">
                                        <MapPin size={16} /> {team.teamLeader.college}, {team.teamLeader.department}, {team.teamLeader.city}
                                    </p>
                                    <p className="flex items-center gap-2 text-sm sm:text-base text-gray-300">
                                        <Phone size={16} /> {team.teamLeader.phoneNumber}
                                    </p>
                                    <p className="flex items-center gap-2 text-sm sm:text-base text-gray-300">
                                        <Mail size={16} /> {team.teamLeader.email}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Members */}
                            <Card className="bg-[#121214] border-purple-800/40 hover:border-purple-500 transition">
                                <CardContent className="p-4 sm:p-5">
                                    <h3 className="text-lg font-bold mb-4 text-purple-400">Team Members</h3>
                                    {team.teamMembers.length > 0 ? (
                                        <ul className="space-y-3 text-white">
                                            {team.teamMembers.map((m, idx) => (
                                                <li key={m._id || idx}>{m.name} - {m.phoneNumber}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">No team members added yet</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Payment Card */}
                        <Card className="bg-[#121214] border-purple-800/40 p-4 sm:p-6">
                            <CardContent className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-purple-400 mb-2">💰 Team Payment</h3>
                                    <p className="text-sm text-gray-300 mb-2">Registration fee per person: <span className="font-semibold text-white">₹200</span></p>
                                    <p className="text-sm text-gray-300 mb-2">Total team members: <span className="font-semibold text-white">{team.teamMembers.length + 1}</span></p>
                                    <p className="text-sm text-gray-300 mb-2">Total amount: <span className="font-semibold text-white">₹{(team.teamMembers.length + 1) * 200}</span></p>
                                    <p className="text-sm text-gray-300">
                                        Status:{" "}
                                        {team.payment?.status === "pending" && <span className="text-yellow-400 font-semibold">Pending</span>}
                                        {team.payment?.status === "approved" && <span className="text-green-400 font-semibold">Payment Successful ✅</span>}
                                        {team.payment?.status === "rejected" && <span className="text-red-400 font-semibold">Payment Failed ❌</span>}
                                    </p>
                                </div>
                                {team.payment?.status === "pending" && (
                                    <a
                                        href={`upi://pay?pa=rakeshjoe52@oksbi&pn=Rakesh%20Joe&am=${(team.teamMembers.length + 1) * 200}&cu=INR&tn=${team.teamId}`}
                                        className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded text-sm sm:text-base"
                                    >
                                        Pay via GPay
                                    </a>
                                )}
                                {team.payment?.status === "rejected" && (
                                    <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded text-sm sm:text-base">
                                        Retry Payment
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Event Info */}
                        <Card className="bg-[#121214] border-purple-800/40">
                            <CardContent className="p-4 sm:p-6 flex flex-col md:flex-row gap-4 sm:gap-6 text-center">
                                {eventInfo.map((item, idx) => (
                                    <div key={idx} className="p-2 flex-1">
                                        {item.icon && <div className="text-purple-400 mx-auto mb-2 flex justify-center">{item.icon}</div>}
                                        <p className="text-purple-400 font-bold text-sm sm:text-base">{item.title}</p>
                                        <p className="text-xs sm:text-sm text-gray-400">{item.subtitle}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Edit Tab */}
                    <TabsContent value="edit" className="mt-6">
                        <Card className="bg-[#121214] border-purple-800/40 p-4 sm:p-6">
                            <h3 className="text-lg font-bold text-purple-400 mb-4">✏️ Edit Team Details</h3>

                            {!editing ? (
                                <Button onClick={() => setEditing(true)} className="bg-purple-700 hover:bg-purple-600 w-full sm:w-auto">Start Editing</Button>
                            ) : (
                                <div className="space-y-6">
                                    {/* Leader */}
                                    <div>
                                        <h4 className="text-md font-semibold text-purple-300 mb-3">Leader Details</h4>
                                        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div className="sm:col-span-2">
                                                <label className="block text-sm text-gray-300 mb-1">Leader Name</label>
                                                <input className="w-full p-2 bg-black border border-purple-800 rounded text-white text-sm sm:text-base" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Full name" />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-300 mb-1">Email</label>
                                                <input className="w-full p-2 bg-black border border-purple-800 rounded text-white text-sm sm:text-base" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email" type="email" />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-300 mb-1">Phone</label>
                                                <input className="w-full p-2 bg-black border border-purple-800 rounded text-white text-sm sm:text-base" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} placeholder="Phone" type="tel" />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-300 mb-1">City</label>
                                                <input className="w-full p-2 bg-black border border-purple-800 rounded text-white text-sm sm:text-base" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="City" />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label className="block text-sm text-gray-300 mb-1">College</label>
                                                <input className="w-full p-2 bg-black border border-purple-800 rounded text-white text-sm sm:text-base" value={formData.college} onChange={(e) => setFormData({ ...formData, college: e.target.value })} placeholder="College" />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label className="block text-sm text-gray-300 mb-1">Department</label>
                                                <input className="w-full p-2 bg-black border border-purple-800 rounded text-white text-sm sm:text-base" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} placeholder="Department" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Team Members */}
                                    <div>
                                        <h4 className="text-md font-semibold text-purple-300 mb-3">Team Members</h4>
                                        {team.teamMembers.length > 0 ? (
                                            <div className="space-y-4">
                                                {team.teamMembers.map((member, idx) => (
                                                    <div key={member._id || idx} className="p-3 bg-black/30 rounded border border-purple-800/40">
                                                        <p className="text-sm text-purple-400 mb-2">Member {idx + 1}</p>
                                                        <input className="w-full p-2 mb-2 bg-black border border-purple-800 rounded text-white text-sm sm:text-base" value={member.name} onChange={(e) => {
                                                            const updated = [...team.teamMembers];
                                                            updated[idx] = { ...updated[idx], name: e.target.value };
                                                            setTeam({ ...team, teamMembers: updated });
                                                        }} placeholder="Full name" />
                                                        <input className="w-full p-2 mb-2 bg-black border border-purple-800 rounded text-white text-sm sm:text-base" value={member.email} onChange={(e) => {
                                                            const updated = [...team.teamMembers];
                                                            updated[idx] = { ...updated[idx], email: e.target.value };
                                                            setTeam({ ...team, teamMembers: updated });
                                                        }} placeholder="Email" type="email" />
                                                        <input className="w-full p-2 bg-black border border-purple-800 rounded text-white text-sm sm:text-base" value={member.phoneNumber} onChange={(e) => {
                                                            const updated = [...team.teamMembers];
                                                            updated[idx] = { ...updated[idx], phoneNumber: e.target.value };
                                                            setTeam({ ...team, teamMembers: updated });
                                                        }} placeholder="Phone" type="tel" />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500 italic">No members yet</p>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-3">
                                        <Button onClick={() => setEditing(false)} className="bg-gray-700 hover:bg-gray-600">Cancel</Button>
                                        <Button onClick={handleSave} disabled={saving} className="bg-purple-700 hover:bg-purple-600">
                                            {saving ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </TabsContent>

                    {/* Notices */}
                    <TabsContent value="notices" className="mt-6 space-y-4">
                        {notices.length === 0 && <p className="text-gray-400 text-sm">No notices yet</p>}
                        {notices.map((notice) => (
                            <Card key={notice._id} className="bg-[#121214] border-purple-800/40 hover:border-purple-500 transition">
                                <CardContent className="p-4 flex justify-between items-center">
                                    <p className="text-sm text-gray-200">{notice.title}</p>
                                    <a href={notice.fileUrl} target="_blank" className="text-purple-400 hover:text-purple-300 text-sm">Download</a>
                                </CardContent>
                            </Card>
                        ))}
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
