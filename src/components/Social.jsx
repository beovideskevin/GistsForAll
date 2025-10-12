import React from 'react';

const Social = () => {
    const openWin = (e, url) => {
       e.preventDefault();
       window.electronAPI.send('open-win', url);
    }

    return (
        <ul className="icons social">
            <li><span onClick={e => openWin(e, "https://www.facebook.com/kevinbcasas/")} className="icon brands fa-facebook-f">
                   <span className="label">Facebook</span></span></li>
            <li><span onClick={e => openWin(e, "https://www.instagram.com/kevinbcasas/")} className="icon brands fa-instagram">
                   <span className="label">Instagram</span></span></li>
            <li><span onClick={e => openWin(e, "https://www.linkedin.com/in/beovideskevin/")} className="icon brands fa-linkedin">
                   <span className="label">Linkedin</span></span></li>
            <li><span onClick={e => openWin(e, "https://github.com/beovideskevin")} className="icon brands fa-github">
                   <span className="label">Facebook</span></span></li>
        </ul>
    );
}

export default Social;