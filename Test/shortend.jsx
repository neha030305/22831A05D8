import React, { useState } from "react";

function App() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleShorten = async () => {
    if (!longUrl) {
      setError("URL is required");
      return;
    }

    setLoading(true);
    setError("");
    setShortUrl("");

    try {
      const res = await fetch("http://localhost:3000/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ originalUrl: longUrl }),
      });

      const data = await res.json();

      if (res.ok) {
        setShortUrl(data.shortUrl || data.data?.shortUrl || "Unknown response");
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Server not reachable");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}>
      <h1>🔗 Link Shortener</h1>
      <input
        type="text"
        placeholder="Enter URL"
        value={longUrl}
        onChange={(e) => setLongUrl(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "16px",
          marginBottom: "12px",
          borderRadius: "8px",
        }}
      />
      <br />
      <button
        onClick={handleShorten}
        disabled={loading}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "8px",
          backgroundColor: "#4CAF50",
          color: "white",
          cursor: "pointer",
        }}
      >
        {loading ? "Shortening..." : "Shorten"}
      </button>

      {error && <p style={{ color: "red", marginTop: "15px" }}>{error}</p>}

      {shortUrl && (
        <p style={{ marginTop: "20px" }}>
          Shortened URL:{" "}
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
        </p>
      )}
    </div>
  );
}

export default App;
