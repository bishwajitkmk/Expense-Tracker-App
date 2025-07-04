import { useState, useRef, useEffect } from "react";
import { useSettings } from "../contexts/SettingsContext";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { SUBSCRIPTION_LOGOS } from "./SubscriptionLogos";

const COLORS = [
  "#2563eb",
  "#60a5fa",
  "#1e40af",
  "#93c5fd",
  "#3b82f6",
  "#1d4ed8",
  "#6366f1",
  "#8b5cf6",
];

const COMMON_PLATFORMS = [
  { name: "Netflix", icon: "🎮", plans: ["Basic", "Standard", "Premium"] },
  { name: "Hulu", icon: "📺", plans: ["Basic", "No Ads", "Live TV"] },
  { name: "Disney+", icon: "🧞", plans: ["Monthly", "Yearly"] },
  {
    name: "Amazon Prime",
    icon: "🛒",
    plans: ["Prime Video", "Prime Membership"],
  },
  { name: "Spotify", icon: "🎵", plans: ["Free", "Premium", "Family"] },
  { name: "YouTube Premium", icon: "▶️", plans: ["Premium", "Music"] },
  { name: "Apple TV+", icon: "🍏", plans: ["Monthly", "Yearly"] },
  { name: "HBO Max", icon: "🎥", plans: ["With Ads", "Ad-Free"] },
  { name: "Crunchyroll", icon: "🍥", plans: ["Fan", "Mega Fan"] },
  { name: "Ten Sports", icon: "🏏", plans: ["Monthly", "Yearly"] },
  { name: "ESPN+", icon: "🏈", plans: ["Monthly", "Yearly"] },
];

const PLATFORM_COLORS = {
  Netflix: "#e50914",
  Hulu: "#1ce783",
  "Disney+": "#113ccf",
  "Amazon Prime": "#00a8e1",
  Spotify: "#1db954",
  "YouTube Premium": "#ff0000",
  "Apple TV+": "#000000",
  "HBO Max": "#6f2da8",
  Crunchyroll: "#f47521",
  "Ten Sports": "#222222",
  "ESPN+": "#ffcc00",
};

