'use client'
import Image from "next/image";
import logo from '../../../public/logo.png'
import React, { useState, useEffect } from "react";

const LoginComponent = () => {


  const [isPhone, setIsPhone] = useState(false); // Track whether we are login with phone or username
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);



 return (
    <div className="bg-gradient-to-r from-gray-800 to-black">
      
      <div className="min-h-screen flex items-center justify-center p-4">
        {/* <div className="bg-[#383434] rounded-xl shadow-2xl w-full max-w-md p-8 transform transition-all duration-300"> */}
        <div className="bg-[#00001C] rounded-xl shadow-2xl w-full max-w-md p-8 transform transition-all duration-300">
        <p className="text-gray-400">          
          <a className="text-white hover:underline" href="/">
            {/* <FaHome/> */}
          </a>
        </p>
          {isPhone ? (
            <>
              <div className="text-center">
                <Image
                  src={logo}
                  alt="App Logo"
                  className="w-40 h-40 mx-auto"
                  width={160}
                  height={160}
                />
              </div>
              <h2 className="text-center text-3xl font-extrabold text-white mb-4">
                Số điện thoại nhân viên
              </h2>
            </>
          ) : (
            <>
              <div className="text-center mb-4">
                <Image
                  src={logo}
                  alt="App Logo"
                  className="w-40 h-40 mx-auto"
                  width={160}
                  height={160}
                />
              </div>
              <h2 className="text-center text-3xl font-extrabold text-white mb-4">
                Đăng nhập
              </h2>
            </>
          )}
          {isPhone ? (
            <>
              <label
                htmlFor="phoneNumber"
                className="block text-md font-medium text-white p-3"
              >
                Số điện thoại
              </label>
              <input
                type="text"
                placeholder="Số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 mb-4 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-900 text-white"
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500 mb-2 pl-2">
                  {errors.phoneNumber}
                </p>
              )}

              <button
                // onClick={handleRegister}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Đăng ký
              </button>
            </>
          ) : (
            <>
              <label
                htmlFor="email"
                className="block text-md font-medium text-white p-1"
              >
                Tên đăng nhập
              </label>
              <input
                type="email"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 mb-4 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-900 text-white"
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}

              <label
                htmlFor="password"
                className="block text-md font-medium text-white p-1"
              >
                Mật khẩu
              </label>

              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-900 text-white"
                placeholder="Nhập mật khẩu"
                aria-label="Password"
                autoComplete="current-password"
                style={{ colorScheme: "dark" }}
              />
              {errors.password && (
                <p className="w-full  mb-4 text-red-500">{errors.password}</p>
              )}

              <button
                // onClick={handleLogin}
                className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Đăng nhập
              </button>
            </>
          )}

          <p className="mt-4 text-gray-400 text-center">
            {isPhone ? (
              <>
                Sử dụng tên đăng nhập?{" "}
                <a
                  href="#"
                  onClick={() => setIsPhone(false)}
                  className="text-blue-400 hover:underline"
                >
                  Đăng nhập
                </a>
              </>
            ) : (
              <>
                Sử dụng số điện thoại để đăng nhập?{" "}
                <a
                  href="#"
                  onClick={() => setIsPhone(true)}
                  className="text-blue-400 hover:underline"
                >
                  Tại đây
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
 )
}

export default LoginComponent;