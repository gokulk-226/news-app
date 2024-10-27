import React, { useEffect, useState } from 'react';
import './Newsapp.css';

const Newsapp = () => {
  const [search, setSearch] = useState("Education");
  const [newsData, setNewsData] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null); // State to track the active category
  const [countries] = useState([
    "India", "United States", "United Kingdom", "Australia", "Canada", 
    "Germany", "France", "Italy", "Spain", "Brazil", 
    "Japan", "China", "Russia", "South Africa", "Mexico", 
    "Argentina", "South Korea", "Italy" // Added one more country
  ]);

   // List of countries  //b6416b78bc0349dea2c69fd9b3482950
  const API_KEY = "4e968c653fcb4859b897e7b30b06c928";

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`https://newsapi.org/v2/everything?q=${search}&apiKey=${API_KEY}`);
        const jsonData = await response.json();
        
        // Filter out articles with missing fields
        const filteredArticles = jsonData.articles.filter(article => 
          article.urlToImage && article.title && article.description
        );

        setNewsData(filteredArticles.slice(0, 10));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, [search]);

  const handleInput = (e) => {
    setSearch(e.target.value);
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === 'Enter') {
      setSearch(e.target.value);
    }
  };

  const handleCategoryClick = (category) => {
    setSearch(category); // Set the search to the selected category
    setActiveCategory(category); // Update the active category
  };

  const handleCountryClick = (country) => {
    setSearch(country); // Set the search to the selected country
    setActiveCategory("Countries"); // Set active category to Countries
  };

  return (
    <div className="newsapp-container">
      <nav className="navbar">
        <h1 className="navbar-title">NewsNow</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search News"
            value={search}
            onChange={handleInput}
            onKeyDown={handleEnterKeyPress}
          />
        </div>
      </nav>
      <div className="category-section">
        <button className="category-btn" onClick={() => handleCategoryClick("India")}>India</button>
        <button className="category-btn" onClick={() => handleCategoryClick("World")}>World</button>
        <button className="category-btn" onClick={() => handleCategoryClick("Business")}>Business</button>
        <button className="category-btn" onClick={() => handleCategoryClick("Technology")}>Technology</button>
        <button className="category-btn" onClick={() => handleCategoryClick("Sports")}>Sports</button>
        <button className="category-btn" onClick={() => handleCategoryClick("Politics")}>Politics</button>
        <button className="category-btn" onClick={() => handleCategoryClick("Health")}>Health</button>
        <button className="category-btn" onClick={() => handleCategoryClick("Fitness")}>Fitness</button>
        <button className="category-btn" onClick={() => handleCategoryClick("Entertainment")}>Entertainment</button>
        <button className="category-btn" onClick={() => handleCategoryClick("Science")}>Science</button>
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
        {newsData ? (
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
          <p>Loading news...</p>
        )}
      </div>
    </div>
  );
};

export default Newsapp;
