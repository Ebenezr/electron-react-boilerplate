import React, { Suspense, useEffect, useState } from "react";
import SchoolUpdate from "../Components/modals/SchoolUpdate";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { HiCheck } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { Toast } from "flowbite-react";
const Setting = () => {
  return (
    <div className="flex flex-col gap-3">
      <SettingsCard />
    </div>
  );
};

export default Setting;

function SettingsCard() {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [schoolResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_BASE_URL}/schools/all`),
      ]);

      return {
        school: schoolResponse?.data,
      };
    } catch (error) {
      throw new Error("Error fetching data");
    }
  };

  const { data } = useQuery(["school-data"], fetchData);
  // reset toast

  useEffect(() => {
    let successToastTimer;
    let errorToastTimer;

    if (showSuccessToast) {
      successToastTimer = setTimeout(() => {
        setShowSuccessToast(false);
      }, 2000);
    }

    if (showErrorToast) {
      errorToastTimer = setTimeout(() => {
        setShowErrorToast(false);
      }, 2000);
    }

    return () => {
      clearTimeout(successToastTimer);
      clearTimeout(errorToastTimer);
    };
  }, [showSuccessToast, showErrorToast]);

  return (
    <Suspense fallback={<SkeletonLoader />}>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">School Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-600">School Name</label>
            <p className="text-gray-800">{data && data.school?.name}</p>
          </div>
          <div>
            <label className="text-gray-600">Email</label>
            <p className="text-gray-800">{data && data.school?.email}</p>
          </div>
          <div>
            <label className="text-gray-600">Phone</label>
            <p className="text-gray-800">{data && data.school?.phone}</p>
          </div>
          <div>
            <label className="text-gray-600">Address</label>
            <p className="text-gray-800">{data && data.school?.address}</p>
          </div>
          <div>
            <label className="text-gray-600">Address 2</label>
            <p className="text-gray-800">{data && data.school?.address2}</p>
          </div>
          <div>
            <label className="text-gray-600">Town</label>
            <p className="text-gray-800">{data && data.school?.town}</p>
          </div>
          <div className="col-span-2">
            <label className="text-gray-600">School Motto</label>
            <p className="text-gray-800">{data && data.school?.school_motto}</p>
          </div>
        </div>
        <button
          className="mt-6 bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-600"
          onClick={() => {
            setUpdateModalOpen(true);
          }}
        >
          Edit Information
        </button>
        <SchoolUpdate
          open={updateModalOpen}
          setShowSuccessToast={setShowSuccessToast}
          setShowErrorToast={setShowErrorToast}
          onClose={() => setUpdateModalOpen(false)}
          objData={data && data?.school}
        />
        {showSuccessToast && (
          <Toast className="absolute bottom-4 left-4">
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
              <HiCheck className="h-5 w-5" />
            </div>
            <div className="ml-3 text-sm font-normal">
              Data Updated Success.
            </div>
            <Toast.Toggle onClick={() => setShowSuccessToast(false)} />
          </Toast>
        )}
        {showErrorToast && (
          <Toast className="absolute bottom-4 left-4">
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
              <IoMdClose className="h-5 w-5" />
            </div>
            <div className="ml-3 text-sm font-normal">Data update failed.</div>
            <Toast.Toggle onClick={() => setShowErrorToast(false)} />
          </Toast>
        )}
      </div>
    </Suspense>
  );
}

function SkeletonLoader() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <h2 className="text-lg font-semibold mb-4 bg-gray-300 text-transparent">
        Loading...
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-gray-600 bg-gray-300 text-transparent block h-4">
            Loading...
          </label>
          <p className="text-gray-800 bg-gray-300 text-transparent block h-4">
            Loading...
          </p>
        </div>
        <div>
          <label className="text-gray-600 bg-gray-300 text-transparent block h-4">
            Loading...
          </label>
          <p className="text-gray-800 bg-gray-300 text-transparent block h-4">
            Loading...
          </p>
        </div>
        <div>
          <label className="text-gray-600 bg-gray-300 text-transparent block h-4">
            Loading...
          </label>
          <p className="text-gray-800 bg-gray-300 text-transparent block h-4">
            Loading...
          </p>
        </div>
        <div>
          <label className="text-gray-600 bg-gray-300 text-transparent block h-4">
            Loading...
          </label>
          <p className="text-gray-800 bg-gray-300 text-transparent block h-4">
            Loading...
          </p>
        </div>
        <div>
          <label className="text-gray-600 bg-gray-300 text-transparent block h-4">
            Loading...
          </label>
          <p className="text-gray-800 bg-gray-300 text-transparent block h-4">
            Loading...
          </p>
        </div>
        <div>
          <label className="text-gray-600 bg-gray-300 text-transparent block h-4">
            Loading...
          </label>
          <p className="text-gray-800 bg-gray-300 text-transparent block h-4">
            Loading...
          </p>
        </div>
        <div className="col-span-2">
          <label className="text-gray-600 bg-gray-300 text-transparent block h-4">
            Loading...
          </label>
          <p className="text-gray-800 bg-gray-300 text-transparent block h-4">
            Loading...
          </p>
        </div>
      </div>
      <button
        className="mt-6 bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-600"
        disabled
      >
        Loading...
      </button>
    </div>
  );
}
