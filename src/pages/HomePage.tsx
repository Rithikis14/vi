import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Play, Award, Users } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const courses = [
  {
    title: 'Climate Change',
    description: 'Understanding global warming, its causes, and solutions for a sustainable future.',
    icon: '🌡️',
    color: 'from-red-400 to-orange-500',
    articles: 12,
    videos: 8,
  },
  {
    title: 'Waste Management',
    description: 'Learn effective strategies for reducing, reusing, and recycling waste materials.',
    icon: '♻️',
    color: 'from-green-400 to-emerald-500',
    articles: 10,
    videos: 6,
  },
  {
    title: 'Renewable Energy',
    description: 'Explore sustainable energy sources and their impact on environmental conservation.',
    icon: '⚡',
    color: 'from-blue-400 to-cyan-500',
    articles: 15,
    videos: 10,
  },
];

export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Learn. Act. Transform.
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Join thousands of learners in building a sustainable future through 
            comprehensive environmental education.
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Start Learning
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">5,000+</div>
              <div className="text-gray-600">Active Learners</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">37</div>
              <div className="text-gray-600">Course Modules</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">24</div>
              <div className="text-gray-600">Video Hours</div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Courses
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dive deep into the most critical environmental topics with our expertly crafted courses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className={`h-32 bg-gradient-to-r ${course.color} flex items-center justify-center`}>
                  <span className="text-6xl">{course.icon}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {course.articles} articles
                      </span>
                      <span className="flex items-center">
                        <Play className="h-4 w-4 mr-1" />
                        {course.videos} videos
                      </span>
                    </div>
                  </div>
                  <Link
                    to="/courses"
                    className="block w-full text-center bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Explore Course
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Gamified Learning Experience
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Award className="h-6 w-6 text-yellow-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Daily Challenges</h3>
                    <p className="text-gray-600">Complete photo challenges and earn points while making a real impact.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Community Impact</h3>
                    <p className="text-gray-600">Join a community of environmental advocates and share your progress.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <BookOpen className="h-6 w-6 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Comprehensive Learning</h3>
                    <p className="text-gray-600">Access articles, videos, and interactive content tailored to your pace.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-blue-100 p-8 rounded-2xl">
              <div className="text-center">
                <div className="text-6xl mb-4">🌍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Join the Movement
                </h3>
                <p className="text-gray-600 mb-6">
                  Be part of the solution and help create a sustainable future for generations to come.
                </p>
                <Link
                  to="/challenges"
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  View Challenges
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}