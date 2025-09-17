import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState<'individual' | 'school'>('individual');
  const [institutionName, setInstitutionName] = useState('');
  const [institutionType, setInstitutionType] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const institutionDetails = userType === 'school' 
        ? { name: institutionName, type: institutionType }
        : undefined;
      
      await register(email, password, fullName, userType, institutionDetails);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          placeholder="Enter your full name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          placeholder="Enter your email"
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          placeholder="Enter your password"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Account Type
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="individual"
              checked={userType === 'individual'}
              onChange={(e) => setUserType(e.target.value as 'individual')}
              className="mr-2"
            />
            Individual
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="school"
              checked={userType === 'school'}
              onChange={(e) => setUserType(e.target.value as 'school')}
              className="mr-2"
            />
            School/College
          </label>
        </div>
      </div>

      {userType === 'school' && (
        <>
          <div>
            <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700">
              Institution Name
            </label>
            <input
              id="institutionName"
              type="text"
              required
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Enter institution name"
            />
          </div>
          
          <div>
            <label htmlFor="institutionType" className="block text-sm font-medium text-gray-700">
              Institution Type
            </label>
            <select
              id="institutionType"
              required
              value={institutionType}
              onChange={(e) => setInstitutionType(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select type</option>
              <option value="elementary">Elementary School</option>
              <option value="middle">Middle School</option>
              <option value="high">High School</option>
              <option value="college">College</option>
              <option value="university">University</option>
            </select>
          </div>
        </>
      )}
      
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
      >
        {loading ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
}