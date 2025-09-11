import React from 'react';

/**
 * MainPanel Component
 * 
 * Universal main content container that wraps all page content
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} The MainPanel component
 */
const MainPanel = ({ children }) => {
  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-[var(--background)]">
      {children}
    </main>
  );
};

export default MainPanel;