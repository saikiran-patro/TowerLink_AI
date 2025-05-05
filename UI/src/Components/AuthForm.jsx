import useAuthForm from "../hooks/useAuthForm";

export default function AuthForm() {
  
   const [isLogin,setIsLogin,handleChange,handleSubmit,formData] =useAuthForm()

  return (
    <div className="flex justify-center items-center  h-screen bg-transparent authFormContainer">
      {/* Transparent Form with White Shadow & Glass Effect */}
      <div className="backdrop-blur-sm bg-white/5 p-8 rounded-2xl shadow-xl shadow-white/30 w-96 h-[460px] border border-white/20 flex flex-col">
        {/* Toggle Buttons */}
        <div className="flex justify-between mb-6">
          <button
            className={`w-1/2 py-2 text-lg font-bold cursor-pointer transition ${
              isLogin ? "text-white border-b-2 border-blue-400" : "text-gray-400"
            }`}
            onClick={() => setIsLogin(true)}
          >
            DOCK
          </button>
          <button
            className={`w-1/2 cursor-pointer py-2 text-lg font-bold transition ${
              !isLogin ? "text-white border-b-2 border-green-400" : "text-gray-400"
            }`}
            onClick={() => setIsLogin(false)}
          >
            LAUNCH
          </button>
        </div>
        {/* Form Fields */}
        <form className="flex flex-col space-y-6 flex-grow" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="fullName"
              placeholder="Enter your callsign"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full p-3 bg-transparent border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Enter your frequency (email)"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 bg-transparent border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Enter access code"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 bg-transparent border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* Button at the Bottom */}
          <button type="submit" className="cursor-pointer w-full py-3 bg-gray-300 hover:bg-gray-400 text-black font-bold rounded-lg transition mt-auto">
            {isLogin ? "DOCK" : "LAUNCH"}
          </button>
        </form>
      </div>
    </div>
  );
}
