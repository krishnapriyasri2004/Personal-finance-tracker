"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Users, Plus, Trash2, PieChart } from "lucide-react"

export interface FamilyMember {
  id: string
  name: string
  email: string
  role: "primary" | "secondary"
  joinDate: string
  color: string
}

interface FamilyMemberManagerProps {
  members: FamilyMember[]
  onAddMember: (member: Omit<FamilyMember, "id">) => void
  onRemoveMember: (memberId: string) => void
}

const COLORS = [
  "#14b8a6", // teal
  "#06b6d4", // cyan
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#f59e0b", // amber
  "#ef4444", // red
]

export default function FamilyMemberManager({ members, onAddMember, onRemoveMember }: FamilyMemberManagerProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "secondary" as "primary" | "secondary",
  })
  const [selectedColor, setSelectedColor] = useState(COLORS[0])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddMember = () => {
    if (!formData.name || !formData.email) {
      alert("Please fill in all fields")
      return
    }

    if (members.some((m) => m.email === formData.email)) {
      alert("This email is already added")
      return
    }

    onAddMember({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      joinDate: new Date().toISOString().split("T")[0],
      color: selectedColor,
    })

    setFormData({ name: "", email: "", role: "secondary" })
    setSelectedColor(COLORS[0])
  }

  return (
    <div className="space-y-6">
      {/* Add Member Form */}
      <Card className="bg-slate-700/50 border-slate-600 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Family Members</h3>
            <p className="text-sm text-slate-400">Manage your family finances together</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Member Name</label>
              <Input
                type="text"
                name="name"
                placeholder="John Smith"
                value={formData.name}
                onChange={handleChange}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <Input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="secondary">Secondary</option>
                <option value="primary">Primary</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Color Tag</label>
              <div className="flex gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color ? "border-white scale-110" : "border-slate-600"
                    }`}
                    style={{ backgroundColor: color }}
                    title={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <Button
            onClick={handleAddMember}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-2 rounded-lg transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Family Member
          </Button>
        </div>
      </Card>

      {/* Members List */}
      <Card className="bg-slate-700/50 border-slate-600 p-6">
        <h3 className="text-2xl font-bold text-white mb-6">Active Members ({members.length})</h3>

        {members.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No family members added yet. Add one to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-semibold flex items-center gap-2">
                      {member.name}
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          member.role === "primary"
                            ? "bg-purple-500/30 text-purple-300"
                            : "bg-slate-600/50 text-slate-300"
                        }`}
                      >
                        {member.role === "primary" ? "Owner" : "Member"}
                      </span>
                    </p>
                    <p className="text-sm text-slate-400">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Joined {member.joinDate}</span>
                  {member.role !== "primary" && (
                    <Button
                      onClick={() => onRemoveMember(member.id)}
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-300 hover:bg-red-500/20 hover:border-red-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Family Stats */}
      {members.length > 0 && (
        <Card className="bg-slate-700/50 border-slate-600 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Family Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Total Members</p>
              <p className="text-3xl font-bold text-purple-400">{members.length}</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Owner</p>
              <p className="text-lg font-semibold text-white">
                {members.find((m) => m.role === "primary")?.name || "N/A"}
              </p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Contributors</p>
              <p className="text-3xl font-bold text-emerald-400">
                {members.filter((m) => m.role === "secondary").length}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
