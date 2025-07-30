import React, { useState, useRef, useEffect } from "react";

const EMOJI_CATEGORIES = {
  "😀": ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇"],
  "😍": ["😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜"],
  "😎": ["😎", "🤓", "🧐", "😏", "😒", "😞", "😔", "😟", "😕", "🙁"],
  "😭": ["😭", "😢", "😦", "😧", "😨", "😩", "🥺", "😬", "😰", "😱"],
  "😡": ["😡", "😠", "🤬", "😈", "👿", "💀", "☠️", "💩", "🤡", "👹"],
  "👋": ["👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞"],
  "❤️": ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔"],
  "🎉": ["🎉", "🎊", "🎈", "🎂", "🎁", "🎄", "🎃", "🎗️", "🎟️", "🎫"]
};

const EmojiPicker = ({ onEmojiSelect, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState("😀");
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleEmojiClick = (emoji) => {
    onEmojiSelect(emoji);
    onClose();
  };

  return (
    <div
      ref={pickerRef}
      className="absolute bottom-full mb-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4 z-50"
    >
      {/* Category Tabs */}
      <div className="flex space-x-2 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
        {Object.keys(EMOJI_CATEGORIES).map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`p-2 rounded-lg transition-colors ${
              selectedCategory === category
                ? "bg-blue-100 dark:bg-blue-900"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <span className="text-lg">{category}</span>
          </button>
        ))}
      </div>

      {/* Emoji Grid */}
      <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto">
        {EMOJI_CATEGORIES[selectedCategory].map((emoji, index) => (
          <button
            key={index}
            onClick={() => handleEmojiClick(emoji)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-lg"
            title={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker; 