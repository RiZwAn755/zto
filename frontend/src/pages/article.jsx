import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../components/Footer';

const Article = ({ slug }) => {
  
  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  // Generate structured data for SEO
  const generateStructuredData = (blog) => {
    if (!blog) return null;
    
    const blogUrl = `${baseURL}/blogs/${blog.slug}`;
    
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blog.title,
      "description": blog.description?.replace(/<[^>]+>/g, '').slice(0, 160),
      "image": {
        "@type": "ImageObject",
        "url": blog.image,
        "width": 1920,
        "height": 1080,
        "aspectRatio": "16:9"
      },
      "author": {
        "@type": "Person",
        "name": blog.author || "Admin"
      },
      "publisher": {
        "@type": "Organization",
        "name": "AI Blog",
        "logo": {
          "@type": "ImageObject",
          "url": `${baseURL}/logo.png`
        }
      },
      "datePublished": blog.date || blog.createdAt,
      "dateModified": blog.updatedAt || blog.date || blog.createdAt,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": blogUrl
      },
      "url": blogUrl,
      "articleSection": blog.subcategory || blog.category,
      "keywords": [blog.subcategory || blog.category, "blog", "article", "technology", "startup", "lifestyle"],
      "wordCount": blog.description?.replace(/<[^>]+>/g, '').split(' ').length || 0,
      "commentCount": comments.length,
      "comment": comments.map(comment => ({
        "@type": "Comment",
        "author": {
          "@type": "Person",
          "name": comment.name
        },
        "text": comment.content,
        "dateCreated": comment.createdAt
      }))
    };
  };

  // Fetch blog data
  const fetchBlogData = async () => {
    if (!slug) return;
    try {
      const response = await axios.get(`${baseURL}/api/blog/slug/${slug}`);
      if (response.data.success && response.data.blog && response.data.blog.company === company) {
        setData(response.data.blog);
      } else {
        setData(null);
      }
    } catch (error) {
      console.error('Error fetching blog data:', error);
      setData(null);
    }
  };





  useEffect(() => {
    if (slug) {
      fetchBlogData();
    
    }
  }, [slug]);

  


  return (data ? (
    <>
      <NavbarNew/>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStructuredData(data)) }}
        />
      </Head>
      
      {/* Hero Section */}
      <div className='relative bg-[#00CC91] py-20 px-5 md:px-12 lg:px-28 overflow-hidden'>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}></div>
        </div>
        
        <div className='relative z-10'>
          <div className='text-center my-20 max-w-4xl mx-auto'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className='inline-block bg-[#EEC764] backdrop-blur-sm border border-gray-600 rounded-full px-4 py-2 mb-6'
            >
              <span className='text-[#008000] text-sm font-medium'>{data.subcategory || data.category}</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className='text-4xl md:text-6xl font-bold max-w-[900px] mx-auto leading-tight text-white mb-8 tracking-tight'
            >
              {data.title}
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className='flex flex-col md:flex-row items-center justify-center gap-6 text-[#E5F2EF]'
            >
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-[#EEC764] rounded-full flex items-center justify-center text-[#008000] font-semibold'>
                  {data.author?.charAt(0) || 'A'}
                </div>
                <span className='text-lg font-medium'>By {data.author}</span>
              </div>
              
              <div className='flex items-center gap-2 text-[#E5F2EF]'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className='text-lg'>
                  {new Date(data.createdAt || data.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Blog Content Section */}
      <div className='relative -mt-20 z-20'>
        <div className='mx-5 max-w-4xl md:mx-auto'>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className='relative'
          >
            {/* Updated Image with 16:9 aspect ratio */}
            <div className="relative w-full bg-white rounded-2xl p-2 shadow-2xl">
              <Image 
                className='rounded-2xl w-full' 
                src={data.image} 
                width={1920} 
                height={1080} 
                alt={data.title}
                style={{ 
                  aspectRatio: '16/9', 
                  objectFit: 'cover', 
                  objectPosition: 'center',
                  width: '100%',
                  height: 'auto'
                }}
                priority
              />
            </div>
          </motion.div>
          
          {/* Premium Blog Content Format */}
          <motion.article 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className='mt-12'
          >
            <div 
              className='blog-content-wrapper max-w-none'
              style={{
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                lineHeight: '1.8',
                color: '#1f2937',
                fontSize: '18px',
              }}
            >
              <style jsx>{`
                .blog-content-wrapper {
                  counter-reset: figure-counter;
                }
                
                .blog-content-wrapper h1 {
                  font-size: 2.75rem;
                  font-weight: 800;
                  line-height: 1.1;
                  margin: 3rem 0 2rem 0;
                  color: #0f172a;
                  background: linear-gradient(135deg, #386861 0%, #F7D270 100%);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                  letter-spacing: -0.02em;
                  position: relative;
                }
                
                .blog-content-wrapper h1::after {
                  content: '';
                  position: absolute;
                  bottom: -10px;
                  left: 0;
                  width: 60px;
                  height: 4px;
                  background: linear-gradient(135deg, #386861 0%, #F7D270 100%);
                  border-radius: 2px;
                }
                
                .blog-content-wrapper h2 {
                  font-size: 2.25rem;
                  font-weight: 700;
                  line-height: 1.2;
                  margin: 3rem 0 1.5rem 0;
                  color: #1e293b;
                  position: relative;
                  padding: 1.5rem 2rem;
                  background: linear-gradient(135deg, #f0fdf4 0%, #fefce8 100%);
                  border-radius: 12px;
                  border-left: 5px solid #386861;
                  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
                
                .blog-content-wrapper h2::before {
                  content: '▍';
                  color: #386861;
                  font-size: 2rem;
                  position: absolute;
                  left: 0.5rem;
                  top: 50%;
                  transform: translateY(-50%);
                }
                
                .blog-content-wrapper h3 {
                  font-size: 1.75rem;
                  font-weight: 600;
                  line-height: 1.3;
                  margin: 2.5rem 0 1.25rem 0;
                  color: #334155;
                  position: relative;
                  padding-bottom: 0.5rem;
                  border-bottom: 2px solid #e2e8f0;
                }
                
                .blog-content-wrapper h3::after {
                  content: '';
                  position: absolute;
                  bottom: -2px;
                  left: 0;
                  width: 40px;
                  height: 2px;
                  background: linear-gradient(135deg, #386861 0%, #F7D270 100%);
                }
                
                .blog-content-wrapper h4 {
                  font-size: 1.375rem;
                  font-weight: 600;
                  line-height: 1.4;
                  margin: 2rem 0 1rem 0;
                  color: #475569;
                  position: relative;
                  padding-left: 1rem;
                }
                
                .blog-content-wrapper h4::before {
                  content: '◆';
                  color: #386861;
                  position: absolute;
                  left: 0;
                  font-size: 0.8em;
                }
                
                .blog-content-wrapper p {
                  margin: 1.75rem 0;
                  line-height: 1.8;
                  color: #374151;
                  font-size: 18px;
                  text-align: justify;
                  text-justify: inter-word;
                }
                
                .blog-content-wrapper strong, 
                .blog-content-wrapper b {
                  font-weight: 700;
                  color: #0f172a;
                  background: linear-gradient(120deg, #F7F7D0 0%, #F7D270 35%, #F7F7D0 100%);
                  background-size: 200% 100%;
                  background-position: 100% 0;
                  transition: background-position 0.3s ease;
                  padding: 2px 6px;
                  border-radius: 4px;
                  box-shadow: 0 2px 4px rgba(56, 104, 97, 0.15);
                }
                
                .blog-content-wrapper strong:hover,
                .blog-content-wrapper b:hover {
                  background-position: 0% 0;
                }
                
                .blog-content-wrapper em, 
                .blog-content-wrapper i {
                  font-style: italic;
                  color: #1e293b;
                  background: linear-gradient(120deg, #ddd6fe 0%, #8b5cf6 30%, #ddd6fe 100%);
                  background-size: 200% 100%;
                  background-position: 100% 0;
                  transition: background-position 0.3s ease;
                  padding: 2px 4px;
                  border-radius: 3px;
                }
                
                .blog-content-wrapper em:hover,
                .blog-content-wrapper i:hover {
                  background-position: 0% 0;
                }
                
                .blog-content-wrapper a {
                  color: #386861;
                  text-decoration: none;
                  font-weight: 600;
                  background: linear-gradient(120deg, transparent 0%, transparent 95%, #F7D270 95%);
                  background-size: 0% 100%;
                  background-repeat: no-repeat;
                  transition: all 0.4s ease;
                  border-radius: 2px;
                  padding: 2px 4px;
                  margin: 0 -2px;
                }
                
                .blog-content-wrapper a:hover {
                  background-size: 100% 100%;
                  color: #294944;
                  transform: translateY(-1px);
                  box-shadow: 0 4px 8px rgba(247, 210, 112, 0.4);
                }
                
                .blog-content-wrapper blockquote {
                  border: none;
                  padding: 2rem 2.5rem;
                  margin: 3rem 0;
                  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
                  border-radius: 16px;
                  font-style: italic;
                  color: #334155;
                  position: relative;
                  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
                  border-left: 6px solid #386861;
                  font-size: 1.125rem;
                  line-height: 1.7;
                }
                
                .blog-content-wrapper blockquote::before {
                  content: '"';
                  font-size: 5rem;
                  color: #386861;
                  position: absolute;
                  top: -20px;
                  left: 30px;
                  font-family: serif;
                  opacity: 0.4;
                  font-weight: bold;
                }
                
                .blog-content-wrapper blockquote::after {
                  content: '"';
                  font-size: 3rem;
                  color: #386861;
                  position: absolute;
                  bottom: 10px;
                  right: 30px;
                  font-family: serif;
                  opacity: 0.4;
                  font-weight: bold;
                }
                
                .blog-content-wrapper ul, 
                .blog-content-wrapper ol {
                  margin: 2rem 0;
                  padding-left: 0;
                  list-style: none;
                }
                
                .blog-content-wrapper ul li {
                  margin: 1rem 0;
                  line-height: 1.7;
                  position: relative;
                  padding-left: 2rem;
                  background: linear-gradient(90deg, #f8fafc 0%, transparent 100%);
                  padding: 0.75rem 1rem 0.75rem 2.5rem;
                  border-radius: 8px;
                  border-left: 3px solid #e2e8f0;
                  transition: all 0.3s ease;
                }
                
                .blog-content-wrapper ul li:hover {
                  border-left-color: #386861;
                  background: linear-gradient(90deg, #f1f5f9 0%, transparent 100%);
                }
                
                .blog-content-wrapper ul li::before {
                  content: '●';
                  color: #386861;
                  font-size: 1.5rem;
                  position: absolute;
                  left: 1rem;
                  top: 0.5rem;
                }
                
                .blog-content-wrapper ol li {
                  margin: 1rem 0;
                  line-height: 1.7;
                  position: relative;
                  padding-left: 3rem;
                  counter-increment: item;
                  background: linear-gradient(90deg, #fef7ff 0%, transparent 100%);
                  padding: 0.75rem 1rem 0.75rem 3.5rem;
                  border-radius: 8px;
                  border-left: 3px solid #F7D270;
                }
                
                .blog-content-wrapper ol li::before {
                  content: counter(item);
                  background: linear-gradient(135deg, #386861 0%, #F7D270 100%);
                  color: white;
                  font-weight: bold;
                  font-size: 0.875rem;
                  position: absolute;
                  left: 1rem;
                  top: 0.75rem;
                  width: 1.75rem;
                  height: 1.75rem;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
                
                .blog-content-wrapper img {
                  margin: 2rem auto;
                  border-radius: 16px;
                  width: 85%;
                  max-width: 900px;
                  height: auto;
                  display: block;
                  object-fit: cover;
                  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                  box-shadow: 
                    0 0 0 1px rgba(0, 0, 0, 0.05),
                    0 10px 25px -5px rgba(0, 0, 0, 0.1),
                    0 20px 40px -7px rgba(0, 0, 0, 0.1);
                  position: relative;
                  filter: brightness(0.92) saturate(0.95);
                  aspect-ratio: 16/9;
                }

                @media (max-width: 768px) {
                  .blog-content-wrapper img {
                    width: 100%;
                  }
                }
                
                .blog-content-wrapper img:hover {
                  transform: translateY(-8px) scale(1.02);
                  box-shadow: 
                    0 0 0 1px rgba(0, 0, 0, 0.05),
                    0 25px 50px -12px rgba(0, 0, 0, 0.25),
                    0 40px 60px -15px rgba(0, 0, 0, 0.3);
                }
                
                .blog-content-wrapper img::after {
                  content: '';
                  position: absolute;
                  inset: 0;
                  border-radius: 20px;
                  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.05) 100%);
                  pointer-events: none;
                }
                
                .blog-content-wrapper code {
                  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                  color: #f1f5f9;
                  padding: 0.375rem 0.75rem;
                  border-radius: 6px;
                  font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Menlo', monospace;
                  font-size: 0.875rem;
                  font-weight: 500;
                  border: 1px solid #475569;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                
                .blog-content-wrapper pre {
                  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                  color: #f1f5f9;
                  padding: 2rem;
                  border-radius: 16px;
                  overflow-x: auto;
                  margin: 3rem 0;
                  box-shadow: 
                    0 0 0 1px rgba(255, 255, 255, 0.1),
                    0 20px 25px -5px rgba(0, 0, 0, 0.3);
                  position: relative;
                }
                
                .blog-content-wrapper pre::before {
                  content: '';
                  position: absolute;
                  top: 1rem;
                  left: 1rem;
                  width: 12px;
                  height: 12px;
                  border-radius: 50%;
                  background: #ef4444;
                  box-shadow: 20px 0 0 #f59e0b, 40px 0 0 #22c55e;
                }
                
                .blog-content-wrapper pre code {
                  background: transparent;
                  padding: 0;
                  border-radius: 0;
                  border: none;
                  box-shadow: none;
                  color: inherit;
                }
                
                .blog-content-wrapper table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 3rem 0;
                  background: white;
                  border-radius: 16px;
                  overflow: hidden;
                  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                  border: 1px solid #e2e8f0;
                }
                
                .blog-content-wrapper th, 
                .blog-content-wrapper td {
                  padding: 1.25rem 1.5rem;
                  text-align: left;
                  border-bottom: 1px solid #f1f5f9;
                }
                
                .blog-content-wrapper th {
                  background: linear-gradient(135deg, #386861 0%, #F7D270 100%);
                  color: white;
                  font-weight: 600;
                  font-size: 0.95rem;
                  text-transform: uppercase;
                  letter-spacing: 0.05em;
                }
                
                .blog-content-wrapper tr:nth-child(even) {
                  background: #f8fafc;
                }
                
                .blog-content-wrapper tr:hover {
                  background: #f1f5f9;
                  transform: scale(1.01);
                  transition: all 0.2s ease;
                }
                
                .blog-content-wrapper hr {
                  border: none;
                  height: 2px;
                  background: linear-gradient(90deg, transparent, #386861, #F7D270, transparent);
                  margin: 4rem 0;
                  border-radius: 1px;
                }
                
                .blog-content-wrapper mark {
                  background: linear-gradient(120deg, #fef3c7 0%, #f59e0b 50%, #fef3c7 100%);
                  background-size: 200% 100%;
                  background-position: 100% 0;
                  animation: highlight 2s ease-in-out infinite alternate;
                  padding: 3px 8px;
                  border-radius: 6px;
                  color: #92400e;
                  font-weight: 600;
                  box-shadow: 0 2px 4px rgba(245, 158, 11, 0.2);
                }
                
                @keyframes highlight {
                  to {
                    background-position: 0% 0;
                  }
                }
                
                .blog-content-wrapper p:first-of-type {
                  font-size: 20px;
                  color: #1f2937;
                  font-weight: 400;
                  line-height: 1.75;
                  margin-top: 3rem;
                  position: relative;
                }
                
                .blog-content-wrapper p:first-of-type::first-letter {
                  font-size: 5rem;
                  font-weight: 800;
                  line-height: 1;
                  color: transparent;
                  background: linear-gradient(135deg, #386861 0%, #F7D270 100%);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                  float: left;
                  margin: 8px 12px 0 0;
                  font-family: serif;
                  text-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
                }
              `}</style>
              <div dangerouslySetInnerHTML={{__html: data.description}} />
            </div>
          </motion.article>
        </div>
      </div>
      
      <Footer />
    </>
  ) : data === null ? (
    <h1>Blog not found or loading...</h1>
  ) : (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-[#294944] via-[#386861] to-[#294944]'>
      <div className='text-center max-w-md mx-auto p-8'>
        <div className="relative w-20 h-20 mx-auto mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7D270] to-[#eac25f] rounded-full animate-ping opacity-20"></div>
          <div className="relative w-20 h-20 bg-gradient-to-r from-[#F7D270] to-[#eac25f] rounded-full flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-[#294944]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
        <h2 className='text-2xl font-semibold text-white mb-4'>Loading your content</h2>
        <p className='text-gray-200'>Please wait while we prepare your reading experience...</p>
      </div>
    </div>
  ));
};

export default Article;
