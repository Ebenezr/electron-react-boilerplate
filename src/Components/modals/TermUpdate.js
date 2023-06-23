import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TermUpdate = ({
  onClose,
  open,
  objData,
  setShowErrorToast,
  setShowSuccessToast,
}) => {
  // first_name,last_name,dob,gender
  const FormSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(2, { message: "Name is required" }),
    startDate: z.date(),
    endDate: z.date(),
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
      name: objData?.name ?? "",
      startDate: objData?.startDate ? new Date(objData.startDate) : new Date(),
      endDate: objData?.endDate ? new Date(objData.endDate) : new Date(),
    });
  }, [reset, objData]);

  const updatePost = useMutation(
    (updatedPost) => {
      const { id, ...postData } = updatedPost;
      return axios.patch(
        `${process.env.REACT_APP_BASE_URL}/term/${id}`,
        postData
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["terms-data"]);
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

  const onSubmit = async (data) => {
    try {
      updatePost.mutate(data);
    } catch (error) {
      setShowErrorToast(true);
    }
  };

  return (
    <Modal show={open} size="md" popup={true} onClose={onClose}>
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8 relative z-0">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Update Term
          </h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Label
                htmlFor="id"
                value="ID"
                color={`${errors.id ? "failure" : "gray"}`}
              />
              <Controller
                control={control}
                name="id"
                defaultValue={objData?.id ?? 0}
                render={({ field }) => (
                  <TextInput
                    id="id"
                    placeholder="ID"
                    required={true}
                    color={`${errors.id ? "failure" : "gray"}`}
                    helperText={errors.id?.message}
                    {...field}
                    disabled={true}
                  />
                )}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Name" />
              </div>
              <Controller
                control={control}
                name="name"
                defaultValue=""
                render={({ field }) => (
                  <TextInput
                    id="name"
                    placeholder="Name"
                    required={true}
                    color={errors.name ? "failure" : "gray"}
                    helperText={errors.name?.message}
                    {...field}
                  />
                )}
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="startDate" value="Start Date" />
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
                  name="startDate"
                  render={({ field }) => (
                    <ReactDatePicker
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      dateFormat="yyyy-MM-dd"
                      appearance="default"
                      id="startDate"
                      placeholderText="Select start date"
                      required={true}
                      onChange={(date) => field.onChange(date)}
                      selected={field.value}
                    />
                  )}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="endDate" value="End Date" />
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
                  name="endDate"
                  render={({ field }) => (
                    <ReactDatePicker
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      dateFormat="yyyy-MM-dd"
                      appearance="default"
                      id="endDate"
                      placeholderText="Select end date"
                      required={true}
                      onChange={(date) => field.onChange(date)}
                      selected={field.value}
                    />
                  )}
                />
              </div>
            </div>

            <div className="w-full mt-3 flex items-end">
              <Button
                className="ml-auto"
                color="purple"
                type="submit"
                isProcessing={isLoading}
              >
                Save Term
              </Button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default TermUpdate;
