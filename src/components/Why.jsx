import React from 'react';

const Why = () => {
    return (
        <section>
            <header className="major">
                <h2>Why use gists?</h2>
            </header>
            <div className="features">
                <article>
                    <span className="icon fa-gem"></span>
                    <div className="content">
                        <h3>Utility Scripts and Snippets</h3>
                        <p>They are a convenient way to store and reuse one-off utility scripts or frequently used
                            code snippets.</p>
                    </div>
                </article>
                <article>
                    <span className="icon solid fa-rocket"></span>
                    <div className="content">
                        <h3>No Setup Required</h3>
                        <p>Unlike full repositories, Gists don't require any setup, making them ideal for quick
                            tasks.</p>
                    </div>
                </article>
                <article>
                    <span className="icon solid fa-share"></span>
                    <div className="content">
                        <h3>Easy Sharing</h3>
                        <p>Gists allow developers to share small code snippets, scripts, or notes quickly and easily
                            with a single link.</p>
                    </div>
                </article>
                <article>
                    <span className="icon solid fa-handshake"></span>
                    <div className="content">
                        <h3>Collaboration</h3>
                        <p>Gists are useful for collaborating on small projects or sharing code snippets for
                            review.</p>
                    </div>
                </article>
            </div>
        </section>
    )
}

export default Why;