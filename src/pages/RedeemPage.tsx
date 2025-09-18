import { Link, Route } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

// You can replace this with data from your backend or API
const rewards = [
  {
    title: 'ECO T-Shirt',
    description: 'Redeem our high-quality t-shirts',
    cost: 7200,
    imageUrl: 'https://brownliving.in/cdn/shop/files/whale-kids-unisex-organic-cotton-t-shirt-white-ek-saath-sustainable-kids-t-shirts-brown-living-hn-kt-whale-wh-2-764482.jpg?v=1719903615', // Placeholder image
  },
  {
    title: 'Eco-Friendly Cap',
    description: 'Comes in black or white',
    cost: 6500,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvv5yCGftcQDhtTZN1l1-Ua_ko2Pkoq-rHzQ&s', // Placeholder image
  },
  {
    title: 'Exclusive Eco Kit',
    description: 'Includes t-shirt, keychain, and coaster',
    cost: 9400,
    imageUrl: 'https://image.made-in-china.com/202f0j00ZhjklowyPCbI/Custom-5-Star-Luxury-Eco-Friendly-Biodegradable-Hotel-Guest-Room-Disposable-Amenities-Toiletries-Set-Manufacturers.webp', // Placeholder image
  },
  {
    title: 'Laptop Sleeve',
    description: 'Our exclusive laptop sleeve',
    cost: 9600,
    imageUrl: 'https://5.imimg.com/data5/QD/ZR/KX/SELLER-21589660/laptop-sleeve-15-6-inch.jpg', // Placeholder image
  },
];

// Coin Icon Component
const CoinIcon = () => (
  <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
      clipRule="evenodd"
    />
  </svg>
);


export function RedeemPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Rewards Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Redeem Your Rewards
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Use your hard-earned points to get exclusive items and perks. Thank you for your contribution!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rewards.map((item, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 border-2 ${item.featured ? 'border-orange-400' : 'border-transparent'}`}
              >
                <div className="bg-gray-200 h-48 flex items-center justify-center p-4">
                  <img src={item.imageUrl} alt={item.title} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4 h-12"> 
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-lg font-semibold text-gray-800 bg-gray-100 rounded-full px-3 py-1">
                      <CoinIcon />
                      <span>{item.cost.toLocaleString()}</span>
                    </div>
                  </div>
                  <Link
                    to="/redeem"
                    className="block w-full text-center bg-gray-900 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold"
                  >
                    Redeem
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
