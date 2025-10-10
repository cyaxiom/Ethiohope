import React from 'react';
import NavBar from '@components/Forum/NavBar';
import { Check, AlertCircle, Eye, EyeOff } from 'lucide-react';
import community from '@images/community.jpg';
import { CircleX } from 'lucide-react';
import { useTheme } from '@provider/ThemeProvider/ThemeProvider';

const Register = () => {
  const { isDark } = useTheme();
  // register form state
  const [registerData, setRegisterData] = React.useState({
    username: '',
    email: '',
    password: '',
    repeatPassword: '',
  });

  // password visibility toggle state
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  //error states
  const [errors, setErrors] = React.useState({
    email: '',
    username: '',
    password: '',
    repeatPassword: '',
  });

  // handle form submission
  const handleRegister = (e) => {
    e.preventDefault();
    console.log(registerData);
    // Reset errors
    setErrors({
      email: '',
      username: '',
      password: '',
      repeatPassword: '',
    });

    let valid = true;
    // Basic validation
    if (!registerData.username) {
      setErrors((prev) => ({ ...prev, username: 'Username is required' }));
      valid = false;
    }
    if (!registerData.email.includes('@')) {
      setErrors((prev) => ({ ...prev, email: 'Invalid email address' }));
      valid = false;
    }
    if (registerData.password.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: 'Password must be at least 6 characxters',
      }));
      valid = false;
    }
    if (registerData.password !== registerData.repeatPassword) {
      setErrors((prev) => ({
        ...prev,
        repeatPassword: 'Passwords do not match',
      }));
      valid = false;
    }

    if (valid) {
      //Api call
      console.log('Form is valid. Submitting...');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <NavBar />
      <>
        <div className="flex flex-1  gap-10 p-4 md:pl-20">
          <div className="w-full lg:max-w-md p-8  rounded-lg  flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Join EthioHope Community
            </h2>
            <p
              className={`text-center mb-6 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Get more features and privileges by joining to the most helpful
              community
            </p>
            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <label
                  className={`block text-sm font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-700'
                  }`}
                >
                  Username
                </label>
                <div className="flex items-center mt-1 relative border rounded-md">
                  <input
                    type="text"
                    value={registerData.username}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        username: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded-md  focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {registerData.username && !errors.username ? (
                    <span className="rounded-r-md absolute right-2">
                      <Check size={16} className="text-success" />
                    </span>
                  ) : (
                    <span className="rounded-r-md absolute right-2">
                      <CircleX size={16} className="text-error" />
                    </span>
                  )}
                </div>
                {errors.username && (
                  <p className="text-error text-sm mt-1">{errors.username}</p>
                )}
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-700'
                  }`}
                >
                  Email
                </label>
                <div className="flex items-center mt-1 relative border rounded-md">
                  <input
                    type="text"
                    value={registerData.email}
                    onChange={function (e) {
                      setRegisterData({
                        ...registerData,
                        email: e.target.value,
                      });
                      // validate email on change
                      //email regex
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (emailRegex.test(e.target.value)) {
                        setErrors({
                          ...errors,
                          email: '',
                        });
                      } else {
                        setErrors({
                          ...errors,
                          email: 'Invalid email address',
                        });
                      }
                    }}
                    className="w-full p-2  rounded-md  focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {registerData.email && !errors.email ? (
                    <span className="rounded-r-md absolute right-2">
                      <Check size={16} className="text-success" />
                    </span>
                  ) : (
                    <span className="rounded-r-md absolute right-2">
                      <CircleX size={16} className="text-error" />
                    </span>
                  )}
                </div>
                {errors.email && (
                  <p className="text-error text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-700'
                  }`}
                >
                  Password
                </label>
                <div className="flex items-center mt-1 relative border rounded-md">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
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
                        className={`${
                          isDark ? 'text-gray-400' : 'text-gray-800'
                        } hover:text-gray-600 active:text-gray-500 transition-all`}
                      />
                    ) : (
                      <EyeOff
                        size={18}
                        className={`${
                          isDark ? 'text-gray-400' : 'text-gray-800'
                        } hover:text-gray-600 active:text-gray-500`}
                      />
                    )}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-error text-sm mt-1">{errors.password}</p>
                )}
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-700'
                  }`}
                >
                  Repeat Password
                </label>
                <div className="flex items-center mt-1 relative border rounded-md">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    value={registerData.repeatPassword}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        repeatPassword: e.target.value,
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
                        className={`${
                          isDark ? 'text-gray-400' : 'text-gray-800'
                        } hover:text-gray-600 active:text-gray-500 transition-all`}
                      />
                    ) : (
                      <EyeOff
                        size={18}
                        className={`${
                          isDark ? 'text-gray-400' : 'text-gray-800'
                        } hover:text-gray-600 active:text-gray-500`}
                      />
                    )}
                  </span>
                </div>
                {errors.repeatPassword && (
                  <p className="text-error text-sm mt-1">
                    {errors.repeatPassword}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full p-2 bg-orange-400 text-white rounded-md hover:bg-orange-500"
              >
                REGISTER
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

export default Register;
