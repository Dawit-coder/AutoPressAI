"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const categories = [
  {
    id: "technology",
    name: "Technology",
    description: "Latest tech news and innovations",
  },
  {
    id: "business",
    name: "Business",
    description: "Business trends and market updates",
  },
  { id: "sports", name: "Sports", description: "Sports news and highlights" },
  {
    id: "entertainment",
    name: "Entertainment",
    description: "Movies, TV, and celebrity news",
  },
  {
    id: "science",
    name: "Science",
    description: "Scientific discoveries and research",
  },
  { id: "health", name: "Health", description: "Health and wellness updates" },
  {
    id: "politics",
    name: "Politics",
    description: "Political news and current events",
  },
  {
    id: "environment",
    name: "Environment",
    description: "Climate and environmental news",
  },
];

const frequencyOptions = [
  { id: "daily", name: "Daily", description: "Every day" },
  { id: "weekly", name: "Weekly", description: "Once a week" },
  { id: "biweekly", name: "Bi-weekly", description: "Twice a week" },
];

export default function SelectPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFrequency, setSelectedFrequency] = useState<string>("weekly");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCategories.length === 0) {
      alert("Please select at least one category");
      return;
    }

    if (!user) {
      alert("Please sign in to continue");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/user-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categories: selectedCategories,
          frequency: selectedFrequency,
          email: user.email,
        }),
      });

      if (!response.ok) throw new Error("Failed to save preferences");

      alert("Preferences saved! You'll start receiving newsletters soon.");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save preferences. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Customize Your Newsletter
          </h1>
          <p className="text-xl text-gray-400">
            Select your interests and delivery frequency
          </p>
        </div>

        {/* Main Form */}
        <form
          onSubmit={handleSavePreferences}
          className="bg-gray-950 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.05)] p-8 border border-gray-800"
        >
          {/* Categories Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
              Choose Categories
            </h2>
            <p className="text-gray-500 mb-6">
              Select at least 3 topics for your newsletter
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className={`relative p-4 rounded-xl border cursor-pointer transition-all 
                    ${
                      selectedCategories.includes(category.id)
                        ? "border-emerald-400 bg-gray-900 shadow-[0_0_15px_rgba(74,222,128,0.15)]"
                        : "border-gray-800 hover:border-gray-700 bg-gray-900/80 hover:bg-gray-900"
                    }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                  />
                  <div className="flex items-start">
                    <div
                      className={`mt-0.5 mr-3 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center 
                        ${
                          selectedCategories.includes(category.id)
                            ? "bg-emerald-500 border-emerald-500"
                            : "bg-gray-900 border-gray-600"
                        }`}
                    >
                      {selectedCategories.includes(category.id) && (
                        <svg
                          className="w-3 h-3 text-gray-950"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {category.name}
                      </div>
                      <div className="text-gray-500 text-sm mt-1">
                        {category.description}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Frequency Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
              Delivery Frequency
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {frequencyOptions.map((frequency) => (
                <label
                  key={frequency.id}
                  className={`p-4 rounded-xl border transition-all cursor-pointer
                    ${
                      selectedFrequency === frequency.id
                        ? "border-emerald-400 bg-gray-900 shadow-[0_0_15px_rgba(74,222,128,0.15)]"
                        : "border-gray-800 hover:border-gray-700 bg-gray-900/80"
                    }`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    name="frequency"
                    checked={selectedFrequency === frequency.id}
                    onChange={() => setSelectedFrequency(frequency.id)}
                  />
                  <div className="flex items-start">
                    <div
                      className={`mt-0.5 mr-3 flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center 
                        ${
                          selectedFrequency === frequency.id
                            ? "bg-emerald-500 border-emerald-500"
                            : "bg-gray-900 border-gray-600"
                        }`}
                    >
                      {selectedFrequency === frequency.id && (
                        <div className="w-2 h-2 bg-gray-950 rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {frequency.name}
                      </div>
                      <div className="text-gray-500 text-sm mt-1">
                        {frequency.description}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Area */}
          <div className="flex items-center justify-between border-t border-gray-800 pt-6">
            <div className="text-gray-500 text-sm">
              Selected: {selectedCategories.length} • {selectedFrequency}
            </div>
            <button
              type="submit"
              disabled={selectedCategories.length === 0 || isSaving}
              className={`px-6 py-3 rounded-xl font-medium text-white transition-all
                ${
                  selectedCategories.length === 0
                    ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-lg hover:shadow-emerald-500/30"
                }`}
            >
              {isSaving ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}