import React from 'react';
import NavBar from '@components/Forum/NavBar';
import { Check, AlertCircle, Eye, EyeOff } from 'lucide-react';
import community from '@images/community2.jpg';
import { CircleX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // login form state
  const [logInData, setLogInData] = React.useState({
    username: '',
    password: '',
  });
  // password visibility toggle state
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  //error states
  const [errors, setErrors] = React.useState({
    username: '',
    password: '',
  });
  //navigate hook
  const navigate = useNavigate();

  // handle form submission
  const handleLogin = (e) => {
    e.preventDefault();
    console.log(logInData);
    // Reset errors
    setErrors({
      username: '',
      password: '',
    });

    let valid = true;
    // Basic validation
    if (!logInData.username) {
      setErrors((prev) => ({ ...prev, username: 'Username is required' }));
      valid = false;
    }
    if (!logInData.password) {
      setErrors((prev) => ({ ...prev, password: 'Password is required' }));
      valid = false;
    }
    if (valid) {
      //Api call
      console.log('Form is valid. Submitting...');

      //redirect to forum main page
      navigate('/community/forum');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <>
        <div className="flex flex-1  gap-10 pl-20 ">
          <div className="w-full max-w-md p-8  rounded-lg  flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-4 text-center">
              {' '}
              Welcome back
            </h2>
            <p className="text-center mb-6 text-gray-600">
              Login to your account
            </p>
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="flex items-center mt-1 relative border rounded-md">
                  <input
                    type="text"
                    value={logInData.username}
                    onChange={(e) =>
                      setLogInData({
                        ...logInData,
                        username: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded-md  focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {logInData.username && !errors.username ? (
                    <span className="rounded-r-md absolute right-2">
                      <Check size={16} className="text-green-500" />
                    </span>
                  ) : (
                    <span className="rounded-r-md absolute right-2">
                      <CircleX size={16} className="text-red-500" />
                    </span>
                  )}
                </div>
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="flex items-center mt-1 relative border rounded-md">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    value={logInData.password}
                    onChange={(e) =>
                      setLogInData({
                        ...logInData,
                        password: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded-md  focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <span
                    className="rounded-r-md absolute right-2"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? (
                      <Eye
                        size={18}
                        className="text-gray-800 hover:text-gray-600 active:text-gray-500 transition-all"
                      />
                    ) : (
                      <EyeOff
                        size={18}
                        className="text-gray-800 hover:text-gray-600 active:text-gray-500"
                      />
                    )}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full p-2 bg-orange-400 text-white rounded-md hover:bg-orange-500"
              >
                Login
              </button>
            </form>
          </div>
          <div className="hidden md:block min-h-full flex-1 ml-10 overflow-hidden shadow-lg">
            <img
              src={community}
              alt="Community"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </>
    </div>
  );
};

export default Login;
