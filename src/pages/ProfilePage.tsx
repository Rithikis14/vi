import React, { useState } from 'react';
import { User, Award, Upload, BookOpen, Target, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const progressData = [
  { month: 'Jan', completed: 2, target: 5 },
  { month: 'Feb', completed: 4, target: 5 },
  { month: 'Mar', completed: 3, target: 5 },
  { month: 'Apr', completed: 5, target: 5 },
  { month: 'May', completed: 6, target: 6 },
  { month: 'Jun', completed: 4, target: 6 },
];

const pointsData = [
  { week: 'Week 1', points: 45 },
  { week: 'Week 2', points: 65 },
  { week: 'Week 3', points: 30 },
  { week: 'Week 4', points: 80 },
  { week: 'Week 5', points: 95 },
  { week: 'Week 6', points: 55 },
];

export function ProfilePage() {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover mx-auto"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                      <User className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="profile-upload"
                  />
                  <label
                    htmlFor="profile-upload"
                    className="absolute bottom-0 right-0 bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-green-700 transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                  </label>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 mt-4">
                  {user.full_name}
                </h1>
                <p className="text-gray-600">{user.email}</p>
                
                {user.user_type === 'school' && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">{user.institution_name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.institution_type}</p>
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Total Points</span>
                  <div className="flex items-center text-yellow-600">
                    <Award className="h-5 w-5 mr-1" />
                    <span className="text-xl font-bold">{user.points}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Member since</span>
                    <span className="text-gray-900">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Account type</span>
                    <span className="text-gray-900 capitalize">{user.user_type}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-gray-600">Articles Read</span>
                  </div>
                  <span className="font-semibold">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Target className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-gray-600">Challenges Completed</span>
                  </div>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-purple-600 mr-2" />
                    <span className="text-gray-600">Current Streak</span>
                  </div>
                  <span className="font-semibold">5 days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Learning Progress */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Learning Progress
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completed" fill="#10B981" name="Completed" />
                    <Bar dataKey="target" fill="#E5E7EB" name="Target" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Monthly progress showing completed courses vs targets
              </p>
            </div>

            {/* Points History */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Points History
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pointsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="points" 
                      stroke="#EAB308" 
                      strokeWidth={3}
                      dot={{ r: 6, fill: '#EAB308' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Weekly points earned from challenges and course completion
              </p>
            </div>

            {/* Achievement Badges */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Achievements
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-3xl mb-2">🌟</div>
                  <h4 className="font-medium text-gray-900">First Step</h4>
                  <p className="text-xs text-gray-600">Completed first course</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl mb-2">♻️</div>
                  <h4 className="font-medium text-gray-900">Eco Warrior</h4>
                  <p className="text-xs text-gray-600">5 challenges completed</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl mb-2">📚</div>
                  <h4 className="font-medium text-gray-900">Bookworm</h4>
                  <p className="text-xs text-gray-600">Read 20 articles</p>
                </div>
                <div className="text-center p-4 bg-gray-100 rounded-lg opacity-60">
                  <div className="text-3xl mb-2">🏆</div>
                  <h4 className="font-medium text-gray-500">Champion</h4>
                  <p className="text-xs text-gray-500">Complete all courses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}