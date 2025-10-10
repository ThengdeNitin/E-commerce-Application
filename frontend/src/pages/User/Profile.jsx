import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) {
      setUserName(userInfo.username);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const res = await updateProfile({
        _id: userInfo._id,
        username,
        email,
        password,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20 sm:mt-10">
      <div className="flex flex-col md:flex-row md:justify-center md:space-x-6">
        <div className="w-full md:w-1/2 lg:w-1/3 bg-[#1A1A1A] p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-white text-center md:text-left">
            Profile
          </h2>
          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label className="block text-white mb-1">Name</label>
              <input
                type="text"
                placeholder="Enter name"
                className="w-full p-3 rounded bg-gray-800 !text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-white mb-1">Email Address</label>
              <input
                type="email"
                placeholder="Enter email"
                className="w-full p-3 rounded bg-gray-800 !text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* <div>
              <label className="block text-white mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full p-3 rounded bg-gray-800 !text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-white mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                className="w-full p-3 rounded bg-gray-800 !text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div> */}
{/* 
            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 transition"
              >
                Update
              </button>

              <Link
                to="/user-orders"
                className="w-full sm:w-auto bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700 transition text-center"
              >
                My Orders
              </Link>
            </div>
            {loadingUpdateProfile && <Loader />} */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
