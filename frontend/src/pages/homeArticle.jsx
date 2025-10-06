import React, { useState, useEffect } from "react";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import axios from "axios";
import "./homeArticle.css"; 
import { baseURL, company } from "../config/api";
import { useNavigate } from "react-router";


const HomeArticles = ({ blog = {}, index = 0 }) => {
  const { title, description = "",  image, _id, slug, createdAt } = blog;
  const [isHovered, setIsHovered] = useState(false);
const navigate = useNavigate();
  const handleClick = (e, id) => {
    e.stopPropagation();
navigate(`/Article/${slug || id}`);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Unknown Date";
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
    } catch {
      return "Unknown Date";
    }
  };

  return (
    <div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.3, ease: "easeOut" } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="article-card"
      onClick={(e) => handleClick(e, slug || _id)}
    >
      <div className="article-image-container">
        <LazyLoadImage
          src={image || "/article.jpg"}
          alt={title || "Blog"}
          effect="blur"
          className="article-image"
        />
       
        <span className="article-date">{formatDate(createdAt || new Date())}</span>
      </div>

      <div className="article-content">
        <h3 className="article-title">
          {title?.length > 90 ? `${title.slice(0, 90)}...` : title}
        </h3>
        <p className="article-desc">
          {description?.length > 120 ? `${description.slice(0, 120)}...` : description}
        </p>
        <div style={{ marginTop: "auto" }}>
          <button
            className="read-more-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => handleClick(e, slug || _id)}
          >
            READ MORE
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ width: 18, height: 18 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Demo wrapper to show articles
export default function HomeArticlesDemo() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/blog/all`);
        const filteredBlogs = response.data?.blogs?.filter((blog) => blog.company === company) || [];
        setArticles(filteredBlogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleSeeMore = () => {
    window.location.href = "/Article";
  };

  return (
    <div style={{ background: "#f6f8fa", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
        <h2
          style={{
            fontSize: "2.5rem",
            fontWeight: 800,
            color: "#660094",
            marginBottom: 32,
            textAlign: "center",
          }}
        >
          Latest Articles
        </h2>

        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
            <div style={{ fontSize: "1.2rem", color: "#660094", fontWeight: 600 }}>Loading articles...</div>
          </div>
        ) : articles.length > 0 ? (
          <div className="articles-grid">
            {articles.map((blog, idx) => (
              <HomeArticles key={blog._id} blog={blog} index={idx} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "16px", color: "#660094" }}>No Articles Found</h3>
            <p>No articles available for Zonal Talent Olympiad at the moment.</p>
          </div>
        )}

        {!isLoading && articles.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
            <button className="see-more-btn" onClick={handleSeeMore}>
              SEE MORE ARTICLES
              <svg style={{ width: 22, height: 22, marginLeft: 8 }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
