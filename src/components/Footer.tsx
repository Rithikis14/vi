import React from 'react';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Changed py-3 to py-12 for more vertical padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start">
          {/* Logo and About */}
          {/* Increased margin-bottom on mobile (mb-8) */}
          <div className="mb-8 md:mb-0">
            <div className="flex items-center space-x-2 mb-2">
              <Leaf className="h-6 w-6 text-green-400" />
              {/* Increased font size from text-base to text-xl */}
              <span className="text-xl font-bold">EcoLearn</span>
            </div>
            {/* Increased font size from text-xs to text-sm */}
            <p className="text-gray-300 text-sm max-w-sm">
              Empowering individuals and institutions with environmental education 
              to create a sustainable future for our planet.
            </p>
          </div>

          {/* Contact Info (Right side) */}
          {/* Increased font size from text-xs to text-sm */}
          <div className="text-sm">
            {/* Increased font size and margin-bottom */}
            <h3 className="font-semibold text-base mb-3">Contact Info</h3>
            {/* Increased spacing between list items (space-y-2) */}
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">info@ecolearn.edu</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">+91 75500-12345</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">VIT, Kelambakkam, Chennai-100</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        {/* Increased top margin and padding (mt-8 pt-4) */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center">
          {/* Increased font size from text-xs to text-sm */}
          <p className="text-gray-400 text-sm">
            © 2025 EcoLearn. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
}