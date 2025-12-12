# 🎓 ZTO – Zonal Talent Olympiad

ZTO (Zonal Talent Olympiad) is a **full-stack learning platform** built to support **students in rural areas** by providing relevant study materials, online tests, and continuous academic support.  
The system is designed with **performance, scalability, and security** in mind to handle high concurrent user traffic efficiently.

---

## 🚀 Key Highlights

- Full-stack MERN application  
- Optimized backend with **Redis caching & rate limiting**  
- **High-concurrency ready** using Node.js clustering  
- Load-tested using **Autocannon**  
- Designed for scalability and real-world traffic scenarios  

---

## 🧠 Problem Statement

Students in rural areas often lack:
- Quality learning resources  
- Structured tests  
- Continuous academic support  

ZTO aims to bridge this gap by providing a **lightweight, fast, and scalable online learning system** accessible even on low-end devices and unstable networks.

---

## 🛠 Tech Stack

### Frontend
- **React.js**
- Responsive UI optimized for low-bandwidth usage

### Backend
- **Node.js**
- **Express.js**
- **MongoDB** (NoSQL database)

### Performance & Scalability
- **Redis**
  - API response caching (reduces unnecessary DB queries)
  - Rate limiting (protection from abuse & attacks)
- **Node.js Clustering**
  - Utilizes available CPU cores as worker processes (local environment)
- **Autocannon**
  - Load testing and benchmarking of API endpoints

---

## ⚡ Performance Optimizations

### 🔹 Redis Caching
- Cached frequently accessed endpoints
- Significantly reduced repeated database reads
- Improved average response time under heavy load

### 🔹 Redis Rate Limiting
- Prevents brute-force attacks
- Protects APIs from excessive requests
- Ensures fair usage per user/IP

### 🔹 Node.js Clustering
- Uses multiple worker processes based on available CPU cores
- Handles higher concurrency in local/VM environments
- Note: On deployed platforms, horizontal scaling requires paid instances/workers

---

## 📊 Benchmarking & Load Testing

### Autocannon
- Simulated **high concurrent traffic**
- Tested scenarios where multiple users hit the same endpoint simultaneously
- Used to validate:
  - API stability
  - Response time under load
  - System behavior during traffic spikes

---



