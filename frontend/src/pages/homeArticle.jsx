import React, { useState } from "react";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "./homeArticle.css"; // <-- Import the CSS

// Demo articles for testing
const demoArticles = [
  {
    _id: "1",
    title: "How to Prepare for Olympiads",
    description: "Tips and tricks to ace your next talent olympiad.",
    category: "Education",
    subcategory: "Olympiad",
    image: "https://images.unsplash.com/photo-1503676382389-4809596d5290",
    slug: "prepare-for-olympiads",
    createdAt: "2025-09-01",
  },
  {
    _id: "2",
    title: "Benefits of Participating in Talent Exams",
    description: "Discover the advantages of joining competitive exams.",
    category: "Education",
    subcategory: "Talent Exams",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
    slug: "benefits-talent-exams",
    createdAt: "2025-09-15",
  },
  {
    _id: "3",
    title: "Olympiad Success Stories",
    description: "Inspiring stories from past winners.",
    category: "Stories",
    subcategory: "Success",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
    slug: "olympiad-success-stories",
    createdAt: "2025-09-20",
  },
  {
    _id: "4",
    title: "Exam Strategies for Students",
    description: "Learn how to manage time and stress during competitive exams.",
    category: "Education",
    subcategory: "Strategy",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    slug: "exam-strategies",
    createdAt: "2025-09-22",
  },
  {
    _id: "5",
    title: "Interview with Olympiad Winner",
    description: "Exclusive interview with last year's gold medalist.",
    category: "Stories",
    subcategory: "Interview",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
    slug: "winner-interview",
    createdAt: "2025-09-25",
  },
];

const HomeArticles = ({ blog = {}, index = 0 }) => {
  const { title, description = "", category, subcategory, image, _id, slug } = blog;
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClick = () => {
    window.location.href = `/blogs/${slug || _id}`;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Unknown Date";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        y: -5,
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="article-card"
      onClick={handleClick}
    >
      <div className="article-image-container">
        <LazyLoadImage
          src={image || "/default-blog.jpg"}
          alt={title || "Blog"}
          effect="blur"
          className="article-image"
          afterLoad={() => setImageLoaded(true)}
        />

        {(subcategory || category) && (
          <span className="article-badge">
            {subcategory || category}
          </span>
        )}

        <span className="article-date">
          {formatDate(blog.createdAt || new Date())}
        </span>
      </div>

      <div className="article-content">
        <h3 className="article-title">
          {title?.length > 90 ? `${title.slice(0, 90)}...` : title}
        </h3>
        <p className="article-desc">
          {description?.length > 120 ? `${description.slice(0, 120)}...` : description}
        </p>
        <div style={{ marginTop: "auto" }}>
          <motion.button
            className="read-more-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            READ MORE
            <motion.svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ width: 18, height: 18 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </motion.svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Demo wrapper to show articles
export default function HomeArticlesDemo() {
  return (
    <div style={{ background: "#f6f8fa", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "48px 24px",
        }}
      >
        <h2 style={{
          fontSize: "2rem",
          fontWeight: 800,
          color: "#166534",
          marginBottom: 32,
          textAlign: "center"
        }}>
          Latest Articles
        </h2>
        <div className="articles-grid">
          {demoArticles.map((blog, idx) => (
            <HomeArticles key={blog._id} blog={blog} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}