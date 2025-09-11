import React from 'react';
import ProfileBuilder from '../components/ProfileBuilder';

/**
 * Profile Component
 * 
 * User profile page with incremental profile builder
 * 
 * @returns {JSX.Element} The Profile component
 */
const Profile = () => {
  return (
    <div className="h-full flex flex-col">
      <ProfileBuilder />
    </div>
  );
}

export default Profile;