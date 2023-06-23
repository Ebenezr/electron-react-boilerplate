import {
  Button,
  Checkbox,
  Label,
  Modal,
  Select,
  TextInput,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const gender = [
  {
    name: "MALE",
    id: "MALE",
  },
  {
    name: "FEMALE",
    id: "FEMALE",
  },
];

const StudentUpdate = ({
  onClose,
  open,
  objData,
  setShowErrorToast,
  setShowSuccessToast,
}) => {
  const [additionalPayments, setAdditionalPayments] = useState({
    food_fee: false,
    bus_fee: false,
    boarding_fee: false,
  });
  useEffect(() => {
    if (Number(objData?.StudentTermFee[0]?.bus_fee) !== 0) {
      setAdditionalPayments((prevState) => ({ ...prevState, bus_fee: true }));
    }
    if (Number(objData?.StudentTermFee[0]?.boarding_fee) !== 0) {
      setAdditionalPayments((prevState) => ({
        ...prevState,
        boarding_fee: true,
      }));
    }
    if (Number(objData?.StudentTermFee[0]?.food_fee) !== 0) {
      setAdditionalPayments((prevState) => ({ ...prevState, food_fee: true }));
    }

    // Cleanup function
    return () => {
      setAdditionalPayments({
        food_fee: false,
        bus_fee: false,
        boarding_fee: false,
      });
    };
  }, [objData]);

  // first_name,last_name,dob,gender
  const FormSchema = z.object({
    id: z.number().optional(),
    first_name: z.string().min(2, { message: "First name is required" }),
    last_name: z.string().min(2, { message: "Last name is required" }),
    dob: z.date(),
    gender: z
      .enum(["MALE", "FEMALE"])
      .refine((value) => value === "MALE" || value === "FEMALE", {
        message: "Gender must be FEMALE' or 'MALE'",
      }),
    // classId: z.string().min(1, { message: "Class is required" }),
  });

  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormSchema),
    reValidateMode: "onChange",
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    reset({
      id: objData?.id ?? 0,
      first_name: objData?.first_name ?? "",
      last_name: objData?.last_name ?? "",
      dob: objData?.dob ? new Date(objData.dob) : new Date(),
      classId: objData?.classId ?? 0,
      gender: objData?.gender ?? "MALE",
    });
  }, [reset, objData]);

  const fetchClassList = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/classes/all`
      );
      return response.data.grade;
    } catch (error) {
      throw new Error("Error fetching guest data");
    }
  };
  const { data: classList } = useQuery(["class-data"], fetchClassList, {
    cacheTime: 10 * 60 * 1000, // cache for 10 minutes
  });

  const updatePost = useMutation(
    (updatedPost) => {
      const { id, ...postData } = updatedPost;
      return axios.patch(`${process.env.REACT_APP_BASE_URL}/student/${id}`, {
        ...postData,
        additionalPayments,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["students-data"]);
        setShowSuccessToast(true);
        reset();
        onClose();
      },
      onError: () => {
        setShowErrorToast(true);
      },
    }
  );
  const { isLoading } = updatePost;
  const classId = watch("classId") ?? "0";
  const onSubmit = async (data) => {
    try {
      const requestData = {
        ...data,
        classId: Number(classId), // Convert the value to a number
      };
      updatePost.mutate(requestData);
    } catch (error) {
      setShowErrorToast(true);
    }
  };

  return (
    <Modal show={open} size="lg" popup={true} onClose={onClose}>
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8 relative z-0">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Update Student
          </h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="first_name" value="First Name" />
                </div>
                <Controller
                  control={control}
                  name="first_name"
                  defaultValue=""
                  render={({ field }) => (
                    <TextInput
                      id="first_name"
                      placeholder="First name"
                      required={true}
                      color={errors.first_name ? "failure" : "gray"}
                      helperText={errors.first_name?.message}
                      {...field}
                    />
                  )}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="last_name" value="Last Name" />
                </div>
                <Controller
                  control={control}
                  name="last_name"
                  defaultValue=""
                  render={({ field }) => (
                    <TextInput
                      id="last_name"
                      placeholder="Last name"
                      required={true}
                      color={errors.last_name ? "failure" : "gray"}
                      helperText={errors.last_name?.message}
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
            {/* dob */}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="dob" value="Date of Birth" />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <Controller
                  control={control}
                  name="dob"
                  render={({ field }) => (
                    <ReactDatePicker
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      dateFormat="yyyy-MM-dd"
                      appearance="default"
                      id="dob"
                      placeholderText="Select date of birth"
                      required={true}
                      onChange={(date) => field.onChange(date)}
                      selected={field.value}
                    />
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="gender" value="Gender" />
                </div>
                <Controller
                  control={control}
                  name="gender"
                  defaultValue=""
                  render={({ field }) => (
                    <div>
                      <Select
                        id="gender"
                        value={field.value}
                        className={`input ${
                          errors.gender ? "failure" : "gray"
                        }`}
                        {...field}
                        required={true}
                      >
                        <option value="" disabled>
                          Select gender
                        </option>
                        {gender.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </Select>
                      {errors.gender && (
                        <span className="text-failure">
                          {errors.gender.message}
                        </span>
                      )}
                    </div>
                  )}
                />
              </div>
              {/* select class */}
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="class" value="Class/Grade" />
                </div>
                <Controller
                  control={control}
                  name="classId"
                  defaultValue={0}
                  render={({ field }) => (
                    <div>
                      <Select
                        id="classId"
                        // type="number"
                        value={field.value}
                        color={`${errors.classId ? "failure" : "gray"}`}
                        required={true}
                        helperText={errors.classId?.message}
                        {...field}
                      >
                        <option value={0} disabled>
                          Select class
                        </option>
                        {classList?.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </Select>
                    </div>
                  )}
                />
              </div>
            </div>
            {/* additional subscription checkboxes (food,bus_fee,boarding) */}
            <div className="py-2">
              <Label>Additional Payments</Label>
              <div className="grid grid-cols-3 gap-[3px] ">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-full border border-gray-300 p-2 rounded-md  flex items-center cursor-pointer hover:bg-gray-200 gap-2 ${
                      additionalPayments?.bus_fee ? "bg-purple-100" : "bg-white"
                    }
                    `}
                  >
                    <Checkbox
                      className="ring-0 focus:ring-0"
                      id="bus_fee"
                      checked={additionalPayments?.bus_fee}
                      onChange={(e) => {
                        setAdditionalPayments({
                          ...additionalPayments,
                          bus_fee: e.target.checked,
                        });
                      }}
                    />
                    <Label
                      className="text-xs whitespace-nowrap"
                      htmlFor="bus_fee"
                    >
                      Bus Fee
                    </Label>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-full border border-gray-300 p-2 rounded-md  flex items-center cursor-pointer hover:bg-gray-200 gap-2 ${
                      additionalPayments?.boarding_fee
                        ? "bg-purple-100"
                        : "bg-white"
                    }
                    `}
                  >
                    <Checkbox
                      className="ring-0 focus:ring-0"
                      id="boarding_fee"
                      checked={additionalPayments?.boarding_fee}
                      onChange={(e) => {
                        setAdditionalPayments({
                          ...additionalPayments,
                          boarding_fee: e.target.checked,
                        });
                      }}
                    />
                    <Label
                      className="text-xs whitespace-nowrap"
                      htmlFor="boarding_fee"
                    >
                      Boarding Fee
                    </Label>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-full border border-gray-300 p-2 rounded-md  flex items-center cursor-pointer
                    gap-2
                    hover:bg-gray-200 ${
                      additionalPayments?.food_fee
                        ? "bg-purple-100"
                        : "bg-white"
                    }
                    `}
                  >
                    <Checkbox
                      className="ring-0 focus:ring-0"
                      id="food_fee"
                      checked={additionalPayments?.food_fee}
                      onChange={(e) => {
                        setAdditionalPayments({
                          ...additionalPayments,
                          food_fee: e.target.checked,
                        });
                      }}
                    />
                    <Label
                      className="text-xs whitespace-nowrap"
                      htmlFor="food_fee"
                    >
                      Food Fee
                    </Label>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full mt-3 flex items-end">
              <Button
                className="ml-auto"
                color="purple"
                type="submit"
                isProcessing={isLoading}
              >
                Save Student
              </Button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default StudentUpdate;
