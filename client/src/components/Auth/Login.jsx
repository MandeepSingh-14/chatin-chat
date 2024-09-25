import React, { useState ,useNavigate} from "react";
import { login } from "../../apis/auth";
import { toast } from 'react-toastify';
import { VscLoading } from "react-icons/vsc";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaRegEyeSlash } from "react-icons/fa6";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await login({
        email,
        password
      }); 
      console.log(res)
      if (res.status === 201) {
        toast.success('Registration successful!');
      }
    } catch (error) {
      toast.error(error.response.data.error)
    }
    setLoading(false)
  };

  return (
    <div className="text-sm flex items-center justify-center min-h-screen bg-gradient-to-r from-teal-500 via-cyan-600 to-blue-700 ">
      <div className="w-full max-w-[30vw] bg-white rounded-lg shadow-md p-8">
        <h2 className="uppercase text-xl font-[600] text-center text-gray-700">Login</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          
          <div>
            <label htmlFor="email" className="block text-gray-700 font-[500] mb-2">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 font-[500] mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {
                password.length > 0 &&
                <div className="absolute top-3 right-2" onClick={() => {
                  setShowPassword((prevValue) => !prevValue)
                }}>
                  {
                    showPassword ?
                      <FaRegEyeSlash /> :
                      <MdOutlineRemoveRedEye />
                  }
                </div>
              }
            </div>

          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="flex justify-center items-center gap-2  uppercase tracking-wider w-full bg-gradient-to-r from-teal-500 via-cyan-600 to-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              submit
              {
                loading &&
                <>
                  <VscLoading className="animate-spin " />
                </>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
