import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Gamepad2, Puzzle, Leaf } from "lucide-react";

const games = [
	{
		title: "Snake & Ladder",
		description: "Classify resources as renewable or non-renewable and race to the finish!",
		icon: <Gamepad2 className="h-12 w-12 text-green-600" />,
		path: "/games/snake-ladder",
	},
	{
		title: "Waste Sorting Game",
		description: "Sort waste items into the correct bins and learn about recycling.",
		icon: <Puzzle className="h-12 w-12 text-blue-600" />,
		path: "/games/waste-sorting",
	},
	{
		title: "Carbon Footprint Game",
		description: "Test your knowledge and reduce your carbon footprint!",
		icon: <Leaf className="h-12 w-12 text-lime-600" />,
		path: "/games/carbon-game",
	},
];

export function GamesPage() {
	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			<Navbar />

			{/* Hero Section */}
			<section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
				<div className="max-w-7xl mx-auto px-4 text-center">
					<h1 className="text-4xl md:text-5xl font-bold mb-6">
						Play. Learn. Have Fun!
					</h1>
					<p className="text-lg md:text-xl max-w-3xl mx-auto">
						Explore our interactive games designed to teach sustainability, 
						sharpen your skills, and keep you engaged.
					</p>
				</div>
			</section>

			{/* Games Section */}
			<section className="py-16 bg-gray-50 flex-grow">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							Featured Games
						</h2>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto">
							Choose a game to get started and enjoy learning through play.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{games.map((game, index) => (
							<div
								key={index}
								className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 text-center flex flex-col"
							>
								<div className="mb-4 flex justify-center">{game.icon}</div>
								<h3 className="text-xl font-bold text-gray-900 mb-2">
									{game.title}
								</h3>
								<p className="text-gray-600 mb-6 flex-grow">{game.description}</p>
								<Link
									to={game.path}
									className="block w-full text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
								>
									Get Started
								</Link>
							</div>
						))}
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
}
