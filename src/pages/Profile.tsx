import React from 'react';
import ProfilePage from './ProfilePage';

// Re-export ProfilePage as Profile for compatibility
const Profile: React.FC = () => {
  return <ProfilePage />;
};

export default Profile;