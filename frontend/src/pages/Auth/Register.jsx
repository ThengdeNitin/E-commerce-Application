import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import Loader from "../../components/Loader";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await register({ username, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("User successfully registered");
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="flex flex-wrap justify-center items-start px-4 sm:px-6 md:px-10 py-10 bg-gray-900 min-h-screen gap-10">
      <div className="w-full sm:w-[28rem] md:w-[40rem] mb-10 sm:mb-0 mt-10">
        <h1 className="text-2xl font-semibold mb-6 text-white">Register</h1>

        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-2 border rounded !border-white bg-gray-800 !text-white focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Enter name"
              value={username}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border rounded !border-white bg-gray-800 !text-white focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white mb-1"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full p-2 pr-10 border rounded !border-white bg-gray-800 !text-white focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-white mb-1"
            >
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              className="w-full p-2 pr-10 border rounded !border-white bg-gray-800 !text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-pink-400"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full bg-pink-500 !text-white py-2 rounded-full text-lg hover:bg-pink-600 transition"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          {isLoading && <Loader />}
        </form>

        <p className="mt-4 text-white text-sm">
          Already have an account?{" "}
          <Link
            to={redirect ? `/login?redirect=${redirect}` : "/login"}
            className="text-pink-500 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>

      <div className="hidden sm:block sm:w-[30%] md:w-[40%] mt-10">
        <img
          src="https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2065&q=80"
          alt="Register"
          className="rounded-lg w-full h-auto object-cover"
        />
      </div>
    </section>
  );
};

export default Register;
