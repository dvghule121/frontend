import React from 'react';
import { appData } from '../data/data';

/**
 * Dashboard Component
 * 
 * Main dashboard page that displays welcome message
 * 
 * @returns {JSX.Element} The Dashboard component
 */
const Dashboard = () => {
  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center">
          <img 
            src={appData.company.logo} 
            alt={`${appData.company.name} logo`} 
            className="w-24 h-24 bg-white rounded-2xl p-4 shadow-lg"
          />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            Welcome to {appData.company.name}
          </h1>
        </div>
        <div className="text-sm text-muted-foreground">
          Navigate to Profile to start building your resume
        </div>
      </div>
    </div>
  );
};

export default Dashboard;