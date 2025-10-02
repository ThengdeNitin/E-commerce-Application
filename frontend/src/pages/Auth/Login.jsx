import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
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
    try {
      const res = await login({ email, password }).unwrap();

      localStorage.setItem("authToken", res.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: res._id,
          username: res.username,
          email: res.email,
          isAdmin: res.isAdmin,
        })
      );

      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-900 px-4 py-8">
      <div className="w-full md:w-1/2 max-w-md bg-gray-800 p-6 rounded-lg shadow-lg mb-8 md:mb-0">
        <h1 className="text-2xl font-semibold mb-6 text-white">Sign In</h1>
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="block text-white mb-2">Email Address</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded border text-black"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded border text-black"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-pink-500 hover:bg-pink-600 text-white w-full py-2 rounded-lg mb-4"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          {isLoading && <Loader />}
        </form>

        <p className="text-white mt-4 text-center">
          New Customer?{" "}
          <Link
            to={redirect ? `/register?redirect=${redirect}` : "/register"}
            className="text-pink-500 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>

      <div className="hidden md:flex md:w-1/2 justify-center">
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
          alt="Login"
          className="h-auto max-h-[500px] w-full rounded-lg object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
