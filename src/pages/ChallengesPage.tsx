import React, { useState } from 'react';
import { Calendar, Camera, Award, Upload, CheckCircle } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { usePoints } from '../context/PointsContext';

const initialChallengesData = [
  {
    id: '1',
    title: 'Zero Waste Lunch',
    description: 'Pack a lunch without any single-use items. Show us your sustainable meal setup!',
    points: 25,
    date: '2025-01-15',
    completed: false,
  },
  {
    id: '2',
    title: 'Plastic-Free Shopping',
    description: 'Complete your grocery shopping without using any plastic bags. Share your eco-friendly alternatives.',
    points: 30,
    date: '2025-01-15',
    completed: false,
  },
  {
    id: '3',
    title: 'Energy Conservation',
    description: 'Show us how you\'re reducing energy consumption at home or work.',
    points: 20,
    date: '2025-01-14',
    completed: false,
  },
  {
    id: '4',
    title: 'Nature Cleanup',
    description: 'Participate in cleaning a local park, beach, or natural area. Document your impact!',
    points: 40,
    date: '2025-01-14',
    completed: false,
  },
];

export function ChallengesPage() {
  const { addPoints } = usePoints();
  const [challengesData, setChallengesData] = useState(initialChallengesData);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitChallenge = (challengeId: string) => {
    const challenge = challengesData.find(c => c.id === challengeId);
    if (challenge && !challenge.completed) {
      // Add points to total
      addPoints(challenge.points);
      
      // Mark challenge as completed
      setChallengesData(prev => 
        prev.map(c => 
          c.id === challengeId 
            ? { ...c, completed: true }
            : c
        )
      );
      
      // Show success message
      alert(`Challenge submitted successfully! You earned ${challenge.points} points! Your total points have been updated.`);
    }
    
    setSelectedChallenge(null);
    setUploadedImage(null);
  };

  const todaysChallenges = challengesData.filter(c => c.date === '2025-01-15');
  const previousChallenges = challengesData.filter(c => c.date !== '2025-01-15');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Daily Challenges</h1>
          <p className="text-lg text-gray-600">
            Take action every day with our environmental challenges. Earn points and make a real impact!
          </p>
        </div>

        {/* Today's Challenges */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <Calendar className="h-6 w-6 mr-2 text-green-600" />
            Today's Challenges
          </h2>
          
          <div className="grid gap-6">
            {todaysChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {challenge.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {challenge.description}
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-yellow-600">
                        <Award className="h-4 w-4 mr-1" />
                        <span className="font-medium">{challenge.points} points</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="text-sm">Due today</span>
                      </div>
                    </div>
                  </div>
                  
                  {challenge.completed ? (
                    <div className="flex items-center text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="font-medium">Completed</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedChallenge(challenge.id)}
                      className="flex items-center bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Take Challenge
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Previous Challenges */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Previous Challenges
          </h2>
          
          <div className="grid gap-4">
            {previousChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {challenge.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {challenge.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center text-yellow-600">
                        <Award className="h-4 w-4 mr-1" />
                        <span>{challenge.points} points</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{challenge.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  {challenge.completed ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="font-medium">Completed</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">Expired</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Challenge Upload Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {challengesData.find(c => c.id === selectedChallenge)?.title}
            </h3>
            
            <p className="text-gray-600 mb-4">
              {challengesData.find(c => c.id === selectedChallenge)?.description}
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center text-yellow-800">
                <Award className="h-5 w-5 mr-2" />
                <span className="font-semibold">
                  Earn {challengesData.find(c => c.id === selectedChallenge)?.points} points when you submit!
                </span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload your photo:
              </label>
              
              {!uploadedImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">
                    Click to upload a photo of your challenge completion
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="challenge-upload"
                  />
                  <label
                    htmlFor="challenge-upload"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Photo
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={uploadedImage}
                    alt="Challenge submission"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setSelectedChallenge(null);
                  setUploadedImage(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => submitChallenge(selectedChallenge)}
                disabled={!uploadedImage}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <Award className="h-4 w-4 mr-2" />
                Submit & Earn {challengesData.find(c => c.id === selectedChallenge)?.points} pts
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}