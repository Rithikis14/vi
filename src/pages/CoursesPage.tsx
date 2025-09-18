import { useState } from "react";
import { BookOpen, Play, Clock, CheckCircle, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { usePoints } from "../context/PointsContext";

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

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};

type SelectedContent =
  | { type: "article"; data: Article }
  | { type: "video"; data: Video }
  | { type: "quiz"; data: QuizQuestion[] };

// Quiz component (added without changing existing page logic)
const QuizWithTailwind = ({ questions }: { questions: QuizQuestion[] }) => {
  const { addPoints } = usePoints();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [pointsEarned, setPointsEarned] = useState(0);

  const quizData = questions;

  const handleOptionClick = (option: string) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);
    
    const isCorrect = option === quizData[currentQuestion].correctAnswer;
    const newScore = score + (isCorrect ? 1 : 0);
    
    if (isCorrect) {
      setScore((s) => s + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < quizData.length - 1) {
        setCurrentQuestion((q) => q + 1);
        setSelectedOption(null);
      } else {
        // Check if perfect score (100%) - all questions answered correctly
        if (newScore === quizData.length) {
          addPoints(5);
          setPointsEarned(5);
        }
        setShowResults(true);
      }
    }, 1500);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setSelectedOption(null);
    setPointsEarned(0);
  };

  return (
    <div className="bg-gradient-to-br from-purple-500 to-indigo-700 p-4 rounded-lg text-white">
      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div
            key={currentQuestion}
            className="bg-white/10 p-6 rounded-lg"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <h2 className="text-xl font-semibold mb-4">
              {quizData[currentQuestion].question}
            </h2>
            <div className="grid gap-3">
              {quizData[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className={`p-3 rounded-lg ${
                    selectedOption === option
                      ? "bg-green-600"
                      : "bg-white/20 hover:bg-white/30"
                  }`}
                  onClick={() => handleOptionClick(option)}
                  disabled={selectedOption !== null}
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Your Score: {score}/{quizData.length}
            </h2>
            
            {/* Show percentage and points earned */}
            <div className="mb-6">
              <div className="text-lg mb-2">
                Score: <span className="font-bold text-yellow-300">{(score / quizData.length * 100).toFixed(0)}%</span>
              </div>
              
              {pointsEarned > 0 && (
                <div className="bg-green-600 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-center text-green-100">
                    <Award className="h-6 w-6 mr-2" />
                    <span className="text-lg font-bold">
                      Perfect Score! You earned {pointsEarned} points! 🎉
                    </span>
                  </div>
                </div>
              )}
              
              {pointsEarned === 0 && score === quizData.length && (
                <div className="bg-yellow-600 rounded-lg p-4 mb-4">
                  <div className="text-yellow-100">
                    <span className="font-bold">Great job! You got all questions right!</span>
                    <br />
                    <span className="text-sm">Complete a quiz for the first time to earn points.</span>
                  </div>
                </div>
              )}
            </div>
            
            <button
              className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg font-semibold transition-colors"
              onClick={restartQuiz}
            >
              Try Again
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const coursesData = [
  {
    id: "climate-change",
    title: "Climate Change",
    description:
      "Understanding global warming, its causes, and solutions for a sustainable future.",
    icon: "🌡",
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
    quiz: [
      {
        question:
          "Which gas is the primary contributor to human-caused global warming?",
        options: ["Oxygen", "Nitrogen", "Carbon dioxide (CO₂)", "Helium"],
        correctAnswer: "Carbon dioxide (CO₂)",
      },
      {
        question: "Which sector is a major source of methane (CH₄) emissions?",
        options: [
          "Aviation",
          "Livestock and agriculture",
          "Shipping",
          "Data centers",
        ],
        correctAnswer: "Livestock and agriculture",
      },
      {
        question:
          "What global agreement aims to limit warming to well below 2°C?",
        options: [
          "Kyoto Protocol",
          "Montreal Protocol",
          "Paris Agreement",
          "Basel Convention",
        ],
        correctAnswer: "Paris Agreement",
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
    icon: "♻",
    color: "from-green-400 to-emerald-500",
    articles: [
      {
        id: "1",
        title: "The 3 Rs: Reduce, Reuse, Recycle",
        content: `The 3 Rs are a simple but powerful framework for managing waste in a way that protects the environment and conserves natural resources. They encourage us to think carefully about how we use materials in our daily lives.

1. Reduce

Meaning: Use fewer resources and avoid creating unnecessary waste.

Why it matters: If we produce less waste, there will be less to manage later.

Examples:

Carry a cloth bag instead of buying plastic bags.

Avoid single-use plastics like straws and disposable cups.

Choose products with less packaging.

2. Reuse

Meaning: Use items more than once instead of throwing them away.

Why it matters: Reusing items saves energy and resources needed to make new products.

Examples:

Reuse glass bottles and jars for storage.

Donate old clothes or books instead of discarding them.

Repair broken items rather than buying new ones.

3. Recycle

Meaning: Process used materials to make them into new products.

Why it matters: Recycling reduces the need to extract new raw materials like wood, metals, and oil. It also helps reduce pollution.

Examples:

Recycling paper helps save trees.

Recycling plastic reduces plastic waste in oceans and landfills.

Recycling metals like aluminum saves a lot of energy compared to mining.

Why the 3 Rs are Important

By practicing the 3 Rs, we:

Reduce pollution and protect nature.

Save energy and natural resources.

Keep our environment clean and healthy.

Encourage a sustainable lifestyle for future generations.`,
        reading_time: 4,
      },
      {
        id: "2",
        title: "Composting and Organic Waste",
        content: `Organic waste, such as food scraps, vegetable peels, garden leaves, and other natural materials, makes up a large part of the waste we produce every day. When this waste is dumped into landfills, it releases harmful gases like methane, which contribute to global warming, and it also takes up valuable space. A much better and eco-friendly solution to this problem is composting. Composting is a natural recycling process in which microorganisms like bacteria, fungi, and even earthworms break down organic waste into a dark, soil-like material called compost. This compost is very rich in nutrients and can be added to soil to improve its quality, making plants grow healthier and stronger.

Composting provides several benefits. It helps reduce the amount of waste that ends up in landfills, prevents pollution by cutting down greenhouse gases, and improves soil health by adding nutrients and helping it retain water. It also saves money by reducing the need for chemical fertilizers and encourages people to practice recycling at home, which supports sustainable living. There are different types of composting methods. In aerobic composting, oxygen is used and the waste is turned regularly to provide air. In anaerobic composting, decomposition happens without oxygen, but it takes longer and may produce unpleasant smells. Vermicomposting, on the other hand, uses earthworms to break down organic waste into very high-quality compost.

Many everyday items can be composted, such as fruit and vegetable peels, tea bags, coffee grounds, leaves, grass clippings, and eggshells. However, non-biodegradable materials like plastics, glass, metals, oily food, and chemicals should never be added to compost. Learning about composting is very important for students as it teaches eco-friendly habits, encourages teamwork, and can even be used in school gardens or science projects. By practicing composting, students and communities can take an active step toward protecting the environment and building a cleaner, greener future.`,
        reading_time: 6,
      },
      {
        id: "3",
        title: "Plastic Pollution and Alternatives",
        content: `Plastic pollution has become one of the most pressing environmental challenges of our time. Plastics are widely used in packaging, bottles, bags, and countless products because they are cheap, lightweight, and durable. However, these same qualities make them dangerous for the environment. Unlike natural materials, plastics do not decompose quickly; instead, they can remain in the soil, rivers, and oceans for hundreds of years. Over time, they break down into tiny particles called microplastics, which spread easily through water and food systems. This pollution harms wildlife, as many animals and marine creatures mistake plastic for food, leading to injury, starvation, or death. Humans are also affected when microplastics enter the food chain and reach our bodies through seafood and drinking water.

To reduce this growing problem, it is important to find and use alternatives to plastic. Simple steps like carrying cloth or jute bags instead of plastic ones, using paper or metal straws, switching to reusable bottles and containers, and supporting biodegradable materials can make a big difference. Governments and organizations around the world are also encouraging recycling, banning single-use plastics, and promoting sustainable materials. By making responsible choices in our daily lives and supporting eco-friendly alternatives, we can lower plastic waste, protect ecosystems, and ensure a healthier planet for future generations.`,
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
    quiz: [
      {
        question: "What is the highest priority in the waste hierarchy?",
        options: ["Recycle", "Reuse", "Reduce", "Landfill"],
        correctAnswer: "Reduce",
      },
      {
        question: "Composting primarily helps divert which type of waste?",
        options: ["Plastic", "Organic/food", "Metals", "Glass"],
        correctAnswer: "Organic/food",
      },
      {
        question: "Which practice best supports a zero-waste lifestyle?",
        options: [
          "Single-use items",
          "Refilling and reusing containers",
          "Open dumping",
          "Incineration",
        ],
        correctAnswer: "Refilling and reusing containers",
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
        content: `Renewable energy is energy that comes from natural sources which are constantly replenished, such as sunlight, wind, water, and organic materials. Unlike fossil fuels like coal, oil, and natural gas—which are limited in supply and release harmful greenhouse gases when burned—renewable energy is clean, sustainable, and environmentally friendly. This makes it one of the most important solutions to address global energy needs while also protecting our planet from the effects of climate change.

There are several main types of renewable energy. Solar energy captures the sun’s light and heat using technologies like solar panels, which can produce electricity or heat water for homes and industries. Wind energy uses wind turbines to convert moving air into electricity, and it has become one of the fastest-growing energy sources worldwide. Hydropower, or hydro energy, uses the force of flowing water in rivers or dams to generate electricity and has been used for decades as a reliable energy source. Another form is biomass energy, which comes from plant materials, agricultural waste, or animal waste that can be converted into fuel. Additionally, geothermal energy uses heat from beneath the Earth’s surface to produce power and provide heating.

The use of renewable energy offers many benefits. It helps reduce dependence on non-renewable resources, lowers carbon emissions, and decreases air pollution, making the environment cleaner and healthier. It also supports economic growth by creating new green jobs in fields such as solar panel installation, wind turbine manufacturing, and energy research. Furthermore, renewable energy encourages innovation and provides energy security, since natural sources like the sun and wind are available almost everywhere in the world.

However, renewable energy also faces challenges such as high initial installation costs, dependence on weather conditions (like cloudy days or weak winds), and the need for advanced storage technologies. Despite these challenges, governments, scientists, and communities are working together to improve renewable energy systems and make them more efficient and affordable.

In conclusion, renewable energy is not just an alternative to fossil fuels—it is the future of sustainable living. By investing in and adopting renewable energy sources, societies can meet their energy demands while protecting the planet, ensuring a cleaner, healthier, and more sustainable future for generations to come.`,
        reading_time: 5,
      },
      {
        id: "2",
        title: "Solar Power Technology",
        content: `Solar power technology is one of the most important renewable energy sources, as it captures the sun’s energy and converts it into usable electricity and heat. The primary method is through photovoltaic (PV) cells, which are made from semiconductor materials such as silicon. When sunlight falls on these cells, they generate an electric current that can be used immediately or stored in batteries for later use. These PV cells are combined to form solar panels, which can be installed on rooftops of homes, schools, and offices, or arranged in large groups called solar farms that supply electricity to entire communities. Another approach is solar thermal technology, which focuses sunlight using mirrors or lenses to produce heat. This heat can then be used to generate steam and drive turbines that produce electricity.

One of the biggest advantages of solar power is that it is a clean and sustainable source of energy. Unlike fossil fuels, solar power does not release harmful greenhouse gases or pollutants into the atmosphere, making it an environmentally friendly option to fight climate change. Solar energy is also abundant—almost every place on Earth receives sunlight, and just one hour of sunlight on Earth could theoretically meet global energy needs for an entire year if captured efficiently. This makes solar energy a reliable choice for long-term energy security.

Solar technology is widely applied in daily life. It is used for powering homes, streetlights, traffic signals, water pumps, and even satellites in space. In rural or remote areas where it is difficult to connect to the main electricity grid, solar panels provide an affordable and independent source of power. Additionally, many countries are investing in large-scale solar plants to reduce dependence on non-renewable energy.

However, solar power does face some challenges. Since it depends on sunlight, electricity generation is lower on cloudy days or during the night. To overcome this, solar systems are often combined with energy storage solutions like batteries or integrated with other renewable sources such as wind or hydropower. The initial cost of solar panels and installation can also be high, but as technology improves and governments offer subsidies or incentives, solar power is becoming more affordable and popular worldwide.

In conclusion, solar power technology holds great promise for building a sustainable future. By reducing reliance on fossil fuels, lowering greenhouse gas emissions, and providing clean and renewable energy, solar power is helping humanity move toward a greener and healthier planet.`,
        reading_time: 7,
      },
      {
        id: "3",
        title: "Wind Energy and Its Applications",
        content: `Wind energy is a clean and renewable source of power that is produced by converting the kinetic energy of moving air into electricity using wind turbines. When the wind blows, it turns the blades of a turbine, which are connected to a generator that produces electricity. Wind farms, which consist of many turbines placed together, can generate large amounts of electricity and are often located in areas with strong, steady winds such as coastal regions, open plains, and offshore locations.

The main advantage of wind energy is that it is sustainable, non-polluting, and reduces dependence on fossil fuels. Unlike coal or oil, wind power does not release harmful greenhouse gases, making it an effective way to combat climate change. It is also one of the fastest-growing energy sources worldwide due to technological improvements and falling costs of turbines.

Wind energy has many practical applications. It is used to power homes, industries, schools, and businesses through electricity supplied to the grid. In rural or remote areas, smaller wind turbines can provide local electricity where power lines cannot reach. Windmills, the traditional form of wind energy, have long been used for grinding grain and pumping water. Today, modern wind turbines continue to serve both small-scale needs and large-scale power generation.

However, there are challenges with wind power. Since it depends on wind availability, electricity production can vary—low or no wind results in reduced power output. Large wind farms also require significant land or offshore space and may impact local wildlife, such as birds. Despite these challenges, wind energy remains one of the most promising renewable energy technologies for building a sustainable future.

In conclusion, wind energy plays a key role in global efforts to reduce carbon emissions and transition to clean energy. With ongoing advancements, it is expected to become an even greater contributor to meeting the world’s growing energy demands.`,
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
    quiz: [
      {
        question: "Photovoltaic cells primarily convert what into electricity?",
        options: ["Wind", "Sunlight", "Geothermal heat", "Tidal motion"],
        correctAnswer: "Sunlight",
      },
      {
        question:
          "Which renewable source typically relies on flowing or stored water?",
        options: ["Solar", "Hydropower", "Biomass", "Coal"],
        correctAnswer: "Hydropower",
      },
      {
        question:
          "A key economic benefit of wind and solar is that they are...",
        options: [
          "Finite",
          "High in fuel cost",
          "Free of fuel costs",
          "Always available 24/7",
        ],
        correctAnswer: "Free of fuel costs",
      },
    ],
  },
];

export function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<
    (typeof coursesData)[number]
  >(coursesData[0]);
  const [activeTab, setActiveTab] = useState<"articles" | "videos" | "quiz">(
    "articles"
  );
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
                      <button
                        onClick={() => setActiveTab("quiz")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === "quiz"
                            ? "border-green-500 text-green-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Quiz
                      </button>
                    </nav>
                  </div>

                  {/* Content List */}
                  <div className="space-y-4">
                    {activeTab === "articles" ? (
                      selectedCourse.articles.map((article) => (
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
                    ) : activeTab === "videos" ? (
                      selectedCourse.videos.map((video) => (
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
                      ))
                    ) : (
                      <div
                        className="border border-gray-200 rounded-lg p-4"
                        onClick={() =>
                          setSelectedContent({
                            type: "quiz",
                            data: (
                              selectedCourse as unknown as {
                                quiz: QuizQuestion[];
                              }
                            ).quiz,
                          })
                        }
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">
                              Take the quiz
                            </h3>
                            <p className="text-gray-600 text-sm">
                              Test your knowledge for this course.
                            </p>
                          </div>
                        </div>
                      </div>
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
                  {selectedContent.type !== "quiz" ? (
                    <h1 className="text-2xl font-bold text-gray-900">
                      {selectedContent.data &&
                        (
                          selectedContent as {
                            type: "article" | "video";
                            data: { title: string };
                          }
                        ).data.title}
                    </h1>
                  ) : (
                    <h1 className="text-2xl font-bold text-gray-900">
                      Course Quiz
                    </h1>
                  )}
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
                  ) : selectedContent.type === "video" ? (
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
                  ) : (
                    <QuizWithTailwind questions={selectedContent.data} />
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
