import React, { useEffect, useState } from 'react';
import Card from './Card';

const Newsapp = () => {
  const [search, setSearch] = useState("india");
  const [newsData, setNewsData] = useState(null);
  const API_KEY = "b6416b78bc0349dea2c69fd9b3482950";

  const getData = async () => {
    const response = await fetch(`https://newsapi.org/v2/everything?q=${search}&apiKey=${API_KEY}`);
    const jsonData = await response.json();
    console.log(jsonData.articles);
    let dt = jsonData.articles.slice(0, 10);
    setNewsData(dt);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleInput = (e) => {
    setSearch(e.target.value);
  };

  const userInput = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div>
      <nav>
        <div>
          <h1>NewsNow</h1>
        </div>
        <div className="searchBar">
          <input type="text" placeholder="Search News" value={search} onChange={handleInput} />
          <button onClick={getData}>Search</button>
        </div>
      </nav>
      <div>
        <p className="head">Latest Updates</p>
      </div>
      <div className="categoryBtn">
        <button onClick={userInput} value="sports">Sports</button>
        <button onClick={userInput} value="politics">Politics</button>
        <button onClick={userInput} value="entertainment">Entertainment</button>
        <button onClick={userInput} value="health">Health</button>
        <button onClick={userInput} value="fitness">Fitness</button>
      </div>
      <div>
        {newsData ? <Card data={newsData} /> : null}
      </div>
    </div>
  );
};

export default Newsapp;
