import React, { useRef, useState } from 'react';

function App() {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      generateImage();
    }
  };

  const generateImage = async () => {
    const prompt = inputRef.current.value.trim();
    if (!prompt) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const response = await fetch('https://clipdrop-api.co/text-to-image/v1', {
        method: 'POST',
        headers: {
          'x-api-key': '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const blob = await response.blob();
      const imageObjectURL = URL.createObjectURL(blob);
      setImageUrl(imageObjectURL);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>AI Image Generator</h2>
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter your prompt"
        onKeyDown={handleKeyDown}
        style={{
          width: '300px',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      />
      <button
        onClick={generateImage}
        style={{
          marginLeft: '10px',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Generate
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {imageUrl && (
        <div style={{ marginTop: '20px' }}>
          <img
            src={imageUrl}
            alt="Generated result"
            style={{ maxWidth: '100%', borderRadius: '10px' }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
