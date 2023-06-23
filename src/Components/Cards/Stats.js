import React from "react";
import SkeletonLoader from "./SkeletonLoader";

const Stats = ({
  isLoading,
  studentsCount,
  teachersCount,
  classesCount,
  guardiansCount,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-4">
      {/* student  card */}
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <div className="grid grid-cols-2 bg-purple-100 shadow-md w-full h-28 rounded-lg">
          <div className="place-items-center grid mx-auto my-auto rounded-full bg-white h-24 w-24 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-12 h-12 text-purple-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
              />
            </svg>
          </div>
          <div className="flex flex-col my-auto  ">
            <div>
              <p className="text-4xl text-purple-500 font-semibold">
                {studentsCount}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Students</p>
            </div>
          </div>
        </div>
      )}
      {/* teacher card */}

      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <div className="grid grid-cols-2 bg-blue-100 shadow-md w-full h-28 rounded-lg">
          <div className="place-items-center grid mx-auto my-auto rounded-full bg-white h-24 w-24 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-12 h-12 text-blue-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div className="flex flex-col my-auto  ">
            <div>
              <p className="text-4xl text-blue-500 font-semibold">
                {teachersCount}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Teachers</p>
            </div>
          </div>
        </div>
      )}
      {/* parents card */}
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <div className="grid grid-cols-2 bg-orange-100 shadow-md w-full h-28 rounded-lg">
          <div className="place-items-center grid mx-auto my-auto rounded-full bg-white h-24 w-24 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-12 h-12 text-orange-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>
          </div>
          <div className="flex flex-col my-auto  ">
            <div>
              <p className="text-4xl text-orange-500 font-semibold">
                {guardiansCount}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Guardians</p>
            </div>
          </div>
        </div>
      )}
      {/* classes */}
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <div className="grid grid-cols-2 bg-green-100 shadow-md w-full h-28 rounded-lg">
          <div className="place-items-center grid mx-auto my-auto rounded-full bg-white h-24 w-24 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-12 h-12 text-green-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
              />
            </svg>
          </div>
          <div className="flex flex-col my-auto  ">
            <div>
              <p className="text-4xl text-green-500 font-semibold">
                {classesCount}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Classes</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;
