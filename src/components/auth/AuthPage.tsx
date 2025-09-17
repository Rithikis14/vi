import React, { useState } from 'react';
import { Leaf } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <Leaf className="h-12 w-12 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">EcoLearn</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join the environmental education revolution
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          {isLogin ? <LoginForm /> : <RegisterForm />}
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-green-600 hover:text-green-500 font-medium"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}