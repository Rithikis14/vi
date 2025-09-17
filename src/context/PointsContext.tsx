import React, { createContext, useContext, useEffect, useState } from 'react';

interface PointsContextType {
  totalPoints: number;
  addPoints: (points: number) => void;
  resetPoints: () => void;
  loading: boolean;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

export function PointsProvider({ children }: { children: React.ReactNode }) {
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load points from localStorage
    const savedPoints = localStorage.getItem('totalPoints');
    if (savedPoints) {
      setTotalPoints(parseInt(savedPoints));
    }
    setLoading(false);
  }, []);

  const addPoints = (points: number) => {
    setTotalPoints(prev => {
      const newTotal = prev + points;
      localStorage.setItem('totalPoints', newTotal.toString());
      return newTotal;
    });
  };

  const resetPoints = () => {
    setTotalPoints(0);
    localStorage.removeItem('totalPoints');
  };

  return (
    <PointsContext.Provider value={{ totalPoints, addPoints, resetPoints, loading }}>
      {children}
    </PointsContext.Provider>
  );
}

export function usePoints() {
  const context = useContext(PointsContext);
  if (context === undefined) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
}