export default function Subscriptions() {
  const { getCurrencySymbol, getFontSizeClass } = useSettings();
  const currencySymbol = getCurrencySymbol();

  const [subscriptions, setSubscriptions] = useState([]);
  const [subInput, setSubInput] = useState({
    service: "",
    plan: "",
    cost: "",
    billingCycle: "Monthly",
    renewalDate: "",
    paymentMethod: "",
    notes: "",
    profiles: [],
    icon: "",
  });
  const [editingIdx, setEditingIdx] = useState(null);
  const manualSectionRef = useRef(null);
  const firstManualInputRef = useRef(null);

  const handlePlatformCardClick = (platform) => {
    const newInput = {
      service: platform.name,
      plan: platform.plans[0] || "",
      cost: "",
      billingCycle: "Monthly",
      renewalDate: "",
      paymentMethod: "",
      notes: "",
      profiles: [],
      icon: platform.icon,
    };
    setSubInput(newInput);
    setEditingIdx(null);
  };

  useEffect(() => {
    if (
      subInput.service &&
      firstManualInputRef.current &&
      manualSectionRef.current
    ) {
      manualSectionRef.current.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        firstManualInputRef.current.focus();
      }, 50);
    }
  }, [subInput.service]);

  const handleSubInput = (field, value) =>
    setSubInput((s) => ({ ...s, [field]: value }));

  const addOrEditSubscription = () => {
    if (
      !subInput.service ||
      !subInput.cost ||
      !subInput.renewalDate ||
      !subInput.billingCycle ||
      !subInput.paymentMethod
    ) {
      return;
    }
    if (editingIdx !== null) {
      setSubscriptions((subs) =>
        subs.map((s, i) =>
          i === editingIdx
            ? { ...subInput, cost: parseFloat(subInput.cost) }
            : s
        )
      );
      setEditingIdx(null);
    } else {
      setSubscriptions([
        ...subscriptions,
        { ...subInput, cost: parseFloat(subInput.cost) },
      ]);
    }
    setSubInput({
      service: "",
      plan: "",
      cost: "",
      billingCycle: "Monthly",
      renewalDate: "",
      paymentMethod: "",
      notes: "",
      profiles: [],
      icon: "",
    });
  };

  const editSubscription = (idx) => {
    setEditingIdx(idx);
    setSubInput({
      ...subscriptions[idx],
      cost: subscriptions[idx].cost.toString(),
    });
  };

  const removeSubscription = (idx) =>
    setSubscriptions((subs) => subs.filter((_, i) => i !== idx));

  const totalMonthly = subscriptions
    .filter((s) => s.billingCycle === "Monthly")
    .reduce((sum, s) => sum + (s.cost || 0), 0);

  const totalYearly = subscriptions
    .filter((s) => s.billingCycle === "Yearly")
    .reduce((sum, s) => sum + (s.cost || 0), 0);

  const pieData = subscriptions.map((s) => ({
    name: s.icon ? `${s.icon} ${s.service}` : s.service,
    value: s.cost,
  }));

  const isSoonToRenew = (dateStr) => {
    if (!dateStr) return false;
    const today = new Date();
    const renew = new Date(dateStr);
    const diff = (renew - today) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  };

  return (
    <div className={`p-8 min-h-screen ${getFontSizeClass()}`}>
      <div className="max-w-4xl mx-auto space-y-10">
        <div>
          <h2 className="text-2xl font-bold mb-4">Popular Platforms</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {COMMON_PLATFORMS.map((platform) => {
              const bgColor = PLATFORM_COLORS[platform.name] || "#2563eb";
              return (
                <button
                  key={platform.name}
                  onClick={() => handlePlatformCardClick(platform)}
                  className="relative rounded-2xl h-32 flex items-center justify-center shadow-lg transition-transform duration-200 border-2 border-transparent group focus:outline-none focus:ring-4 focus:ring-blue-300"
                  style={{ backgroundColor: bgColor }}
                >
                  {SUBSCRIPTION_LOGOS[platform.name] ? (
                    <img
                      src={SUBSCRIPTION_LOGOS[platform.name]}
                      alt={platform.name + " logo"}
                      style={{
                        width: platform.name === "Amazon Prime" ? 80 : 56,
                        height: platform.name === "Amazon Prime" ? 80 : 56,
                        objectFit: "contain",
                        filter: ["Netflix", "Disney+", "Apple TV+"].includes(
                          platform.name
                        )
                          ? "brightness(0) invert(1)"
                          : platform.name === "Hulu"
                          ? "drop-shadow(0 2px 8px #000a)"
                          : ["Spotify", "HBO Max"].includes(platform.name)
                          ? "drop-shadow(0 2px 8px #000a)"
                          : undefined,
                        zIndex: 2,
                        borderRadius: 16,
                        background: "transparent",
                      }}
                    />
                  ) : (
                    <span className="text-4xl">{platform.icon}</span>
                  )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-white rounded-2xl opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-10">
                    <div className="text-lg font-bold mb-1">
                      {platform.name}
                    </div>
                    <div className="text-xs mb-1">
                      {platform.plans.join(", ")}
                    </div>
                    <div className="text-xs opacity-80 text-center px-2">
                      {platform.name === "Netflix" &&
                        "Stream movies & TV shows. Plans: Basic, Standard, Premium."}
                      {platform.name === "Hulu" &&
                        "Live and on-demand TV and movies. Plans: Basic, No Ads, Live TV."}
                      {platform.name === "Disney+" &&
                        "Disney, Pixar, Marvel, Star Wars, and more."}
                      {platform.name === "Amazon Prime" &&
                        "Prime Video streaming and more."}
                      {platform.name === "Spotify" &&
                        "Music streaming. Free, Premium, Family."}
                      {platform.name === "YouTube Premium" &&
                        "Ad-free YouTube & Music."}
                      {platform.name === "Apple TV+" &&
                        "Apple Originals. Monthly, Yearly."}
                      {platform.name === "HBO Max" &&
                        "Movies, series, and more. With Ads, Ad-Free."}
                      {platform.name === "Crunchyroll" &&
                        "Anime streaming. Fan, Mega Fan."}
                      {platform.name === "Ten Sports" &&
                        "Live sports streaming."}
                      {platform.name === "ESPN+" &&
                        "Live sports, originals, and more."}
                    </div>
                  </div>
                  <style>{`
                    .group:hover { transform: scale(1.045); box-shadow: 0 10px 32px 0 rgba(0,0,0,0.16), 0 2px 8px 0 rgba(0,0,0,0.10); }
                  `}</style>
                </button>
              );
            })}
          </div>
        </div>

        <div
          ref={manualSectionRef}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100"
        >
          <h2 className="text-xl font-bold mb-4 text-blue-900">
            Add / Edit Subscription
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service
              </label>
              <input
                ref={firstManualInputRef}
                value={subInput.service}
                onChange={(e) => handleSubInput("service", e.target.value)}
                placeholder="Service"
                className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plan
              </label>
              <input
                value={subInput.plan}
                onChange={(e) => handleSubInput("plan", e.target.value)}
                placeholder="Plan"
                className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost
              </label>
              <input
                type="number"
                value={subInput.cost}
                onChange={(e) => handleSubInput("cost", e.target.value)}
                placeholder="Cost"
                className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing Cycle
              </label>
              <select
                value={subInput.billingCycle}
                onChange={(e) => handleSubInput("billingCycle", e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-200"
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Renewal Date
              </label>
              <input
                type="date"
                value={subInput.renewalDate}
                onChange={(e) => handleSubInput("renewalDate", e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <input
                value={subInput.paymentMethod}
                onChange={(e) =>
                  handleSubInput("paymentMethod", e.target.value)
                }
                placeholder="Payment Method"
                className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <input
                value={subInput.notes}
                onChange={(e) => handleSubInput("notes", e.target.value)}
                placeholder="Notes"
                className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={addOrEditSubscription}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
            >
              {editingIdx !== null ? "Update" : "Add"}
            </button>
            <button
              onClick={() =>
                setSubInput({
                  service: "",
                  plan: "",
                  cost: "",
                  billingCycle: "Monthly",
                  renewalDate: "",
                  paymentMethod: "",
                  notes: "",
                  profiles: [],
                  icon: "",
                })
              }
              className="bg-gray-200 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Clear
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2 text-blue-900">
            Your Subscriptions
          </h2>
          {subscriptions.length === 0 ? (
            <p className="text-gray-500">No subscriptions yet.</p>
          ) : (
            <ul className="space-y-4">
              {subscriptions.map((sub, idx) => (
                <li
                  key={idx}
                  className="border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-white shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    {SUBSCRIPTION_LOGOS[sub.service] ? (
                      <img
                        src={SUBSCRIPTION_LOGOS[sub.service]}
                        alt={sub.service + " logo"}
                        style={{
                          width: 36,
                          height: 36,
                          objectFit: "contain",
                          borderRadius: 8,
                          background: "transparent",
                        }}
                      />
                    ) : (
                      <span className="text-2xl">{sub.icon}</span>
                    )}
                    <span className="font-bold text-gray-900">
                      {sub.service}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {sub.plan}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({sub.billingCycle})
                    </span>
                    {sub.renewalDate && (
                      <span
                        className={`ml-2 px-2 py-1 text-xs rounded ${
                          isSoonToRenew(sub.renewalDate)
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        Renews: {sub.renewalDate}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-700">
                      {currencySymbol}
                      {sub.cost.toLocaleString()}
                    </span>
                    <button
                      onClick={() => editSubscription(idx)}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeSubscription(idx)}
                      className="text-red-600 hover:underline font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-100 text-blue-900 p-4 rounded-lg">
            <p className="text-sm">Total Monthly Cost</p>
            <p className="text-2xl font-bold">
              {currencySymbol}
              {totalMonthly.toLocaleString()}
            </p>
          </div>
          <div className="bg-purple-100 text-purple-900 p-4 rounded-lg">
            <p className="text-sm">Total Yearly Cost</p>
            <p className="text-2xl font-bold">
              {currencySymbol}
              {totalYearly.toLocaleString()}
            </p>
          </div>
        </div>

        {pieData.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Cost Breakdown</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
