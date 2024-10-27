import { React, useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    const [menu, setMenu] = useState("home");
    
    return (
        <div className="flex justify-between items-center p-[16px] bg-blue-900">
            <p className="text-white text-[20px] ml-4">Earnings Call Analysis</p>
            <ul className="nav-menu flex items-center list-none gap-[30px] text-[20px] text-white">
                <li onClick={() => { setMenu("home"); }} className="flex-col items-center gap-[3px] cursor-pointer">
                    <NavLink style={{ textDecoration: 'none' }} to='/'>Home</NavLink>
                    {menu === "home" ? <hr /> : null}
                </li>
                <li onClick={() => { setMenu("compare"); }}>
                    <NavLink style={{ textDecoration: 'none' }} to='/compare'>Compare</NavLink>
                    {menu === "compare" ? <hr /> : null}
                </li>
            </ul>
        </div>
    );
};

export default Navbar;
