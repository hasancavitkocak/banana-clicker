import React, { useState } from 'react';
import { User } from 'lucide-react';

interface UsernameInputProps {
  onSubmit: (username: string) => void;
}

export function UsernameInput({ onSubmit }: UsernameInputProps) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSubmit(username.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <User size={20} className="text-yellow-600" />
        <span className="font-semibold text-yellow-800">Enter Your Name</span>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your name"
          className="px-4 py-2 rounded-full border border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          maxLength={20}
          required
        />
        <button
          type="submit"
          className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full
            transform transition-all hover:scale-105 active:scale-95 focus:outline-none"
        >
          Save
        </button>
      </div>
    </form>
  );
}