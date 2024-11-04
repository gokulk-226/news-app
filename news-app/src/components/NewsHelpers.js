

// Bookmarking Functions
export const bookmarkArticle = (article, bookmarkedArticles, setBookmarkedArticles) => {
    if (!isBookmarked(article.url, bookmarkedArticles)) {
        setBookmarkedArticles([...bookmarkedArticles, article]);
    }
};

export const removeBookmark = (url, bookmarkedArticles, setBookmarkedArticles) => {
    const updatedBookmarks = bookmarkedArticles.filter((item) => item.url !== url);
    setBookmarkedArticles(updatedBookmarks);
};

export const isBookmarked = (url, bookmarkedArticles) => {
    return bookmarkedArticles.some((article) => article.url === url);
};

// Pagination Functions
export const paginateArticles = (articles, currentPage, itemsPerPage) => {
    if (!articles || !Array.isArray(articles)) return [];
  
    const startIndex = (currentPage - 1) * itemsPerPage;
    return articles.slice(startIndex, startIndex + itemsPerPage);
};

export const handleNextPage = (currentPage, setCurrentPage, newsData, itemsPerPage) => {
    if (currentPage < Math.ceil(newsData.length / itemsPerPage)) {
        setCurrentPage(currentPage + 1);
    }
};

export const handlePrevPage = (currentPage, setCurrentPage) => {
    if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
    }
};

// Render Bookmark Button
export const BookmarkButton = ({ isBookmarked, onClick }) => (
    <button className={`bookmark-button ${isBookmarked ? 'bookmarked' : ''}`} onClick={onClick}>
        {isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
    </button>
);

// Render Pagination Controls
export const PaginationControls = ({ currentPage, totalPages, onNext, onPrev }) => (
    <div className="pagination">
        <button className="pagination-button" onClick={onPrev} disabled={currentPage === 1}>
            Previous
        </button>
        <span className="pagination-info">{`Page ${currentPage} of ${totalPages}`}</span>
        <button className="pagination-button" onClick={onNext} disabled={currentPage === totalPages}>
            Next
        </button>
    </div>
);

// Render Comments Section
export const CommentsSection = ({ onSubmit }) => (
    <div className="comments-section">
        <h4 className="comments-title">Comments</h4>
        <input
            type="text"
            className="comments-input"
            placeholder="Add a comment..."
            onKeyDown={(e) => e.key === 'Enter' && onSubmit(e.target.value)}
        />
    </div>
);
