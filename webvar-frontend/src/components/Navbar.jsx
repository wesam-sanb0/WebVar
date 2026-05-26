// src/components/Navbar.jsx
import { Link, NavLink } from 'react-router-dom';
import { CircleAlert, CreditCard, House, Lock, LogIn, LogOut, Mail, Settings, User, UserCog, UserPlus } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="w-full py-4 px-6 flex items-center justify-between z-10">

                <div className="text-3xl font-bold text-white"><Link to="/" >WebVar</Link></div>

                <div className="flex space-x-6 items-center">
                    <NavLink to="/" className="hover:text-white hover:underline text-cyan-400 transition flex gap-2">
                        <House className=" text-inherit transition" />
                        Home
                    </NavLink>
                    <NavLink to="/about" className="hover:text-white hover:underline text-cyan-400 transition flex gap-2">
                        <CircleAlert className="text-inherit transition" />
                        About
                    </NavLink>
                    <NavLink to="/contact" className="hover:text-white hover:underline text-cyan-400 transition flex gap-2">
                        <Mail className="text-inherit transition" />
                        Contact
                    </NavLink>
                    <div className="group relative">
                    <NavLink
                        to="/profile"
                        className="hover:text-white hover:underline text-cyan-400 transition flex gap-2"
                    >
                        <User className="text-inherit transition" />
                        My Account
                    </NavLink>
                    {/* Dropdown Menu */}
                    <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform -translate-y-2 transition-all duration-300 z-20">
                        <NavLink
                            to="/edit-profile"
                            className="flex items-center gap-2 px-4 py-2 text-cyan-600 hover:bg-gray-500 hover:text-white rounded-t-lg transition"
                        >
                            <UserCog className="w-5 h-5" />
                            Edit profile
                        </NavLink>
                        <NavLink
                            to="/change-password"
                            className="flex items-center gap-2 px-4 py-2 text-cyan-600 hover:bg-gray-500 hover:text-white transition"
                        >
                            <Lock className="w-5 h-5" />
                            change password
                        </NavLink>
                        <NavLink
                            to="/logout"
                            className="flex items-center gap-2 px-4 py-2 text-cyan-600 hover:bg-gray-500 hover:text-white rounded-b-lg transition"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </NavLink>
                    </div>
                </div>
        </div>
            {/* Buttons */}
            <div className="flex space-x-4">
                <Link
                    to="/login"
                    className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition flex items-center space-x-2"
                >
                    <LogIn className="text-white" />
                    <span>Log in</span>
                </Link>
                <Link
                    to="/signup"
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition flex items-center space-x-2"
                >
                    <UserPlus className="text-white" />
                    <span>Sign up</span>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;