import React from 'react';

const Card = ({ data }) => {
  return (
    <div className="cardContainer">
      {data.map((news, index) => (
        <div key={index} className="card">
          <img src={news.urlToImage} alt="News" className="cardImage" />
          <h3 className="title">{news.title}</h3>
          <p><strong>Source:</strong> {news.source.name}</p>
          <p><strong>Author:</strong> {news.author ? news.author : 'Unknown'}</p>
          <p><strong>Published at:</strong> {new Date(news.publishedAt).toLocaleDateString()}</p>
          <button onClick={() => window.open(news.url, '_blank')} className="card button">
            Read More
          </button>
        </div>
      ))}
    </div>
  );
};

export default Card;
