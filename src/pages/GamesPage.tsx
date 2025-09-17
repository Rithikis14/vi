import React from 'react';
import { useNavigate } from 'react-router-dom';

export const GamesPage: React.FC = () => {
	const navigate = useNavigate();
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8">
			<h1 className="text-3xl font-bold mb-8 text-green-700">Select a Game</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<button
					onClick={() => navigate('/games/waste-sorting')}
					className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center hover:bg-green-100 transition cursor-pointer border border-green-200"
				>
					<span className="text-6xl mb-4">🗑️</span>
					<span className="text-xl font-semibold text-gray-800">Waste Sorting Game</span>
				</button>
				{/* Add more game buttons here as needed */}
			</div>
		</div>
	);
};
