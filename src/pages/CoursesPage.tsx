import React, { useState } from 'react';
import { BookOpen, Play, Clock, CheckCircle } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const coursesData = [
  {
    id: 'climate-change',
    title: 'Climate Change',
    description: 'Understanding global warming, its causes, and solutions for a sustainable future.',
    icon: '🌡️',
    color: 'from-red-400 to-orange-500',
    articles: [
      {
        id: '1',
        title: 'Introduction to Climate Change',
        content: 'Climate change refers to long-term shifts in global temperatures and weather patterns. While climate change is natural, scientific evidence shows that human activities have been the main driver since the 1950s...',
        reading_time: 5,
      },
      {
        id: '2',
        title: 'Greenhouse Effect and Global Warming',
        content: 'The greenhouse effect is a natural process that warms Earth\'s surface. However, human activities have intensified this effect, leading to global warming...',
        reading_time: 7,
      },
      {
        id: '3',
        title: 'Impact of Climate Change on Ecosystems',
        content: 'Climate change affects ecosystems in numerous ways, from rising sea levels to changing precipitation patterns...',
        reading_time: 6,
      },
    ],
    videos: [
      {
        id: '1',
        title: 'Climate Change Explained',
        description: 'A comprehensive overview of climate science and its implications.',
        url: 'https://www.youtube.com/embed/dcHep_9oot4',
        duration: 8,
      },
      {
        id: '2',
        title: 'Solutions to Climate Change',
        description: 'Exploring renewable energy and sustainable practices.',
        url: 'https://www.youtube.com/embed/yiw6_JakZFc',
        duration: 12,
      },
    ],
  },
  {
    id: 'waste-management',
    title: 'Waste Management',
    description: 'Learn effective strategies for reducing, reusing, and recycling waste materials.',
    icon: '♻️',
    color: 'from-green-400 to-emerald-500',
    articles: [
      {
        id: '1',
        title: 'The 3 Rs: Reduce, Reuse, Recycle',
        content: 'The waste hierarchy of reduce, reuse, and recycle provides a framework for managing waste sustainably...',
        reading_time: 4,
      },
      {
        id: '2',
        title: 'Composting and Organic Waste',
        content: 'Organic waste makes up a significant portion of municipal solid waste. Composting is an effective way to manage this waste...',
        reading_time: 6,
      },
      {
        id: '3',
        title: 'Plastic Pollution and Alternatives',
        content: 'Plastic pollution is one of the most pressing environmental challenges of our time...',
        reading_time: 8,
      },
    ],
    videos: [
      {
        id: '1',
        title: 'Waste Management Systems',
        description: 'Understanding modern waste management infrastructure.',
        url: 'https://www.youtube.com/embed/cEzFqceNS1w',
        duration: 10,
      },
      {
        id: '2',
        title: 'Zero Waste Lifestyle',
        description: 'Practical tips for reducing waste in daily life.',
        url: 'https://www.youtube.com/embed/gqcYy54cCKU',
        duration: 15,
      },
    ],
  },
  {
    id: 'renewable-energy',
    title: 'Renewable Energy',
    description: 'Explore sustainable energy sources and their impact on environmental conservation.',
    icon: '⚡',
    color: 'from-blue-400 to-cyan-500',
    articles: [
      {
        id: '1',
        title: 'Introduction to Renewable Energy',
        content: 'Renewable energy comes from natural sources that are constantly replenished, such as sunlight, wind, and water...',
        reading_time: 5,
      },
      {
        id: '2',
        title: 'Solar Power Technology',
        content: 'Solar energy harnesses the power of the sun to generate electricity through photovoltaic cells...',
        reading_time: 7,
      },
      {
        id: '3',
        title: 'Wind Energy and Its Applications',
        content: 'Wind energy is one of the fastest-growing renewable energy sources worldwide...',
        reading_time: 6,
      },
    ],
    videos: [
      {
        id: '1',
        title: 'How Solar Panels Work',
        description: 'The science behind photovoltaic technology.',
        url: 'https://www.youtube.com/embed/xKxrkht7CpY',
        duration: 7,
      },
      {
        id: '2',
        title: 'Future of Renewable Energy',
        description: 'Emerging technologies and global energy transition.',
        url: 'https://www.youtube.com/embed/WdTnOk5LGrA',
        duration: 14,
      },
    ],
  },
];

