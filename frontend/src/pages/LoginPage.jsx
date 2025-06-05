import { useState } from "react";
import { Eye, EyeOff, X, Mail, Lock, ArrowRight, Earth } from "lucide-react";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const clearEmail = () => {
    setLoginData({ ...loginData, email: "" });
  };

  const clearPassword = () => {
    setLoginData({ ...loginData, password: "" });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-base-200 via-base-100 to-primary/5"
      data-theme="forest"
    >
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-base-100/80 backdrop-blur-sm border border-primary/20 rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            {/* LOGIN FORM SECTION */}
            <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
              {/* LOGO */}
              <div className="mb-8 flex items-center justify-center lg:justify-start gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Earth className="size-8 text-primary" />
                </div>
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent tracking-wider">
                  LangCircle
                </span>
              </div>

              {/* WELCOME SECTION */}
              <div className="mb-8 text-center lg:text-left">
                <h1 className="text-3xl lg:text-4xl font-bold mb-3 bg-gradient-to-r from-base-content to-base-content/70 bg-clip-text text-transparent">
                  Welcome Back
                </h1>
                <p className="text-base-content/70 text-lg">
                  Sign in to continue your streaming journey
                </p>
              </div>

              {/* ERROR MESSAGE DISPLAY */}
              {error && (
                <div className="alert alert-error mb-6 border-0 bg-error/10 text-error">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">
                    {error?.response?.data?.message || error?.message || "An error occurred during login"}
                  </span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                {/* EMAIL INPUT */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-base">Email Address</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-base-content/40" />
                    </div>
                    <input
                      type="email"
                      placeholder="hello@example.com"
                      className="input input-bordered w-full pl-12 pr-12 h-14 text-base bg-base-100 border-base-300 focus:border-primary focus:outline-none transition-all duration-200"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                    {loginData.email && (
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-base-200 rounded-r-lg transition-colors"
                        onClick={clearEmail}
                      >
                        <X className="h-5 w-5 text-base-content/40 hover:text-base-content/70" />
                      </button>
                    )}
                  </div>
                </div>

                {/* PASSWORD INPUT */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-base">Password</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-base-content/40" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••"
                      className="input input-bordered w-full pl-12 pr-20 h-14 text-base bg-base-100 border-base-300 focus:border-primary focus:outline-none transition-all duration-200"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      {loginData.password && (
                        <button
                          type="button"
                          className="pr-2 flex items-center hover:bg-base-200 rounded transition-colors p-2"
                          onClick={clearPassword}
                        >
                          <X className="h-5 w-5 text-base-content/40 hover:text-base-content/70" />
                        </button>
                      )}
                      <button
                        type="button"
                        className="pr-4 flex items-center hover:bg-base-200 rounded transition-colors p-2"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-base-content/40 hover:text-base-content/70" />
                        ) : (
                          <Eye className="h-5 w-5 text-base-content/40 hover:text-base-content/70" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* FORGOT PASSWORD LINK */}
                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-sm text-primary hover:text-primary-focus transition-colors">
                    Forgot your password?
                  </Link>
                </div>

                {/* SUBMIT BUTTON */}
                <button 
                  type="submit" 
                  className="btn btn-primary w-full h-14 text-base font-semibold bg-gradient-to-r from-primary to-primary-focus border-0 hover:shadow-lg transition-all duration-200 group" 
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* DIVIDER */}
                <div className="divider text-base-content/50">or</div>

                {/* SIGN UP LINK */}
                <div className="text-center">
                  <p className="text-base text-base-content/70">
                    Don't have an account?{" "}
                    <Link 
                      to="/signup" 
                      className="text-primary hover:text-primary-focus font-semibold transition-colors hover:underline"
                    >
                      Create one now
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            {/* IMAGE SECTION */}
            <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 items-center justify-center relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
              </div>
              
              <div className="relative z-10 max-w-md p-8 text-center">
                {/* Illustration */}
                <div className="relative aspect-square max-w-sm mx-auto mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl"></div>
                  <img 
                    src="/02.png" 
                    alt="Streaming connection illustration" 
                    className="relative w-full h-full object-contain drop-shadow-2xl" 
                  />
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl lg:text-3xl font-bold text-base-content">
                    Connect & Stream
                    <span className="block text-primary">Worldwide</span>
                  </h2>
                  <p className="text-base-content/70 text-lg leading-relaxed">
                    Join millions of streamers and viewers in high-quality video experiences that bring people together
                  </p>
                  
                  {/* Feature highlights */}
                  <div className="flex justify-center gap-6 mt-8 text-sm">
                    <div className="flex items-center gap-2 text-base-content/60">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      HD Quality
                    </div>
                    <div className="flex items-center gap-2 text-base-content/60">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      Low Latency
                    </div>
                    <div className="flex items-center gap-2 text-base-content/60">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      Secure
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
