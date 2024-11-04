import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import './Newsapp.css';
import { 
  paginateArticles, 
  bookmarkArticle, 
  removeBookmark, 
  isBookmarked, 
  handleNextPage, 
  handlePrevPage, 
  BookmarkButton 
} from './NewsHelpers';

const Newsapp = () => {
  const [search, setSearch] = useState("India");
  const [searchBar, setSearchBar] = useState("India");
  const [newsData, setNewsData] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16; // Changed from 5 to 10

  const [countries] = useState([
    "India", "United States", "United Kingdom", "Australia", "Canada", 
    "Germany", "France", "Italy", "Spain", "Brazil", 
    "Japan", "China", "Russia", "South Africa", "Mexico", 
    "Argentina"
  ]);

  const API_KEY = "4e968c653fcb4859b897e7b30b06c928";
 
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`https://newsapi.org/v2/everything?q=${search}&apiKey=${API_KEY}`);
        const jsonData = await response.json();
        const filteredArticles = jsonData.articles.filter(article => 
          article.urlToImage && article.title && article.description
        );
        setNewsData(filteredArticles);
        setCurrentPage(1);  // Reset page number on new search
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, [search]);
  

  const handleCategoryClick = (category) => {
    setSearchBar(category);
    setSearch(category);
    setActiveCategory(category);
  };

  const handleCountryClick = (country) => {
    setSearchBar(country);
    setSearch(country);
    setActiveCategory("Countries");
  };

  const paginatedArticles = paginateArticles(newsData || [], currentPage, itemsPerPage);

  return (
    <div className="newsapp-container">
      <nav className="navbar">
        <h1 className="navbar-title">NewsNow</h1>
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
      </nav>

      <div className="category-section">
    {/* Category buttons arranged in a logical order */}
    <button className="category-btn" onClick={() => handleCategoryClick("World")}>World</button>
    <button className="category-btn" onClick={() => handleCategoryClick("India")}>India</button>
    <button className="category-btn" onClick={() => handleCategoryClick("Business")}>Business</button>
    <button className="category-btn" onClick={() => handleCategoryClick("Technology")}>Technology</button>
    <button className="category-btn" onClick={() => handleCategoryClick("Politics")}>Politics</button>
    <button className="category-btn" onClick={() => handleCategoryClick("Sports")}>Sports</button>
    <button className="category-btn" onClick={() => handleCategoryClick("Health")}>Health</button>
    <button className="category-btn" onClick={() => handleCategoryClick("Fitness")}>Fitness</button>
    <button className="category-btn" onClick={() => handleCategoryClick("Education")}>Education</button>
    <button className="category-btn" onClick={() => handleCategoryClick("Jobs")}>Jobs</button>
    <button className="category-btn" onClick={() => handleCategoryClick("Entertainment")}>Entertainment</button>
    <button className="category-btn" onClick={() => handleCategoryClick("Cinema")}>Cinema</button>
    <button className="category-btn" onClick={() => handleCategoryClick("Science")}>Science</button>
    <button className="category-btn" onClick={() => handleCategoryClick("Travel")}>Travel</button>
    <button className="category-btn" onClick={() => handleCategoryClick("Fashion")}>Fashion</button>
    <button className="category-btn" onClick={() => handleCategoryClick("Lifestyle")}>Lifestyle</button>
    <button className="category-btn" onClick={() => handleCategoryClick("Food")}>Food</button>
    <button className="category-btn" onClick={() => setActiveCategory(activeCategory === "Countries" ? null : "Countries")}>
        Countries
    </button>
</div>


      {activeCategory === "Countries" && (
        <div className="country-dropdown">
          {countries.map((country, index) => (
            <button 
              key={index} 
              className="country-btn" 
              onClick={() => handleCountryClick(country)}
            >
              {country}
            </button>
          ))}
        </div>
      )}

      <div className="news-section">
        {paginatedArticles.map((news, index) => (
          <div key={index} className="news-item">
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
                onClick={() => 
                  isBookmarked(news.url, bookmarkedArticles)
                    ? removeBookmark(news.url, bookmarkedArticles, setBookmarkedArticles)
                    : bookmarkArticle(news, bookmarkedArticles, setBookmarkedArticles)
                }
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
          onClick={() => handleNextPage(currentPage, setCurrentPage, newsData, itemsPerPage)}
          disabled={currentPage >= Math.ceil((newsData || []).length / itemsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Newsapp;
