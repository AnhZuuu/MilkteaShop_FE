"use client";

import React from "react";
import capyversity from "../../public/capyversity-removebg.png";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <>
      <footer>
        {/* <div className="bg-white dark:bg-gray-800" style={{paddingTop : "2rem"}}> */}
        <div className="bg-white dark:bg-gray-800">

          <div className="container m-auto space-y-8 px-6 text-gray-600 dark:text-gray-200 md:px-12 lg:px-20">
            <div className="grid grid-cols-8 gap-6 md:gap-0">
              <div className="col-span-8 border-r border-gray-300 dark:border-gray-100 md:col-span-2 lg:col-span-3">
                <div className="flex items-center justify-between gap-6 border-b border-white dark:border-gray-800 py-6 md:block md:space-y-6 md:border-none md:py-5">
                  <Image
                    src={capyversity}
                    alt="Capyversity logo"
                    width={200}
                    height={200}
                    style={{ textShadow: "2px 2px 5px black" }}
                  />
                  <div className="flex gap-6" style={{marginLeft: '4rem'}}>
                    <a 
                      href="https://www.facebook.com/profile.php?id=61566054150164"
                      target="blank"
                      aria-label="facebook"
                      className="hover:text-cyan-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        className="bi bi-facebook"
                        viewBox="0 0 16 16"
                      >
                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                      </svg>
                    </a>
                    <a
                      href="https://www.instagram.com/capyversity/?fbclid=IwY2xjawFuBJBleHRuA2FlbQIxMAABHRyz2HkI15JfuzIHztLGM5brDBTAjVj6V3x59X4Sg5MZGOnCadT5gfgXBQ_aem_oAy-8creSf7XU8MaZIPTUQ"
                      target="blank"
                      aria-label="Instagram"
                      className="hover:text-cyan-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        className="bi bi-instagram"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-span-8 md:col-span-6 lg:col-span-5">
                <div className="grid grid-cols-2 gap-6 pb-8 sm:grid-cols-3 md:pl-16">
                  <div>
                    <h6 className="text-lg font-medium text-gray-800 dark:text-gray-200 mt-4">
                     Trường
                    </h6>
                    <ul className="mt-4 list-inside space-y-4">
                      <li>
                        <a href="/schools" className="transition hover:text-cyan-600">
                          Khu vực Mỹ
                        </a>
                      </li>
                      <li>
                        <a href="/schools" className="transition hover:text-cyan-600">
                          Khu vực Anh
                        </a>
                      </li>
                      <li>
                        <a href="/schools" className="transition hover:text-cyan-600">
                          Khu vực Úc
                        </a>
                      </li>
                      {/* <li>
                        <a href="#" className="transition hover:text-cyan-600">
                          Partners
                        </a>
                      </li>
                      <li>
                        <a href="#" className="transition hover:text-cyan-600">
                          Jobs
                        </a>
                      </li> */}
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-lg font-medium text-gray-800 dark:text-gray-200 mt-4">
                      Tin tức
                    </h6>
                    {/* <ul className="mt-4 list-inside space-y-4">
                      <li>
                        <a href="#" className="transition hover:text-cyan-600">
                          About
                        </a>
                      </li>
                      <li>
                        <a href="#" className="transition hover:text-cyan-600">
                          Customers
                        </a>
                      </li>
                      <li>
                        <a href="#" className="transition hover:text-cyan-600">
                          Enterprise
                        </a>
                      </li>
                      <li>
                        <a href="#" className="transition hover:text-cyan-600">
                          Partners
                        </a>
                      </li>
                      <li>
                        <a href="#" className="transition hover:text-cyan-600">
                          Jobs
                        </a>
                      </li>
                    </ul> */}
                  </div>
                  <div>
                    <h6 className="text-lg font-medium text-gray-800 dark:text-gray-200 mt-4">
                      Chia sẻ
                    </h6>
                    {/* <ul className="mt-4 list-inside space-y-4">
                      <li>
                        <a href="#" className="transition hover:text-cyan-600">
                          About
                        </a>
                      </li>
                      <li>
                        <a href="#" className="transition hover:text-cyan-600">
                          School
                        </a>
                      </li>
                      <li>
                        <a href="#" className="transition hover:text-cyan-600">
                          News
                        </a>
                      </li>
                      <li>
                        <a href="#" className="transition hover:text-cyan-600">
                          Blog
                        </a>
                      </li>
                      <li>
                        <a href="#" className="transition hover:text-cyan-600">
                          Consultancy
                        </a>
                      </li>
                    </ul> */}
                  </div>
                </div>
                <div className="flex justify-between border-t border-gray-300 dark:border-gray-100 py-4 pb-8 md:pl-16">
                  <span>
                    &copy; Capyversity - 2024
                  </span>
                  <a className="flex gap-2">
                    <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="bi bi-instagram"
                          viewBox="0 0 16 16"
                        >
                          <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z" />
                      </svg>
                      <span>capyversity@gmail.com</span>                    
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
