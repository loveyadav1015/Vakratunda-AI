import { useLocation } from 'react-router-dom';
import ChatWidget from '../components/ChatWidget';

export default function ChatPage() {
  const location = useLocation();
  const initialMessage = location.state?.initialMessage || null;

  return <ChatWidget initialMessage={initialMessage} />;
}
