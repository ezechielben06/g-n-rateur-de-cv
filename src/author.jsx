import React from 'react';
import './author.css';

const AuthorInfo = () => {
  return (
    <div className="author-container">
      <h2>À propos du créateur</h2>
      <div className="author-content">
        <img 
          src="./author.jpg" 
          alt="Auteur" 
          className="author-image"
        />
        <div className="author-details">
          <h3>Hounkpe ezechiel</h3>
          <p>Développeur React passionné par la création d'outils utiles.</p>
          <p>Ce CV Generator a été créé pour aider les gens à produire des CV professionnels facilement.</p>
          <div className="author-links">
            <a href="https://github.com/ezechielben06" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i> GitHub
            </a>
            <a href="https://ezechielben06.netlify.app/" target="_blank" rel="noopener noreferrer">
             Portfolio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorInfo;
