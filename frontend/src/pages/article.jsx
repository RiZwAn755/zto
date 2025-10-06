import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Components/Footer';
import { baseURL } from '../config/api';

import './article.css'; 

const Article = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${baseURL}/api/blog/slug/${slug}?t=${Date.now()}`);
        setData(res.data.blog || null);
      } catch (err) {
        console.error(err);
        setError('Failed to load article');
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlog();
  }, [slug]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="blog-loading-container">
        <div className="blog-spinner"></div>
        <p className="blog-loading-text">Loading article...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="blog-error-container">
        <div className="blog-error-icon">⚠️</div>
        <h2 className="blog-error-title">Article Not Found</h2>
        <p className="blog-error-message">
          {error || "The article you're looking for doesn't exist or may have been moved."}
        </p>
        <button 
          className="blog-error-button"
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
     
      <div className="blog-article-wrapper">
        <article className="blog-article-container">
          {/* Article Header */}
          <header className="blog-article-header">

            
            <h1 className="blog-article-title">
              {data.title}
            </h1>
            
            <div className="blog-article-meta">
              
              
              <div className="blog-meta-right">
                <time className="blog-publish-date">
                  {formatDate(data.date || data.createdAt)}
                </time>
                <div className="blog-reading-time">
                  • {Math.ceil(data.description?.split(' ').length / 200) || 5} min read
                </div>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {data.image && (
            <div className="blog-featured-image-container">
              <img
                src={data.image}
                alt={data.title}
                className="blog-featured-image"
                loading="lazy"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="blog-article-content">
            <div 
              className="blog-content-html"
              dangerouslySetInnerHTML={{ __html: data.description }}
            />
          </div>

          {/* Article Footer */}
          <footer className="blog-article-footer">
        
        <div className="blog-meta-left">
                <div className="blog-author-info">
                  <img
                    src={'/logo.jpg'}
                    alt={'ZTO-Admin'}
                    className="blog-author-avatar"
                  />
                  <div className="blog-author-details">
                    <span className="blog-author-name">ZTO-Admin</span>
                    <span className="blog-author-role">Content Creation Team</span>
                  </div>
                </div>
              </div>
            
        
          </footer>
        </article>
      </div>

      <Footer />
    </>
  );
};

export default Article;