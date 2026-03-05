import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    FaHome, 
    FaTag, 
    FaFileAlt, 
    FaHistory, 
    FaLeaf,
    FaChartBar,
    FaWhatsapp 
} from 'react-icons/fa';

const Sidebar = () => {
    const menuItems = [
        { path: '/dashboard', name: 'Dashboard', icon: FaHome },
        { path: '/module1', name: 'Category Generator', icon: FaTag },
        { path: '/module2', name: 'Proposal Generator', icon: FaFileAlt },
        { path: '/logs', name: 'AI Prompt Logs', icon: FaHistory },
    ];

    return (
        <aside className="bg-white w-64 fixed h-full shadow-lg mt-16">
            <div className="p-4">
                <div className="mb-6 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 text-green-600">
                        <FaLeaf />
                        <span className="font-medium">Sustainable Commerce</span>
                    </div>
                </div>
                <nav className="space-y-2">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                    isActive
                                        ? 'bg-green-600 text-white'
                                        : 'text-gray-600 hover:bg-green-50'
                                }`
                            }
                        >
                            <item.icon />
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>
            
            <div className="absolute bottom-0 w-full p-4 border-t">
                <div className="flex items-center space-x-2 text-gray-600">
                    <FaWhatsapp className="text-green-500" />
                    <span className="text-sm">AI Support Active</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;