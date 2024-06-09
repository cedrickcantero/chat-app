import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (nickname.trim()) {
      navigate('/chat', { state: { nickname } });
    }
  };

  return (
    <div>
      <h1>Enter your nickname</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Nickname"
          required
        />
        <button type="submit">Join Chat</button>
      </form>
    </div>
  );
};

export default Home;
