import React, { useEffect, useState } from "react";
import TermUpdate from "../Components/modals/TermUpdate";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Toast } from "flowbite-react";
import { HiCheck } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
const Setting = () => {
  return (
    <div className="flex flex-col gap-3">
      <TermCard />
    </div>
  );
};

export default Setting;

function TermCard() {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState();

  const fetchData = async () => {
    try {
      const [termResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_BASE_URL}/terms/all`),
      ]);

      return {
        term: termResponse?.data?.term,
      };
    } catch (error) {
      throw new Error("Error fetching data");
    }
  };

  const { data } = useQuery(["terms-data"], fetchData);
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
    <>
      {Array.isArray(data?.term) ? (
        data?.term?.map((term) => (
          <div key={term.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
            <h2 className="text-lg font-semibold mb-4">Term Information</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-gray-600">Term Name</label>
                <p className="text-gray-800">{term.name}</p>
              </div>
              <div>
                <label className="text-gray-600">Start Date</label>
                <p className="text-gray-800">
                  {format(new Date(term.startDate), "yyyy-MM-dd")}
                </p>
              </div>
              <div>
                <label className="text-gray-600">End Date</label>
                <p className="text-gray-800">
                  {format(new Date(term.endDate), "yyyy-MM-dd")}
                </p>
              </div>
            </div>
            <button
              className="mt-6 bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-600"
              onClick={() => {
                setUpdateModalOpen(true);
                setSelectedData(term);
              }}
            >
              Edit Term
            </button>
            <TermUpdate
              open={updateModalOpen}
              setShowSuccessToast={setShowSuccessToast}
              setShowErrorToast={setShowErrorToast}
              onClose={() => setUpdateModalOpen(false)}
              objData={selectedData}
            />
          </div>
        ))
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">no data</div>
      )}
      {showSuccessToast && (
        <Toast className="absolute bottom-4 left-4">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <HiCheck className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">Data Updated Success.</div>
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
    </>
  );
}
