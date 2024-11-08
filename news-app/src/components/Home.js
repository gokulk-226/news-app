import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Newsapp.css';

const Home = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);  // Pagination state

  const API_KEY = "4e968c653fcb4859b897e7b30b06c928";  // Store the API key

  // Fetch trending news articles
  useEffect(() => {
    const getTrendingNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=us&pageSize=5&page=${page}&apiKey=${API_KEY}`
        );
        if (!response.ok) throw new Error('Network response was not ok');
        const jsonData = await response.json();
        setNewsData(jsonData.articles);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    getTrendingNews();
  }, [page]);  // Re-fetch news when page changes

  return (
    <div className="newsapp-container">
      <nav className="news-navbar">
        <h1 className="news-navbar-title">News Aggregator</h1>
        {/* Login Button */}
        <Link to="/login">
          <button>Login</button>
        </Link>
      </nav>

      {/* Add new section for "Trending News For You" */}
      <div className="centered-text">
        <h2>Trending News </h2>
      </div>

      {loading && <p>Loading trending news...</p>}
      {error && <p className="error-message">Error: {error}</p>}

      <div className="news-section">
        {newsData && newsData.length > 0 ? (
          newsData.map((news, index) => (
            <div key={index} className="news-item">
              <img src={news.urlToImage} alt="News" className="news-image" />
              <div className="news-content">
                <h3 className="news-title">
                  <a href={news.url} target="_blank" rel="noopener noreferrer" className="title-link">
                    {news.title}
                  </a>
                </h3>
                <p className="news-description">{news.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No trending news available.</p>
        )}
      </div>

      {/* Pagination Buttons */}
      <div className="pagination">
        <button
          onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage((prevPage) => prevPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
