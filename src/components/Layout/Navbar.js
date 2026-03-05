import React from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaBell, FaUserCircle } from 'react-icons/fa';
import config from '../../services/config';

const Navbar = () => {
    return (
        <nav className="bg-green-600 text-white fixed w-full z-10 top-0">
            <div className="px-6 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <FaLeaf className="text-2xl" />
                        <Link to="/" className="text-xl font-semibold">
                            {config.APP_NAME}
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <FaBell className="text-xl cursor-pointer hover:text-green-200" />
                        <FaUserCircle className="text-2xl cursor-pointer hover:text-green-200" />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;