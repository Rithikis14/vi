import React from 'react';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          {/* Logo and About */}
          <div className="mb-3 md:mb-0">
            <div className="flex items-center space-x-2 mb-1">
              <Leaf className="h-5 w-5 text-green-400" />
              <span className="text-base font-bold">EcoLearn</span>
            </div>
            <p className="text-gray-300 text-xs max-w-sm">
              Empowering individuals and institutions with environmental education 
              to create a sustainable future for our planet.
            </p>
          </div>

          {/* Contact Info (Right side) */}
          <div className="text-xs">
            <h3 className="font-semibold mb-1">Contact Info</h3>
            <ul className="space-y-1">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">info@ecolearn.edu</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">123 Green St, Eco City</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-3 pt-2 text-center">
          <p className="text-gray-400 text-xs">
            © 2025 EcoLearn. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
}
