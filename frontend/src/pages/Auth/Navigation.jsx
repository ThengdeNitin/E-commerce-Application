import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
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

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

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
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center hover:text-orange-300">
            <AiOutlineHome size={22} className="mr-1" />
            <span className="hidden md:inline">HOME</span>
          </Link>

          <Link to="/shop" className="flex items-center hover:text-orange-300">
            <AiOutlineShopping size={22} className="mr-1" />
            <span className="hidden md:inline">SHOP</span>
          </Link>

          <Link
            to="/cart"
            className="relative flex items-center hover:text-orange-300"
          >
            <AiOutlineShoppingCart size={22} className="mr-1" />
            <span className="hidden md:inline">CART</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-3 px-2 text-xs text-white hover:text-orange-300 rounded-full">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
          </Link>

          <Link
            to="/favorite"
            className="flex items-center hover:text-orange-300"
          >
            <FaHeart size={20} className="mr-1" />
            <span className="hidden md:inline">FAVORITES</span>
            <FavoritesCount />
          </Link>
        </div>

        <div className="relative">
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
                <ul className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg">
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
            <div className="flex space-x-6">
              <Link
                to="/login"
                className="flex items-center hover:text-orange-300"
              >
                <AiOutlineLogin size={22} className="mr-1" />
                <span className="hidden md:inline">LOGIN</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center hover:text-pink-500"
              >
                <AiOutlineUserAdd size={22} className="mr-1" />
                <span className="hidden md:inline">REGISTER</span>
              </Link>
            </div>
          )}
        </div>
      </div>
      {userInfo?.isAdmin && (
            <div className="">
              <AdminMenu />
            </div>
          )}
    </nav>
  );
};

export default Navigation;
