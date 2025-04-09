import { useState } from 'react';
import { sendMessage, generateImage } from './api';

function App() {
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleChat = async () => {
    const res = await sendMessage(chatInput);
    setChatResponse(res.response || res.error);
  };

  const handleImage = async () => {
    const res = await generateImage(imagePrompt);
    if (res.image_url?.image) {
      setImageUrl(`data:image/png;base64,${res.image_url.image}`);
    } else {
      setImageUrl(null);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🤖 Chat</h2>
      <input value={chatInput} onChange={e => setChatInput(e.target.value)} />
      <button onClick={handleChat}>Send</button>
      <pre>{chatResponse}</pre>

      <h2>🎨 Image Generator</h2>
      <input value={imagePrompt} onChange={e => setImagePrompt(e.target.value)} />
      <button onClick={handleImage}>Generate</button>
      {imageUrl && <img src={imageUrl} alt="Generated" />}
    </div>
  );
}

export default App;
