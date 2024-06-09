// apps/chat-client/src/components/Conversation.tsx

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import styles from './Conversation.module.scss';

const socket = io(process.env.REACT_APP_API_URL!);

interface Message {
  sender: string;
  message: string;
  time: string;
}

const Conversation: React.FC = () => {
  const location = useLocation();
  const { nickname } = location.state as { nickname: string };
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [userList, setUserList] = useState<string[]>([]);
  const [showEmojis, setShowEmojis] = useState(false);

  useEffect(() => {
    socket.emit('join', nickname);

    socket.on('message', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('userList', (users: string[]) => {
      setUserList(users);
    });

    return () => {
      socket.disconnect();
    };
  }, [nickname]);

  const handleSendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (message.trim()) {
      socket.emit('sendMessage', message);
      setMessage('');
    }
  };

  const addEmoji = (emojiObject: EmojiClickData, event: MouseEvent) => {
    setMessage(message + emojiObject.emoji);
  };

  return (
    <div className={styles.conversationWrapper}>
      <div className={styles.conversationContainer}>
        <div className={styles.messagesContainer}>
          {messages.map((msg, index) => (
            <div key={index} className={styles.message}>
              <strong>{msg.sender}</strong>: {msg.message} <span className={styles.time}>({msg.time})</span>
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className={styles.formContainer}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className={styles.inputField}
            required
          />
          <button type="submit" className={styles.sendButton}>
            Send
          </button>
          <button type="button" className={styles.emojiButton} onClick={() => setShowEmojis(!showEmojis)}>
            😊
          </button>
          {showEmojis && (
            <div style={{ position: 'absolute', bottom: '60px', right: '20px' }}>
              <EmojiPicker onEmojiClick={addEmoji} />
            </div>
          )}
        </form>
      </div>
      <div className={styles.userListContainer}>
        <h3>Users in Chat</h3>
        <ul>
          {userList.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Conversation;
