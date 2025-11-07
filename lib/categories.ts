// Category management and auto-tagging utilities

export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Food: ["restaurant", "uber eats", "mcdonald", "grocery", "walmart", "pizza", "coffee", "starbucks", "food", "dining"],
  Transport: ["uber", "lyft", "gas", "parking", "transit", "metro", "train", "bus", "taxi", "fuel"],
  Entertainment: ["netflix", "hulu", "spotify", "game", "movie", "theater", "concert", "cinema", "youtube"],
  Utilities: ["electric", "water", "gas bill", "internet", "phone", "utility", "bill"],
  Health: ["doctor", "pharmacy", "gym", "health", "medical", "hospital", "clinic", "fitness"],
  Shopping: ["amazon", "store", "mall", "shopping", "target", "costco", "retail", "purchase"],
  Rent: ["rent", "mortgage", "landlord", "lease", "accommodation"],
  Salary: ["salary", "paycheck", "bonus", "freelance", "income", "payment"],
  Other: [],
}

export const CATEGORIES = Object.keys(CATEGORY_KEYWORDS).filter((cat) => cat !== "Other")

// Auto-categorize a transaction based on description
export const autoCategorizeTransaction = (description: string): string => {
  const lowerDesc = description.toLowerCase()

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((keyword) => lowerDesc.includes(keyword))) {
      return category
    }
  }

  return "Other"
}

// Get category color
export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    Food: "#ef4444",
    Transport: "#f97316",
    Entertainment: "#8b5cf6",
    Utilities: "#3b82f6",
    Health: "#ec4899",
    Shopping: "#06b6d4",
    Rent: "#14b8a6",
    Salary: "#10b981",
    Other: "#6b7280",
  }
  return colors[category] || "#6b7280"
}

// Get category icon name
export const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    Food: "🍽️",
    Transport: "🚗",
    Entertainment: "🎬",
    Utilities: "💡",
    Health: "🏥",
    Shopping: "🛍️",
    Rent: "🏠",
    Salary: "💰",
    Other: "📝",
  }
  return icons[category] || "📝"
}
