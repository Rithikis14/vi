import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";

type User = {
  id: number;
  username: string;
  points: number;
};

export function Leaderboard() {
  // Initial users (could come from backend / context)
  const [users, setUsers] = useState<User[]>([
    { id: 1, username: "Alice", points: 250 },
    { id: 2, username: "Bob", points: 180 },
    { id: 3, username: "Charlie", points: 300 },
    { id: 4, username: "David", points: 120 },
    { id: 5, username: "Eva", points: 200 },
  ]);

  // Always sort users by points (descending)
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  // Example: Add new user (simulates "new login")
  const addUser = () => {
    const newUser: User = {
      id: users.length + 1,
      username: `User${users.length + 1}`,
      points: Math.floor(Math.random() * 400), // random points
    };
    setUsers((prev) => [...prev, newUser]); // add at bottom → sorting fixes rank
  };

  // Example: Update points of random user
  const updatePoints = () => {
    setUsers((prev) =>
      prev.map((user) =>
        Math.random() > 0.7
          ? { ...user, points: user.points + Math.floor(Math.random() * 50) }
          : user
      )
    );
  };

  // Auto update points every 10s (simulating live leaderboard)
  useEffect(() => {
    const interval = setInterval(updatePoints, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          🏆 Leaderboard
        </h1>

        <div className="overflow-hidden bg-white shadow rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-green-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Points
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className={`${
                    index === 0
                      ? "bg-yellow-100"
                      : index === 1
                      ? "bg-gray-100"
                      : index === 2
                      ? "bg-orange-100"
                      : "bg-white"
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


      </div>
    </div>
  );
}
