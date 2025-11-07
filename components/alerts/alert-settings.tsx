"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Bell, Save } from "lucide-react"

export interface AlertSettings {
  enabled: boolean
  dailyLimit: number
  warnPercentage: number
}

interface AlertSettingsProps {
  settings: AlertSettings
  onSaveSettings: (settings: AlertSettings) => void
}

export default function AlertSettingsComponent({ settings, onSaveSettings }: AlertSettingsProps) {
  const [formData, setFormData] = useState(settings)
  const [saved, setSaved] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseFloat(value) : value,
    }))
    setSaved(false)
  }

  const handleToggle = () => {
    setFormData((prev) => ({
      ...prev,
      enabled: !prev.enabled,
    }))
    setSaved(false)
  }

  const handleSave = () => {
    if (formData.dailyLimit <= 0) {
      alert("Daily limit must be greater than 0")
      return
    }
    if (formData.warnPercentage < 0 || formData.warnPercentage > 100) {
      alert("Warning percentage must be between 0 and 100")
      return
    }
    onSaveSettings(formData)
    setSaved(true)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-700/50 border-slate-600 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Bell className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Daily Expense Alerts</h3>
              <p className="text-sm text-slate-400">Get notified when you exceed your daily spending limit</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
            <div>
              <p className="font-semibold text-white mb-1">Enable Alerts</p>
              <p className="text-sm text-slate-400">Turn daily expense alerts on or off</p>
            </div>
            <Switch checked={formData.enabled} onCheckedChange={handleToggle} />
          </div>

          {/* Daily Limit Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Daily Spending Limit ($)</label>
            <Input
              type="number"
              name="dailyLimit"
              placeholder="100.00"
              step="0.01"
              min="0"
              value={formData.dailyLimit}
              onChange={handleChange}
              disabled={!formData.enabled}
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 disabled:opacity-50"
            />
            <p className="text-xs text-slate-400 mt-2">You will be alerted once you exceed this daily limit</p>
          </div>

          {/* Warning Threshold */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Warning Threshold (%)</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                name="warnPercentage"
                placeholder="75"
                step="5"
                min="0"
                max="100"
                value={formData.warnPercentage}
                onChange={handleChange}
                disabled={!formData.enabled}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 disabled:opacity-50"
              />
              <span className="text-slate-400">%</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Receive a warning when you've spent {formData.warnPercentage}% of your daily limit
            </p>
          </div>

          {/* Summary */}
          <div className="p-4 bg-slate-800 rounded-lg border border-slate-600">
            <p className="text-sm text-slate-300 mb-2">Alert Summary:</p>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Status: {formData.enabled ? "Enabled" : "Disabled"}</li>
              <li>• Daily Limit: ${formData.dailyLimit.toFixed(2)}</li>
              <li>• Warning at: ${(formData.dailyLimit * (formData.warnPercentage / 100)).toFixed(2)}</li>
            </ul>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 rounded-lg transition-all"
          >
            <Save className="w-4 h-4 mr-2" />
            {saved ? "Settings Saved!" : "Save Settings"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
