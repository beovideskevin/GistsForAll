import React from 'react';
import Social from "./Social.jsx";

const About = () => {
    return (
        <section id="about">
            <header className="major">
                <h2>About me</h2>
            </header>
            <p>Hi, my name is Kevin B. Casas. I'm a senior full stack developer, with focus on the backend.
                Over 13 years I have worked in different roles, creating APIs and SaaS products for the financial,
                telecommunications and medical industries.</p>
            <Social/>
        </section>
    );
};

export default About;