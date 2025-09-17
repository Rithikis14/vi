import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, LogOut, User, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-[#c6ecd9] shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-gray-900">EcoLearn</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/courses"
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              Courses
            </Link>
            <Link
              to="/challenges"
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              Daily Challenges
            </Link>
            <Link
              to="/games"
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              Games
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-1 rounded-full">
                <Award className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  {user.points} pts
                </span>
              </div>
            )}
            <Link
              to="/profile"
              className="p-2 text-gray-700 hover:text-green-600 transition-colors"
            >
              <User className="h-5 w-5" />
            </Link>
            <button
              onClick={logout}
              className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}