export function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState(coursesData[0]);
  const [activeTab, setActiveTab] = useState<'articles' | 'videos'>('articles');
  const [selectedContent, setSelectedContent] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Environmental Courses</h1>
          <p className="text-lg text-gray-600">
            Comprehensive learning modules designed to build your environmental knowledge and inspire action.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Course Selection */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Courses</h2>
            <div className="space-y-3">
              {coursesData.map((course) => (
                <button
                  key={course.id}
                  onClick={() => {
                    setSelectedCourse(course);
                    setSelectedContent(null);
                  }}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                    selectedCourse.id === course.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{course.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-900">{course.title}</h3>
                      <p className="text-sm text-gray-500">
                        {course.articles.length} articles • {course.videos.length} videos
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Course Content */}
          <div className="lg:col-span-3">
            {!selectedContent ? (
              <div className="bg-white rounded-lg shadow-sm">
                {/* Course Header */}
                <div className={`h-32 bg-gradient-to-r ${selectedCourse.color} flex items-center justify-center rounded-t-lg`}>
                  <span className="text-6xl">{selectedCourse.icon}</span>
                </div>
                
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedCourse.title}
                  </h1>
                  <p className="text-gray-600 mb-6">
                    {selectedCourse.description}
                  </p>

                  {/* Content Tabs */}
                  <div className="border-b border-gray-200 mb-6">
                    <nav className="flex space-x-8">
                      <button
                        onClick={() => setActiveTab('articles')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === 'articles'
                            ? 'border-green-500 text-green-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Articles ({selectedCourse.articles.length})
                      </button>
                      <button
                        onClick={() => setActiveTab('videos')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === 'videos'
                            ? 'border-green-500 text-green-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Videos ({selectedCourse.videos.length})
                      </button>
                    </nav>
                  </div>

                  {/* Content List */}
                  <div className="space-y-4">
                    {activeTab === 'articles' ? (
                      selectedCourse.articles.map((article) => (
                        <div
                          key={article.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => setSelectedContent({ type: 'article', data: article })}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900 mb-1">{article.title}</h3>
                              <p className="text-gray-600 text-sm line-clamp-2">
                                {article.content.substring(0, 100)}...
                              </p>
                              <div className="flex items-center mt-2 text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                {article.reading_time} min read
                              </div>
                            </div>
                            <BookOpen className="h-5 w-5 text-gray-400 ml-4" />
                          </div>
                        </div>
                      ))
                    ) : (
                      selectedCourse.videos.map((video) => (
                        <div
                          key={video.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => setSelectedContent({ type: 'video', data: video })}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900 mb-1">{video.title}</h3>
                              <p className="text-gray-600 text-sm">{video.description}</p>
                              <div className="flex items-center mt-2 text-sm text-gray-500">
                                <Play className="h-4 w-4 mr-1" />
                                {video.duration} min
                              </div>
                            </div>
                            <Play className="h-5 w-5 text-gray-400 ml-4" />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Selected Content View */
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <button
                    onClick={() => setSelectedContent(null)}
                    className="text-green-600 hover:text-green-700 font-medium mb-4"
                  >
                    ← Back to {selectedCourse.title}
                  </button>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {selectedContent.data.title}
                  </h1>
                </div>
                
                <div className="p-6">
                  {selectedContent.type === 'article' ? (
                    <div className="prose max-w-none">
                      <div className="flex items-center mb-4 text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {selectedContent.data.reading_time} min read
                      </div>
                      <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {selectedContent.data.content}
                      </div>
                      <div className="mt-8 p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center text-green-700">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          <span className="font-medium">Article completed! +10 points</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center mb-4 text-sm text-gray-500">
                        <Play className="h-4 w-4 mr-1" />
                        {selectedContent.data.duration} minutes
                      </div>
                      <p className="text-gray-600 mb-6">{selectedContent.data.description}</p>
                      <div className="aspect-w-16 aspect-h-9 mb-6">
                        <iframe
                          src={selectedContent.data.url}
                          className="w-full h-96 rounded-lg"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center text-green-700">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          <span className="font-medium">Video completed! +15 points</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}