import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const id = localStorage.getItem('userId');
    setUserId(id);
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Your Profile</h2>
      <p><strong>User ID:</strong> {userId}</p>
      {/* You can add more user details if needed */}
    </div>
  );
};

export default Profile;
