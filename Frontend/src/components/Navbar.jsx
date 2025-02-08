import React from 'react';
import '../styles/components/Navbar.scss';

function Navbar() {
    const handleClick = function(target) {
        document.getElementById(target).scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return (
        <div className="Navbar">
            <div className="NavbarLogo">
                <img src={Logo} alt="Cheetraa" />
                <p>CHEETRAA</p>
            </div>
            <div className="NavbarMenu">
                <ul>
                    <li><button className='SpecialButton' onClick={()=> {handleClick('Form')}} >Get Your Early Access</button></li>
                    <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</button></li>
                    <li><button onClick={()=> {handleClick('Form')}}>Contact</button></li>
                    <li><button onClick={()=> {handleClick('AboutUs')}}>About</button></li>
                </ul>
            </div>
        </div>
    );
}

export default Navbar;