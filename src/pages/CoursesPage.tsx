import { useState } from "react";
import { BookOpen, Play, Clock, CheckCircle } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

// Normalize various YouTube URL formats into an embeddable URL
function getYouTubeEmbedUrl(originalUrl: string): string {
  try {
    const url = new URL(originalUrl);

    // youtu.be/<id>
    if (url.hostname === "youtu.be") {
      const videoId = url.pathname.replace("/", "");
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // www.youtube.com or m.youtube.com or youtube.com
    if (url.hostname.includes("youtube.com")) {
      // watch?v=<id>
      if (url.pathname === "/watch") {
        const v = url.searchParams.get("v");
        if (v) return `https://www.youtube.com/embed/${v}`;
      }
      // /shorts/<id>
      if (url.pathname.startsWith("/shorts/")) {
        const videoId = url.pathname.split("/")[2];
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      }
      // already an embed URL
      if (url.pathname.startsWith("/embed/")) {
        return originalUrl;
      }
    }

    // Fallback: return original (may already be embeddable)
    return originalUrl;
  } catch {
    return originalUrl;
  }
}

type Article = {
  id: string;
  title: string;
  content: string;
  reading_time: number;
};

type Video = {
  id: string;
  title: string;
  description: string;
  url: string;
  duration: number;
};

type SelectedContent =
  | { type: "article"; data: Article }
  | { type: "video"; data: Video };

const coursesData = [
  {
    id: "climate-change",
    title: "Climate Change",
    description:
      "Understanding global warming, its causes, and solutions for a sustainable future.",
    icon: "🌡️",
    color: "from-red-400 to-orange-500",
    articles: [
      {
        id: "1",
        title: "Introduction to Climate Change",
        content: `Climate change refers to long-term shifts in the Earth’s climate, including changes in average temperature, rainfall, and weather patterns. Although climate changes have occurred naturally throughout Earth’s history, scientists have found strong evidence that human activities have been the main cause of rapid changes since the mid-20th century.

One of the biggest reasons is the burning of fossil fuels such as coal, oil, and natural gas. These fuels release large amounts of greenhouse gases like carbon dioxide (CO₂) and methane (CH₄) into the atmosphere. These gases trap heat from the sun, creating a “greenhouse effect” that causes the planet’s average temperature to rise. In addition, activities like deforestation (cutting down forests) reduce the Earth’s ability to absorb carbon dioxide, making the problem worse.

The impacts of climate change are becoming more visible today. Global temperatures are rising, leading to the melting of glaciers and polar ice caps. As a result, sea levels are increasing, which threatens coastal areas and small islands. Weather patterns are also changing: some regions experience more intense heatwaves, droughts, and wildfires, while others face heavier rainfall, storms, and floods. These extreme events can harm agriculture, affect food supply, and even force people to leave their homes.

Climate change also affects plants, animals, and ecosystems. Many species are struggling to adapt to new temperature conditions, and some are at risk of extinction. Ocean warming and acidification are damaging coral reefs and marine life, which are vital for biodiversity and human livelihoods.

Scientists and world leaders are working together to find solutions. Efforts include reducing greenhouse gas emissions, switching to renewable energy sources like solar and wind power, planting trees, and creating international agreements such as the Paris Agreement. Individuals can also help by saving energy, using public transport, recycling, and supporting sustainable practices.

In conclusion, climate change is one of the biggest challenges of our time. Understanding its causes, impacts, and solutions is important for protecting our planet and ensuring a sustainable future for generations to come.`,
        reading_time: 5,
      },
      {
        id: "2",
        title: "Greenhouse Effect and Global Warming",
        content: `The greenhouse effect is a natural process that helps keep the Earth warm. The Sun sends energy to Earth in the form of sunlight. Some of this energy is absorbed by the Earth’s surface, while the rest is reflected back into space. Greenhouse gases in the atmosphere, such as carbon dioxide (CO₂), methane (CH₄), and water vapor (H₂O), trap some of this reflected heat, preventing it from escaping completely. This process keeps Earth’s average temperature at a level suitable for life. Without the greenhouse effect, our planet would be about 33°C colder, making it too cold for most living things to survive.

However, human activities have strengthened the greenhouse effect. Since the Industrial Revolution, people have been burning large amounts of fossil fuels like coal, oil, and natural gas to produce energy. This releases extra greenhouse gases into the atmosphere. Deforestation (cutting down trees) also reduces the Earth’s ability to absorb carbon dioxide. As a result, more heat is trapped than necessary, leading to global warming—a steady increase in the Earth’s average temperature.

The consequences of global warming are already visible. Glaciers and polar ice caps are melting, which causes sea levels to rise and threatens coastal communities. Many regions are experiencing more frequent and intense heatwaves, droughts, floods, and storms. Changes in rainfall patterns affect agriculture, reducing food production and harming farmers. Ecosystems are also under pressure: coral reefs are dying due to ocean warming, and many animal and plant species struggle to adapt to changing climates, putting them at risk of extinction.

To address this problem, scientists and governments around the world are working on solutions. These include reducing greenhouse gas emissions, shifting to renewable energy sources like solar and wind, planting more trees, and making international agreements such as the Paris Agreement to limit global temperature rise. Individuals can also help by saving energy, using eco-friendly transportation, recycling, and supporting sustainable practices.

In conclusion, while the greenhouse effect is essential for life, human actions have made it dangerously strong, leading to global warming. Understanding this process is important so that we can take action to protect the environment and ensure a safe future for generations to come.`,
        reading_time: 7,
      },
      {
        id: "3",
        title: "Impact of Climate Change on Ecosystems",
        content: `Climate change has a major impact on ecosystems, which are communities of plants, animals, and their environments. Rising temperatures, shifting rainfall patterns, and melting ice are changing natural habitats around the world.

One of the most visible effects is the loss of biodiversity. Many species cannot adapt quickly enough to the changing climate, which puts them at risk of extinction. For example, polar bears are losing their sea-ice habitat, while coral reefs are being damaged by warmer and more acidic oceans.

Changing weather patterns also affect migration and reproduction. Birds, fish, and other animals are forced to move to new areas in search of suitable climates, which can disrupt the balance of ecosystems. Plants may bloom earlier or later than usual, affecting the animals that depend on them for food.

Rising sea levels threaten coastal ecosystems like mangroves, wetlands, and estuaries, which serve as breeding grounds for many species. Freshwater systems are also affected, as droughts and floods alter river flows and water availability.

These changes in ecosystems also impact humans. We rely on healthy ecosystems for food, clean water, medicines, and protection from natural disasters. When ecosystems are disrupted, agriculture suffers, fisheries decline, and communities face greater risks from floods, storms, and heatwaves.

In conclusion, climate change is not just an environmental issue—it is a threat to the balance of ecosystems and to human life. Protecting ecosystems through conservation, reducing greenhouse gas emissions, and sustainable resource use is essential for a healthier planet.`,
        reading_time: 6,
      },
    ],
    videos: [
      {
        id: "1",
        title: "Climate Change Explained",
        description:
          "A comprehensive overview of climate science and its implications.",
        url: "https://youtu.be/UQ3mnV-Eafc?si=G6sujXcO_iRmtmpM",
        duration: 8,
      },
      {
        id: "2",
        title: "Solutions to Climate Change",
        description: "Exploring renewable energy and sustainable practices.",
        url: "https://youtu.be/2oxNId-H8r4?si=IVwHUF-WiNDfDbPe",
        duration: 12,
      },
    ],
  },
  {
    id: "waste-management",
    title: "Waste Management",
    description:
      "Learn effective strategies for reducing, reusing, and recycling waste materials.",
    icon: "♻️",
    color: "from-green-400 to-emerald-500",
    articles: [
      {
        id: "1",
        title: "The 3 Rs: Reduce, Reuse, Recycle",
        content:
          "The waste hierarchy of reduce, reuse, and recycle provides a framework for managing waste sustainably...",
        reading_time: 4,
      },
      {
        id: "2",
        title: "Composting and Organic Waste",
        content:
          "Organic waste makes up a significant portion of municipal solid waste. Composting is an effective way to manage this waste...",
        reading_time: 6,
      },
      {
        id: "3",
        title: "Plastic Pollution and Alternatives",
        content:
          "Plastic pollution is one of the most pressing environmental challenges of our time...",
        reading_time: 8,
      },
    ],
    videos: [
      {
        id: "1",
        title: "Waste Management Systems",
        description: "Understanding modern waste management infrastructure.",
        url: "https://youtu.be/K6ppCC3lboU?si=OLcURqebWvEN1LGN",
        duration: 10,
      },
      {
        id: "2",
        title: "Zero Waste Lifestyle",
        description: "Practical tips for reducing waste in daily life.",
        url: "https://youtu.be/V-kAOP-uvnQ?si=YpaB_8t8gRT9WqpT",
        duration: 15,
      },
    ],
  },
  {
    id: "renewable-energy",
    title: "Renewable Energy",
    description:
      "Explore sustainable energy sources and their impact on environmental conservation.",
    icon: "⚡",
    color: "from-blue-400 to-cyan-500",
    articles: [
      {
        id: "1",
        title: "Introduction to Renewable Energy",
        content:
          "Renewable energy comes from natural sources that are constantly replenished, such as sunlight, wind, and water...",
        reading_time: 5,
      },
      {
        id: "2",
        title: "Solar Power Technology",
        content:
          "Solar energy harnesses the power of the sun to generate electricity through photovoltaic cells...",
        reading_time: 7,
      },
      {
        id: "3",
        title: "Wind Energy and Its Applications",
        content:
          "Wind energy is one of the fastest-growing renewable energy sources worldwide...",
        reading_time: 6,
      },
    ],
    videos: [
      {
        id: "1",
        title: "How Solar Panels Work",
        description: "The science behind photovoltaic technology.",
        url: "https://www.youtube.com/embed/xKxrkht7CpY",
        duration: 7,
      },
      {
        id: "2",
        title: "Future of Renewable Energy",
        description: "Emerging technologies and global energy transition.",
        url: "https://youtu.be/UVf2Yw7uFoE?si=H7FPJiPkV0KYjKaq",
        duration: 14,
      },
    ],
  },
];

export function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<
    (typeof coursesData)[number]
  >(coursesData[0]);
  const [activeTab, setActiveTab] = useState<"articles" | "videos">("articles");
  const [selectedContent, setSelectedContent] =
    useState<SelectedContent | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Environmental Courses
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive learning modules designed to build your environmental
            knowledge and inspire action.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Course Selection */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Courses
            </h2>
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
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{course.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {course.articles.length} articles •{" "}
                        {course.videos.length} videos
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
                <div
                  className={`h-32 bg-gradient-to-r ${selectedCourse.color} flex items-center justify-center rounded-t-lg`}
                >
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
                        onClick={() => setActiveTab("articles")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === "articles"
                            ? "border-green-500 text-green-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Articles ({selectedCourse.articles.length})
                      </button>
                      <button
                        onClick={() => setActiveTab("videos")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === "videos"
                            ? "border-green-500 text-green-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Videos ({selectedCourse.videos.length})
                      </button>
                    </nav>
                  </div>

                  {/* Content List */}
                  <div className="space-y-4">
                    {activeTab === "articles"
                      ? selectedCourse.articles.map((article) => (
                          <div
                            key={article.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() =>
                              setSelectedContent({
                                type: "article",
                                data: article,
                              })
                            }
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-900 mb-1">
                                  {article.title}
                                </h3>
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
                      : selectedCourse.videos.map((video) => (
                          <div
                            key={video.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() =>
                              setSelectedContent({ type: "video", data: video })
                            }
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-900 mb-1">
                                  {video.title}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                  {video.description}
                                </p>
                                <div className="flex items-center mt-2 text-sm text-gray-500">
                                  <Play className="h-4 w-4 mr-1" />
                                  {video.duration} min
                                </div>
                              </div>
                              <Play className="h-5 w-5 text-gray-400 ml-4" />
                            </div>
                          </div>
                        ))}
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
                  {selectedContent.type === "article" ? (
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
                          <span className="font-medium">
                            Article completed! +10 points
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center mb-4 text-sm text-gray-500">
                        <Play className="h-4 w-4 mr-1" />
                        {selectedContent.data.duration} minutes
                      </div>
                      <p className="text-gray-600 mb-6">
                        {selectedContent.data.description}
                      </p>
                      <div className="aspect-w-16 aspect-h-9 mb-6">
                        <iframe
                          src={getYouTubeEmbedUrl(selectedContent.data.url)}
                          className="w-full h-96 rounded-lg"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center text-green-700">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          <span className="font-medium">
                            Video completed! +15 points
                          </span>
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
