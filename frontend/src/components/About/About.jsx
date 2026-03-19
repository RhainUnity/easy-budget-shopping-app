// src/components/About/About.jsx
import "./About.css";

function About() {
  return (
    <section className="about">
      <h1>About This App</h1>
      <p>
        This app helps users build a shopping list and maintain spending within
        their budget.
      </p>
      <p className="about__author-name">Author: Jeremy Schmidt</p>
    </section>
  );
}

export default About;
