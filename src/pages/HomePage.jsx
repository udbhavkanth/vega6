import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar/SearchBar';
import ImageGrid from '../components/ImageGrid/ImageGrid';
import './HomePage.css'; // any styling you want

const PEXELS_API_KEY = 'xK4HtN1WVhQe3Lxhs1XzAyjyq0KxYs827irUGcpDcV7b5znpggz7tPsO';

function HomePage() {
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Error handling states
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const itemsPerPage = 12; // images per page

  // Fetch images from Pexels
  const fetchImages = async (query, currentPage) => {
    // Clear any previous error
    setErrorMessage('');

    try {
      const url = `https://api.pexels.com/v1/search?query=${query}&per_page=${itemsPerPage}&page=${currentPage}`;
      const response = await fetch(url, {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      });

      if (!response.ok) {
        // If API responded with an error (400, 401, 500, etc.)
        throw new Error(`Pexels API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      /*
        data => {
          photos: [ { src, alt, ... }, ... ],
          total_results,
          page,
          per_page,
          next_page,
          ...
        }
      */
      if (!data.photos || data.photos.length === 0) {
        setErrorMessage('No results found for this search.');
      } else {
        setImages(data.photos);
        setShowResults(true);
        const computedTotalPages = Math.ceil(data.total_results / itemsPerPage);
        setTotalPages(computedTotalPages);
      }
    } catch (error) {
      // Network error or thrown error from above
      console.error('Fetch error:', error);
      setErrorMessage(error.message || 'An error occurred while fetching images.');
    }
  };

  // When user presses "Search" in SearchBar
  const handleSearch = (query) => {
    // Validate user input (e.g. not empty)
    if (!query.trim()) {
      setErrorMessage('Please enter a valid search query.');
      setShowResults(false);
      setImages([]);
      return;
    }

    setErrorMessage('');
    setSearchQuery(query);
    setPage(1);
    fetchImages(query, 1);
  };

  // Pagination controls
  const handleNextPage = () => {
    if (page < totalPages) {
      const newPage = page + 1;
      setPage(newPage);
      fetchImages(searchQuery, newPage);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      fetchImages(searchQuery, newPage);
    }
  };

  // Navigate to AddCaptionPage, passing selected image
  const handleAddCaption = (imageUrl) => {
    navigate('/add-caption', { state: { imageUrl } });
  };

  return (
    <div className="home-page">
      {/* Display an error if something goes wrong */}
      {errorMessage && (
        <div style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>
          {errorMessage}
        </div>
      )}
      <div class = "user-info"> 
          <p>Udbhav Kanth</p>
          <p>udbhavkanth007@gmail.com</p>
      </div>
      <div className={`search-container ${showResults ? 'top' : 'center'}`}>
        <SearchBar onSearch={handleSearch} />
      </div>

      {showResults && !errorMessage && (
        <>
          <ImageGrid
            images={images.map((photo) => photo.src.medium)}
            onAddCaption={handleAddCaption}
          />

          <div className="pagination-controls">
            <button onClick={handlePrevPage} disabled={page <= 1}>
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page >= totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>

          {/* Link to comply with Pexels guidelines */}
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <a href="https://www.pexels.com" target="_blank" rel="noreferrer">
              Photos provided by Pexels
            </a>
          </div>
        </>
      )}
    </div>
  );
}

export default HomePage;
