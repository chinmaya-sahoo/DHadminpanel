import React, { useState } from "react";
import { Plus, Trash2, ToggleRight, ToggleLeft } from "lucide-react";

const Content = () => {
  const [banners, setBanners] = useState([
    { id: 1, text: "Diwali Offer - 50% Off", url: "https://via.placeholder.com/150", active: true },
    { id: 2, text: "New Feature: AI Support", url: "https://via.placeholder.com/150", active: false },
  ]);

  const [tutorials, setTutorials] = useState([
    { id: 1, title: "Getting Started", lang: "Hindi", url: "https://youtube.com/hindi-tutorial" },
    { id: 2, title: "Pro Tips", lang: "Marathi", url: "https://youtube.com/marathi-tutorial" },
  ]);

  const [features, setFeatures] = useState([
    { id: 1, name: "Advanced Mode", enabled: true },
    { id: 2, name: "Payment Gateway", enabled: false },
    { id: 3, name: "Chat Support", enabled: true },
  ]);

  // New Inputs
  const [newBanner, setNewBanner] = useState({ text: "", url: "" });
  const [newTutorial, setNewTutorial] = useState({ title: "", lang: "Hindi", url: "" });

  // Banner Management
  const addBanner = () => {
    if (!newBanner.text.trim() || !newBanner.url.trim()) return;
    setBanners([...banners, { id: Date.now(), ...newBanner, active: true }]);
    setNewBanner({ text: "", url: "" });
  };

  const toggleBanner = (id) => {
    setBanners(banners.map((b) => (b.id === id ? { ...b, active: !b.active } : b)));
  };

  const deleteBanner = (id) => {
    setBanners(banners.filter((b) => b.id !== id));
  };

  // Tutorial Management
  const addTutorial = () => {
    if (!newTutorial.title.trim() || !newTutorial.url.trim()) return;
    setTutorials([...tutorials, { id: Date.now(), ...newTutorial }]);
    setNewTutorial({ title: "", lang: "Hindi", url: "" });
  };

  const deleteTutorial = (id) => {
    setTutorials(tutorials.filter((t) => t.id !== id));
  };

  // Feature Flag Management
  const toggleFeature = (id) => {
    setFeatures(features.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">📑 Content Management</h2>

      {/* Banner Management */}
      <div className="bg-white shadow rounded-lg p-4 mb-8">
        <h3 className="text-xl font-semibold mb-4">📢 In-App Banners</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter banner text"
            className="border p-2 rounded w-1/3"
            value={newBanner.text}
            onChange={(e) => setNewBanner({ ...newBanner, text: e.target.value })}
          />
          <input
            type="url"
            placeholder="Enter image URL"
            className="border p-2 rounded w-1/2"
            value={newBanner.url}
            onChange={(e) => setNewBanner({ ...newBanner, url: e.target.value })}
          />
          <button
            onClick={addBanner}
            className="bg-blue-500 text-white px-3 py-2 rounded flex items-center gap-1"
          >
            <Plus size={16} /> Add
          </button>
        </div>
        <ul>
          {banners.map((b) => (
            <li key={b.id} className="flex justify-between items-center border-b py-2">
              <div className="flex items-center gap-3">
                <img src={b.url} alt="banner" className="w-16 h-12 rounded object-cover" />
                <span className={b.active ? "text-green-600" : "text-gray-500"}>{b.text}</span>
              </div>
              <div className="flex gap-3">
                <button onClick={() => toggleBanner(b.id)}>
                  {b.active ? <ToggleRight className="text-green-600" /> : <ToggleLeft className="text-gray-400" />}
                </button>
                <button onClick={() => deleteBanner(b.id)}>
                  <Trash2 className="text-red-500" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Tutorial Management */}
      <div className="bg-white shadow rounded-lg p-4 mb-8">
        <h3 className="text-xl font-semibold mb-4">🎥 Tutorials</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter tutorial title"
            className="border p-2 rounded w-1/4"
            value={newTutorial.title}
            onChange={(e) => setNewTutorial({ ...newTutorial, title: e.target.value })}
          />
          <select
            className="border p-2 rounded"
            value={newTutorial.lang}
            onChange={(e) => setNewTutorial({ ...newTutorial, lang: e.target.value })}
          >
            <option>Hindi</option>
            <option>Marathi</option>
          </select>
          <input
            type="url"
            placeholder="Enter video URL"
            className="border p-2 rounded w-1/2"
            value={newTutorial.url}
            onChange={(e) => setNewTutorial({ ...newTutorial, url: e.target.value })}
          />
          <button
            onClick={addTutorial}
            className="bg-blue-500 text-white px-3 py-2 rounded flex items-center gap-1"
          >
            <Plus size={16} /> Add
          </button>
        </div>
        <ul>
          {tutorials.map((t) => (
            <li key={t.id} className="flex justify-between items-center border-b py-2">
              <span>
                <b>{t.title}</b> ({t.lang}): {t.url}
              </span>
              <button onClick={() => deleteTutorial(t.id)}>
                <Trash2 className="text-red-500" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Feature Flags */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-xl font-semibold mb-4">⚙️ Feature Flags</h3>
        <ul>
          {features.map((f) => (
            <li key={f.id} className="flex justify-between items-center border-b py-2">
              <span>{f.name}</span>
              <button onClick={() => toggleFeature(f.id)}>
                {f.enabled ? <ToggleRight className="text-green-600" /> : <ToggleLeft className="text-gray-400" />}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Content;
