// apps/chat-client/src/pages/Home.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.scss';

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
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Enter your nickname</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Nickname"
            className={styles.inputField}
            required
          />
          <button type="submit" className={styles.joinButton}>Join Chat</button>
        </form>
      </div>
    </div>
  );
};

export default Home;
