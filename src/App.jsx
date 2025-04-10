import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import ImageGallery from './components/ImageGallery';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import LoadMoreBtn from './components/LoadMoreBtn';
import ImageModal from './components/ImageModal';
import { Toaster } from 'react-hot-toast';

const API_KEY = 'iRU1FJbCjL6PtN6q8X1gwk-qWsdJeH8e9DRn8y1cz9Y';
const IMAGES_PER_PAGE = 12; 

const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    if (query) {
      setLoading(true);
      axios
        .get(`https://api.unsplash.com/search/photos`, {
          params: { query, page, per_page: IMAGES_PER_PAGE },
          headers: { Authorization: `Client-ID ${API_KEY}` },
        })
        .then((response) => {
          setImages((prevImages) => [...prevImages, ...response.data.results]);
          setLoading(false);
        })
        .catch((error) => {
          setError({
            message: error.response?.data?.errors?.[0] || 'Something went wrong. Please try again',
            status: error.response?.status,
          });
          setLoading(false);
        });
    }
  }, [query, page]);

  const handleSearch = (newQuery) => {
    if (loading) return;
    setQuery(newQuery);
    setImages([]);
    setPage(1);
  };

  const handleLoadMore = () => {
    if (loading) return;
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    if (page > 1 && images.length > 0) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [page, images]);

  const handleImageClick = (image) => {
    
    setModalImage(null);
    setTimeout(() => {
      setModalImage(image);
    }, 0);
  };

  const handleCloseModal = () => {
    setModalImage(null);
  };

  return (
    <div>
      <SearchBar onSubmit={handleSearch} />
      {error && <ErrorMessage message={error} />}
      <div>
        <ImageGallery images={images} onImageClick={handleImageClick} />
      </div>
      {loading && <Loader />}
      {images.length > 0 && !loading && (
        <LoadMoreBtn onClick={handleLoadMore} />
      )}
      <ImageModal
        isOpen={!!modalImage}
        onRequestClose={handleCloseModal}
        image={modalImage}
      />
      <Toaster />
    </div>
  );
};

export default App;
