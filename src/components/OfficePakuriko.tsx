"use client";

import { useState } from "react";
import { ThumbsUp } from "lucide-react";

export default function OfficePakuriko() {
  const [request, setRequest] = useState("");
  const [favSnack, setFavSnack] = useState("");

  const handleLike = async () => {
    try {
      const response = await fetch("/api/notify-slack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "like" }),
      });
      if (!response.ok) throw new Error("Failed to send like notification");
    } catch (error) {
      console.error("Error sending like notification:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/notify-slack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "submit", request, favSnack }),
      });
      if (!response.ok) throw new Error("Failed to send submission");
      setRequest("");
      setFavSnack("");
    } catch (error) {
      console.error("Error sending submission:", error);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md text-purple-500">
      <h1 className="text-2xl font-bold mb-6 text-center">OfficePakuriko</h1>

      <button
        onClick={handleLike}
        className="w-full mb-4 flex items-center justify-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        <ThumbsUp className="mr-2 h-4 w-4" /> いいね！
      </button>

      <textarea
        placeholder="要望を入力してください"
        value={request}
        onChange={(e) => setRequest(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded"
      />

      <input
        type="text"
        placeholder="気に入ったお菓子の名前"
        value={favSnack}
        onChange={(e) => setFavSnack(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded"
      />

      <button
        onClick={handleSubmit}
        disabled={!request && !favSnack}
        className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        送信
      </button>
    </div>
  );
}
