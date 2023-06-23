import { Avatar, Button, Sidebar, ToggleSwitch } from "flowbite-react";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";

import stud from "./svg/stud";
import dash from "./svg/dash";
import usericon from "./svg/usericon";
import guardicon from "./svg/guardicon";
import gearicon from "./svg/gearicon";
import reporticon from "./svg/reporticon";
import payicon from "./svg/payicon";
import classicon from "./svg/classicon";
import teachericon from "./svg/teachericon";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useIsAuthenticated } from "../utils/hooks/localstorage";
import { ThemeContext } from "../context/ThemeContext";
const Aside = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const { isAuthenticated, expiresAt, name, role } = useIsAuthenticated();

  const initials = name
    ?.split(" ")
    .map((namePart) => namePart.charAt(0))
    .join("");

  useEffect(() => {
    let sessionTimeout;

    if (isAuthenticated && expiresAt) {
      // Calculate the remaining time until session timeout
      const remainingTime = expiresAt - Date.now();
      // logout the user if the remaining time is less than 10 seconds
      if (remainingTime < 10000) {
        localStorage.removeItem("authObject");
        navigate("/");
      }
    }

    // Cleanup function to clear session timeout when component unmounts
    return () => {
      clearTimeout(sessionTimeout);
    };
  }, [isAuthenticated, navigate, expiresAt]);

  function signOutUser() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authObject");
    }
    navigate("/");
  }

  return (
    <section
      className={`w-fit h-screen flex shadow-md  rounded-none flex-col ${
        isDark ? "dark bg-gray-800" : ""
      }`}
    >
      <Sidebar aria-label="Sidebar Menu" className="rounded-none">
        <Sidebar.Logo href="#" img="favicon.png" imgAlt="">
          Nakuru Vic Sch
        </Sidebar.Logo>
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item as={Link} to="/dashboard" icon={dash}>
              Dashboard
            </Sidebar.Item>

            <Sidebar.Item as={Link} to="/teachers" icon={teachericon}>
              Teachers
            </Sidebar.Item>

            <Sidebar.Item as={Link} to="/classes" icon={classicon}>
              Classes
            </Sidebar.Item>

            <Sidebar.Item as={Link} to="/students" icon={stud}>
              Students
            </Sidebar.Item>

            <Sidebar.Item as={Link} to="/guardians" icon={guardicon}>
              Guardians
            </Sidebar.Item>

            <Sidebar.Item as={Link} to="/payments" icon={payicon}>
              Payments
            </Sidebar.Item>
            <Sidebar.Item as={Link} to="/additional-payments" icon={payicon}>
              Additional Payments
            </Sidebar.Item>
            <Sidebar.Collapse label="Reports" icon={reporticon}>
              <Sidebar.Item as={Link} to="/studentclassreport">
                Class Report
              </Sidebar.Item>
            </Sidebar.Collapse>

            <Sidebar.Item as={Link} to="/users" icon={usericon}>
              Users
            </Sidebar.Item>
            <Sidebar.Collapse label="Settings" icon={gearicon}>
              <Sidebar.Item as={Link} to="/school">
                School Info
              </Sidebar.Item>
              <Sidebar.Item as={Link} to="/calendar">
                Academic Calender
              </Sidebar.Item>
            </Sidebar.Collapse>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
        <Sidebar.ItemGroup>
          <ToggleSwitch
            label={!isDark ? "Light Mode" : "Dark Mode"}
            checked={isDark}
            onChange={toggleTheme}
            className="my-4 mx-2 mb-auto"
          >
            {isDark ? <FaSun /> : <FaMoon />}
          </ToggleSwitch>
          <div
            className={`flex flex-col justify-center w-full px-2 py-4 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <div className="flex items-end  pb-6 w-full ">
              <Avatar placeholderInitials={initials} rounded={true}>
                <div className="space-y-1 font-medium dark:text-white">
                  <div>{name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {role}
                  </div>
                </div>
              </Avatar>
            </div>
            <div>
              <Button
                className="mx-auto w-full"
                color="purple"
                onClick={signOutUser}
              >
                Sign out
                <CiLogout className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </Sidebar.ItemGroup>
      </Sidebar>
    </section>
  );
};

export default Aside;
