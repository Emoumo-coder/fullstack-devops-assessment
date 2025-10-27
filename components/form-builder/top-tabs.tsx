"use client"

interface TopTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function TopTabs({ activeTab, onTabChange }: TopTabsProps) {
  const tabs = [
    { id: "details", label: "Details" },
    { id: "identities", label: "Identities" },
    { id: "builder", label: "Builder" },
    { id: "settings", label: "Settings" },
    { id: "embed", label: "Embed" },
    { id: "theme", label: "Theme" },
    { id: "pdf", label: "PDF Filler" },
    { id: "api", label: "API Mappings" },
    { id: "workflow", label: "Workflow" },
    { id: "digest", label: "Digest" },
  ]

  return (
    <div className="border-b bg-white px-6 flex items-center gap-8 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === tab.id
              ? "border-teal-600 text-teal-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
