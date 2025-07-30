import React from 'react';
import './OurTeams.css';
import { FaLinkedin } from 'react-icons/fa';

const teamMembers = [
   {
    name: "Saurabh Yadav",
    role: "Lead Developer and Co-Founder",
    image: "/Saurabh.jpeg",
    linkedin:"https://www.linkedin.com/in/saurabh-yadav-5a1453231/"
  },
  {
    name: "MD Farhan",
    role: "Founder & Co-Founder",
    image: "/FARHAN.jpg",
    linkedin :"https://www.linkedin.com/in/md-farhan-635b80208/"
  },
  {
    name: "Ashish Maurya",
    role: "Marketing Head and Co-Founder",
    image: "/Ashish.jpeg",
    linkedin:"https://www.linkedin.com/in/ashishmaurya06b68b212/"
  },
  {
    name: " MD Rizwan ",
    role: "CTO and Co-Founder",
    image: "/Rizwan.jpg",
     linkedin: "https://www.linkedin.com/in/md-rizwan-3b3141255/"
  }, 
  
   {
    name: "Avaneesh Maurya",
    role: "Lead Developer and Co-Founder",
    image: "/Avaneesh.jpg",
    linkedin:"https://www.linkedin.com/in/avaneesh-maurya-ab1452295/"
  },
  {
    name: "MD Furkan",
    role: "An Engineering Student",
    image: "/Furkan.png",
    linkedin: "https://www.linkedin.com/in/mohammad-furkan-13a4b7340/"   
  },
];

const Team = () => {
  return (
    <div className="team-container">
      <h2 className="team-title">Meet Our Team</h2>
      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <div className="team-card" key={index}>
            <img src={member.image} alt={member.name} className="team-image" />
            <h3>{member.name}</h3>
            <p>{member.role}</p>
            <a href= {member.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                        <FaLinkedin size={30} color="#0e76a8" />
                      </a>
            
          </div>
          
        ))}
      </div>
    </div>
  );
};

export default Team;
