"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/admin/Header";
import { GlobalLoader } from "@/components/common/GlobalLoader";
import { useAuth } from "@/context/AuthContext";
import {
  Users,
  Plus,
  Search,
  Trash2,
  Edit2,
  X,
  UserCheck,
  CheckCircle2,
  ShieldCheck,
  Upload,
  Loader2,
  KeyRound,
  Phone,
  Mail,
  User as UserIcon,
  Image as ImageIcon,
} from "lucide-react";

export default function UsersPage() {
  const { getAuthHeaders } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalSaving, setGlobalSaving] = useState(false);
  const [loaderMsg, setLoaderMsg] = useState("Saving changes...");
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [addFormData, setAddFormData] = useState({
    name: "",
    email: "",
    password: "Password123!",
    phone: "",
    status: "active",
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "active",
    avatar: "",
    is2FAEnabled: true,
    password: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", { headers: getAuthHeaders() });
      if (res.ok) {
        const d = await res.json();
        setUsers(d.users || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  const handleOpenEdit = (u: any) => {
    setSelectedUser(u);
    setEditFormData({
      name: u.name || "",
      email: u.email || "",
      phone: u.phone || "",
      status: u.status || "active",
      avatar: u.avatar || "",
      is2FAEnabled: u.is2FAEnabled ?? true,
      password: "",
    });
    setShowEditModal(true);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setLoaderMsg("Uploading avatar to server...");
    setGlobalSaving(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        if (isEdit) {
          setEditFormData((prev) => ({ ...prev, avatar: data.url }));
        }
        showToast("Avatar uploaded successfully!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      setGlobalSaving(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoaderMsg("Creating new user account...");
    setGlobalSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(addFormData),
      });

      if (res.ok) {
        const d = await res.json();
        if (d.user) setUsers((prev) => [d.user, ...prev]);
        setShowAddModal(false);
        setAddFormData({ name: "", email: "", password: "Password123!", phone: "", status: "active" });
        showToast("User account created successfully!");
        fetchUsers();
      } else {
        const d = await res.json();
        alert(d.error || "Failed to create user.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGlobalSaving(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setLoaderMsg("Updating user details in MongoDB...");
    setGlobalSaving(true);

    const userId = selectedUser.id || selectedUser._id;
    const payload: any = {
      name: editFormData.name,
      email: editFormData.email,
      phone: editFormData.phone,
      role: "user",
      status: editFormData.status,
      avatar: editFormData.avatar,
      is2FAEnabled: editFormData.is2FAEnabled,
    };
    if (editFormData.password.trim() !== "") {
      payload.password = editFormData.password;
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const d = await res.json();
      if (res.ok && d.success) {
        setUsers((prev) =>
          prev.map((u) => ((u.id || u._id) === userId ? d.user : u))
        );
        setShowEditModal(false);
        showToast("User details updated successfully!");
        fetchUsers();
      } else {
        alert(d.error || "Failed to update user.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGlobalSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setLoaderMsg("Deleting user from MongoDB...");
    setGlobalSaving(true);
    const userId = selectedUser.id || selectedUser._id;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => (u.id || u._id) !== userId));
        setShowDeleteModal(false);
        showToast("User deleted successfully!");
        fetchUsers();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGlobalSaving(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    const map: any = {
      admin: "bg-purple-950 text-purple-400 border-purple-500/30",
      manager: "bg-blue-950 text-blue-400 border-blue-500/30",
      user: "bg-[#1E2230] text-[#D4AF37] border-[#D4AF37]/30",
    };
    return map[role] || map.user;
  };

  return (
    <div className="space-y-8">
      <GlobalLoader isLoading={globalSaving} message={loaderMsg} />

      <Header
        title="User Management Module"
        subtitle="Manage platform clients, agency accounts, access roles & status"
      />

      {toastMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Action Bar */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#D4AF37] to-[#AA771C] text-black font-extrabold text-xs shadow-gold-md hover:brightness-110 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Platform User
        </button>
      </div>

      {/* Users Table */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/15">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-[#D4AF37]" /> Registered Accounts ({filteredUsers.length})
          </h3>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-gray-400">Loading user accounts from MongoDB...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#D4AF37]/10 text-gray-400 uppercase font-semibold">
                  <th className="py-3 px-3">User</th>
                  <th className="py-3 px-3">Phone</th>
                  <th className="py-3 px-3">2FA</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4AF37]/10">
                {filteredUsers.map((u) => (
                  <tr key={u.id || u._id} className="hover:bg-[#181B2B]/60 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        {u.avatar ? (
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-9 h-9 rounded-full object-cover border-2 border-[#D4AF37]"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#1E2230] border-2 border-[#D4AF37]/40 flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-[#D4AF37]" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-white">{u.name}</div>
                          <div className="text-[10px] text-gray-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-gray-300">{u.phone || "—"}</td>
                    <td className="py-3.5 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${u.is2FAEnabled ? "bg-emerald-950 text-emerald-400 border-emerald-500/30" : "bg-gray-900 text-gray-500 border-gray-700"}`}>
                        {u.is2FAEnabled ? "ON" : "OFF"}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${u.status === "active" ? "bg-emerald-950 text-emerald-400 border-emerald-500/30" : "bg-red-950 text-red-400 border-red-500/30"}`}>
                        {u.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#181B2B] hover:bg-[#1E2230] border border-gray-700 text-gray-300 hover:text-white flex items-center gap-1 text-[11px] font-semibold"
                        >
                          <Edit2 className="w-3 h-3 text-[#D4AF37]" /> Edit
                        </button>
                        <button
                          onClick={() => { setSelectedUser(u); setShowDeleteModal(true); }}
                          className="p-1.5 rounded-lg bg-red-950/60 border border-red-500/30 text-red-400 hover:bg-red-900 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-[#D4AF37]/40 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#D4AF37]" /> Create New Account
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Gupta"
                  value={addFormData.name}
                  onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                  className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="aarav@brand.com"
                  value={addFormData.email}
                  onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                  className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Account Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={addFormData.password}
                  onChange={(e) => setAddFormData({ ...addFormData, password: e.target.value })}
                  className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Phone</label>
                <input
                  type="text"
                  placeholder="+91 98110 00000"
                  value={addFormData.phone}
                  onChange={(e) => setAddFormData({ ...addFormData, phone: e.target.value })}
                  className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-3 border-t border-[#D4AF37]/15 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#131622] text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#D4AF37] to-[#AA771C] text-black font-extrabold"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="glass-panel w-full max-w-lg p-6 rounded-2xl border border-[#D4AF37]/40 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-[#D4AF37]" /> Edit User (All Details)
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              {/* Avatar Section */}
              <div className="p-4 rounded-xl bg-[#0E1017] border border-[#D4AF37]/30 space-y-3">
                <label className="block text-white font-bold flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#D4AF37]" /> Avatar / Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  {editFormData.avatar ? (
                    <img src={editFormData.avatar} alt="Avatar" className="w-14 h-14 rounded-full object-cover border-2 border-[#D4AF37]" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[#1E2230] border-2 border-[#D4AF37]/30 flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleAvatarUpload(e, true)}
                      className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-lg px-2 py-1.5 text-xs text-gray-300 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-bold file:bg-[#D4AF37] file:text-black cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="Or paste avatar URL..."
                      value={editFormData.avatar}
                      onChange={(e) => setEditFormData({ ...editFormData, avatar: e.target.value })}
                      className="w-full bg-[#131622] border border-gray-700 rounded-lg px-2 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1 flex items-center gap-1">
                    <UserIcon className="w-3 h-3" /> Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+91 98110 00000"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Account Status</label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              {/* 2FA Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0E1017] border border-[#D4AF37]/20">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-white font-semibold">Two-Factor Authentication (2FA)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEditFormData((prev) => ({ ...prev, is2FAEnabled: !prev.is2FAEnabled }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${editFormData.is2FAEnabled ? "bg-[#D4AF37]" : "bg-gray-700"}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${editFormData.is2FAEnabled ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>

              {/* New Password (optional) */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1 flex items-center gap-1">
                  <KeyRound className="w-3 h-3" /> New Password <span className="text-gray-500 font-normal ml-1">(leave blank to keep current)</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter new password to change..."
                  value={editFormData.password}
                  onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                  className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-4 border-t border-[#D4AF37]/15 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#131622] text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#D4AF37] to-[#AA771C] text-black font-extrabold shadow-gold-md hover:brightness-110 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Save All Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-red-500/40 space-y-4">
            <h3 className="text-base font-bold text-red-400 flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Confirm User Deletion
            </h3>
            <p className="text-xs text-gray-300">
              Are you sure you want to permanently delete{" "}
              <span className="font-bold text-white">{selectedUser.name}</span>{" "}
              (<span className="text-gray-400">{selectedUser.email}</span>)? This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl bg-[#131622] text-gray-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-5 py-2 rounded-xl bg-red-600 text-white font-extrabold text-xs hover:bg-red-500"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
