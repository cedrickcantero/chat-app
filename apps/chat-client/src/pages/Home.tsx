import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.scss';

const Home: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const checkNickname = async (nickname: string) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/check-nickname?nickname=${nickname}`);
    const data = await response.json();
    return data.exists;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (nickname.trim()) {
      const exists = await checkNickname(nickname);
      if (exists) {
        setError('Nickname already exists. Please choose another one.');
      } else {
        navigate('/chat', { state: { nickname } });
      }
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
            onChange={(e) => {
              setNickname(e.target.value);
              setError('');
            }}
            placeholder="Nickname"
            className={styles.inputField}
            required
          />
          <button type="submit" className={styles.joinButton}>Join Chat</button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default Home;
