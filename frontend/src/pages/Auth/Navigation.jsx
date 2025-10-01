import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineMenu,
  AiOutlineClose,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";
import AdminMenu from "../Admin/AdminMenu.jsx";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="w-full bg-gradient-to-r from-pink-500 to-purple-700 shadow-md sticky top-0 z-50 text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center hover:text-orange-300">
            <AiOutlineHome size={22} className="mr-1" />
            <span className="hidden sm:inline">HOME</span>
          </Link>
          <Link to="/shop" className="flex items-center hover:text-orange-300">
            <AiOutlineShopping size={22} className="mr-1" />
            <span className="hidden sm:inline">SHOP</span>
          </Link>
          <Link
            to="/cart"
            className="relative flex items-center hover:text-orange-300"
          >
            <AiOutlineShoppingCart size={22} className="mr-1" />
            <span className="hidden sm:inline">CART</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 px-2 text-xs text-white rounded-full bg-red-600">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
          </Link>
          <Link
            to="/favorite"
            className="flex items-center hover:text-orange-300"
          >
            <FaHeart size={20} className="mr-1" />
            <span className="hidden sm:inline">FAVORITES</span>
            <FavoritesCount />
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4 relative">
          {userInfo ? (
            <>
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-1 hover:text-orange-300 focus:outline-none"
              >
                <span>{userInfo.username}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <ul className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg z-50">
                  {userInfo.isAdmin && (
                    <>
                      <li>
                        <Link
                          to="/admin/dashboard"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/productlist"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          Products
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/categorylist"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          Category
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/orderlist"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          Orders
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/userlist"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          Users
                        </Link>
                      </li>
                    </>
                  )}
                  <li>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={logoutHandler}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </>
          ) : (
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="flex items-center hover:text-orange-300"
              >
                <AiOutlineLogin size={22} className="mr-1" />
                <span>LOGIN</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center hover:text-pink-500"
              >
                <AiOutlineUserAdd size={22} className="mr-1" />
                <span>REGISTER</span>
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={toggleMobileMenu}
          className="md:hidden flex items-center focus:outline-none"
        >
          {mobileMenuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800 text-white px-4 py-4 space-y-3">
          <Link to="/" className="flex items-center hover:text-orange-300">
            <AiOutlineHome className="mr-2" /> Home
          </Link>
          <Link to="/shop" className="flex items-center hover:text-orange-300">
            <AiOutlineShopping className="mr-2" /> Shop
          </Link>
          <Link to="/cart" className="flex items-center hover:text-orange-300 relative">
            <AiOutlineShoppingCart className="mr-2" /> Cart
            {cartItems.length > 0 && (
              <span className="absolute -top-2 right-2 px-2 text-xs text-white rounded-full bg-red-600">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
          </Link>
          <Link to="/favorite" className="flex items-center hover:text-orange-300">
            <FaHeart className="mr-2" /> Favorites
            <FavoritesCount />
          </Link>
          {userInfo ? (
            <>
              <Link to="/profile" className="block hover:text-orange-300">
                Profile
              </Link>
              {userInfo.isAdmin && <AdminMenu />}
              <button
                onClick={logoutHandler}
                className="block text-left hover:text-orange-300 w-full"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block hover:text-orange-300">
                Login
              </Link>
              <Link to="/register" className="block hover:text-pink-500">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navigation;
