import React from 'react'
import './ProfileCard.css' ;
function ProfileCard({ name, email, job, img, instagram, linkedln }) {
  // const []
  return (
    <div className="profile-card">
      <img src={img} alt={name} className="profile-img" />
      <h2>{name}</h2>
      <h3>{email}</h3>
      <p>{job}</p>
      <div className="social-links">
        <a href={instagram} target="_blank" rel="noreferrer">Instagram</a>
        <a href={linkedln} target="_blank" rel="noreferrer">Linkedln</a>
      </div>
    </div>
  );
}

export default ProfileCard;
