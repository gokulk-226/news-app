// Bookmarking Functions with MongoDB Integration
export const bookmarkArticle = async (article, userId, bookmarkedArticles, setBookmarkedArticles) => {
    if (!isBookmarked(article.url, bookmarkedArticles)) {
        try {
            const response = await fetch('/bookmarks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, article })
            });
            if (response.ok) {
                const updatedBookmarks = await fetchBookmarks(userId);
                setBookmarkedArticles(updatedBookmarks);
            }
        } catch (error) {
            console.error('Error adding bookmark:', error);
        }
    }
};

export const removeBookmark = async (url, userId, bookmarkedArticles, setBookmarkedArticles) => {
    try {
        const response = await fetch('/bookmarks', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, url })
        });
        if (response.ok) {
            const updatedBookmarks = await fetchBookmarks(userId);
            setBookmarkedArticles(updatedBookmarks);
        }
    } catch (error) {
        console.error('Error removing bookmark:', error);
    }
};

export const isBookmarked = (url, bookmarkedArticles) => {
    return bookmarkedArticles.some((article) => article.url === url);
};

// Function to fetch bookmarks from MongoDB
export const fetchBookmarks = async (userId) => {
    try {
        const response = await fetch(`/bookmarks/${userId}`);
        return response.ok ? await response.json() : [];
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
        return [];
    }
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
