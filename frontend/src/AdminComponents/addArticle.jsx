import axios from "axios";
import { useState } from "react";
import './addArticle.css'

const AddArticle = () => {
  const baseURL = import.meta.env.VITE_BASE_URL;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubcategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      title,
      description,
      category,
      subCategory,
    };

    try {
      await axios.post(`${baseURL}/addArticle`, formData);
      alert("Blog added successfully");
      setTitle("");
      setDescription("");
      setCategory("");
      setSubcategory("");
    } catch  {
      alert("Failed to add blog");
    }
  };

  return (
    <>
      <div className="add-article-container">
        <img src="/teacher.png" />
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            placeholder="Title of the blog"
            required
          />
          <input
            type="text"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            placeholder="Enter the description"
            required
          />


          <label htmlFor="category">Select category of the blog</label>
          <select
            onChange={(e) => setCategory(e.target.value)}
            name="category"
            id="category"
            value={category}
            required
          >
            <option value="">Select category</option>
            <option value="ZTO">ZTO</option>
            <option value="NEWS">NEWS</option>
            <option value="STORY">STORY</option>
            <option value="EDUCATION">EDUCATION</option>
            <option value="EXAMS">EXAMS</option>
          </select>
            <label htmlFor="category">Select sub-category of the blog</label>
          <select
            onChange={(e) => setSubcategory(e.target.value)}
            name="category"
            id="category"
            value={subCategory}
            required
          >
            <option value="">Select category</option>
            <option value="ZTO">ZTO</option>
            <option value="NEWS">NEWS</option>
            <option value="STORY">STORY</option>
            <option value="EDUCATION">EDUCATION</option>
            <option value="EXAMS">EXAMS</option>
          </select>
          <button type="submit">Add blog</button>
        </form>
      </div>
    </>
  );
};

export default AddArticle;