import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import './Newsapp.css';
import { 
  paginateArticles,  
  isBookmarked, 
  handleNextPage, 
  handlePrevPage, 
  BookmarkButton 
} from './NewsHelpers';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles

const Newsapp = () => {
  const [search, setSearch] = useState("India");
  const [searchBar, setSearchBar] = useState("");
  const [newsData, setNewsData] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Popular");
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = "b6416b78bc0349dea2c69fd9b3482950";
  const navigate = useNavigate();

  // Redirect to login if not logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch news articles based on search term
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = search || "India";
        const response = await fetch(`https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const jsonData = await response.json();

        const filteredArticles = jsonData.articles
          .filter(article => article.urlToImage && article.title && article.description)
          .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

        setNewsData(filteredArticles);
        setCurrentPage(1);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [search]);

  // Fetch bookmarks from the server
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch('http://localhost:5000/bookmarks');
        if (!response.ok) throw new Error('Failed to fetch bookmarks');
        const bookmarks = await response.json();
        setBookmarkedArticles(bookmarks.map(bookmark => bookmark.article));
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      }
    };
    fetchBookmarks();
  }, []);

  // Initialize AOS for smooth scroll animations
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in ms
      easing: 'ease-in-out', // Easing function
      once: true, // Trigger animation only once
    });
  }, []);

  const handleBookmarkToggle = async (article) => {
    const isAlreadyBookmarked = isBookmarked(article.url, bookmarkedArticles);
    try {
      if (isAlreadyBookmarked) {
        await fetch('http://localhost:5000/bookmarks', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: article.url })
        });
        setBookmarkedArticles(bookmarkedArticles.filter((item) => item.url !== article.url));
      } else {
        await fetch('http://localhost:5000/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ article })
        });
        setBookmarkedArticles([...bookmarkedArticles, article]);
      }
    } catch (error) {
      console.error('Error updating bookmark:', error);
    }
  };

  const handleCategoryClick = (category) => {
    if (category === "Bookmarks") {
      setActiveCategory("Bookmarks");
    } else {
      setSearch(category);
      setActiveCategory(category);
    }
    setCurrentPage(1);
  };

  const handleCountryClick = (country) => {
    setSearch(country);
    setActiveCategory("Countries");
    setCurrentPage(1);
  };

  const paginatedArticles = activeCategory === "Bookmarks"
    ? paginateArticles(bookmarkedArticles, currentPage, itemsPerPage)
    : paginateArticles(newsData || [], currentPage, itemsPerPage);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/'; // Redirect to login
  };

  return (
    <div className="newsapp-container">
      <nav className="news-navbar">
        <h1 className="news-navbar-title">News Aggregator</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search News....."
            value={searchBar}
            onChange={(e) => setSearchBar(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setSearch(searchBar)}
          />
          <SearchIcon className="search-icon" />
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>
  
      <div className="category-section">
        {["Trending", "Popular", "World", "India", "Tamil Nadu", "Business", "Technology", "Politics", "Sports", "Health", "Education", "Jobs", "Science", "Bookmarks"].map((category) => (
          <button key={category} className="category-btn" onClick={() => handleCategoryClick(category)}>
            {category}
          </button>
        ))}
        <button className="category-btn" onClick={() => setActiveCategory(activeCategory === "Countries" ? null : "Countries")}>
          Countries
        </button>
      </div>
  
      {activeCategory === "Countries" && (
        <div className="country-dropdown">
          {["United States", "United Kingdom", "Australia", "Canada", "Germany", "France", "Italy", "Spain", "Brazil", "Japan", "China", "Russia", "South Africa", "Mexico", "Argentina"].map((country) => (
            <button 
              key={country} 
              className="country-btn" 
              onClick={() => handleCountryClick(country)}
            >
              {country}
            </button>
          ))}
        </div>
      )}
  
      {loading && <p>Loading articles...</p>}
      {error && <p className="error-message">Error: {error}</p>}
  
      {activeCategory === "Bookmarks" && (
        <h2 className="bookmarks-heading">Your Bookmarks</h2>
      )}
  
      <div className="news-section">
        {paginatedArticles.map((news, index) => (
          <div key={index} className="news-item" data-aos="fade-up"> {/* AOS attribute for animation */}
            <img src={news.urlToImage} alt="News" className="news-image" />
            <div className="news-content">
              <h3 className="news-title">
                <a href={news.url} target="_blank" rel="noopener noreferrer" className="title-link">
                  {news.title}
                </a>
              </h3>
              <p className="news-description">{news.description}</p>
              <BookmarkButton 
                isBookmarked={isBookmarked(news.url, bookmarkedArticles)}
                onClick={() => handleBookmarkToggle(news)}
              />
            </div>
          </div>
        ))}
      </div>
  
      <div className="pagination">
        <button onClick={() => handlePrevPage(currentPage, setCurrentPage)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button 
          onClick={() => handleNextPage(currentPage, setCurrentPage, activeCategory === "Bookmarks" ? bookmarkedArticles : newsData, itemsPerPage)}
          disabled={currentPage >= Math.ceil((activeCategory === "Bookmarks" ? bookmarkedArticles.length : newsData.length) / itemsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Newsapp;
