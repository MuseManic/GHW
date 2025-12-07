'use client'

export default function Register ()
{
    return (
        <>
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Two Factor Authentication</h1>

        <form className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Please enter your Two Factor Authentication Code sent to your email 
            </label>
            <input
              type="number"
              id="2fa"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="2FA code"
            />
          </div>

         
          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Register
          </button>
        </form>

        {/* Divider */}
        <div className="mt-8 flex items-center">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-4 text-sm text-gray-500">Or continue with</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Social Buttons */}
        <div className="mt-6 space-y-3">
          {/* Google */}
          <button
            onClick={() => console.log("Google Register")}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <img
              src="/google-icon.png" // drop a Google icon here
              alt="Register with Google"
              className="w-5 h-5"
            />
            <span className="font-medium">Continue with Google</span>
          </button>

          {/* Apple */}
          <button
            onClick={() => console.log("Apple Register")}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <img
              src="/apple-icon.svg" // drop an Apple icon here
              alt="Register with Apple"
              className="w-5 h-5"
            />
            <span className="font-medium">Continue with Apple</span>
          </button>
        </div>
    
        </div>
    </main>    

        </>
    );
}