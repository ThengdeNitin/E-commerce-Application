import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const AdminMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <button
        className={`fixed top-4 right-4 z-50 bg-[#151515] p-2 rounded-lg md:hidden`}
        onClick={toggleMenu}
      >
        {isMenuOpen ? (
          <FaTimes color="white" size={20} />
        ) : (
          <>
            <div className="w-6 h-0.5 bg-gray-200 my-1"></div>
            <div className="w-6 h-0.5 bg-gray-200 my-1"></div>
            <div className="w-6 h-0.5 bg-gray-200 my-1"></div>
          </>
        )}
      </button>


      <section
        className={`
          fixed top-0 right-0 h-full bg-[#151515] p-6 shadow-lg transform
          transition-transform duration-300 ease-in-out
          ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
          w-64 md:w-48
          overflow-y-auto
          z-40
        `}
      >
        <ul className="list-none mt-8 space-y-2">
          {[
            { to: "/admin/dashboard", label: "Admin Dashboard" },
            { to: "/admin/categorylist", label: "Create Category" },
            { to: "/admin/productlist", label: "Create Product" },
            { to: "/admin/allproductslist", label: "All Products" },
            { to: "/admin/userlist", label: "Manage Users" },
            { to: "/admin/orderlist", label: "Manage Orders" },
          ].map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.to}
                className="block py-2 px-3 rounded-sm hover:bg-[#2E2D2D]"
                style={({ isActive }) => ({
                  color: isActive ? "greenyellow" : "white",
                })}
                onClick={() => setIsMenuOpen(false)} 
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </section>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleMenu}
        />
      )}
    </>
  );
};

export default AdminMenu;
