import React from 'react';
import './OurTeams.css';

const teamMembers = [
  {
    name: "Farhan Khan",
    role: "Founder & Co-Founder",
    image: "/OurTeams.jpg",
  },
  {
    name: "Rizwan Khan",
    role: "CTO and Co-Founder",
    image: "/OurTeams.jpg",
  },
  {
    name: "Saurabh Yadav",
    role: "Lead Developer and Co-Founder",
    image: "/OurTeams.jpg",
  },
  {
    name: "Ashish Maurya",
    role: "Marketing Head and Co-Founder",
    image: "/OurTeams.jpg",
  },
  {
    name: "MD Furkan",
    role: "An Engineering Student",
    image: "/OurTeams.jpg",
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
