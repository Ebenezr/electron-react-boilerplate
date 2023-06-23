import { Button, Label, Modal, TextInput, Textarea } from "flowbite-react";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import "react-datepicker/dist/react-datepicker.css";

const SchoolUpdate = ({
  onClose,
  open,
  objData,
  setShowErrorToast,
  setShowSuccessToast,
}) => {
  const FormSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(2, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z
      .string()
      .regex(/^(\+?\d{2,3})?0?\d{9}$/, { message: "Invalid phone number" }),
    address: z.string().min(2, { message: "Address is required" }),
    address2: z.string().min(2, { message: "Address 2 is required" }),
    town: z.string().min(2, { message: "Town is required" }),
    school_motto: z.string().min(2, { message: "School motto is required" }),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormSchema),
    reValidateMode: "onChange",
  });
  const queryClient = useQueryClient();

  // reset form
  useEffect(() => {
    reset({
      id: objData?.id ?? 0,
      name: objData?.name ?? "",
      email: objData?.email ?? "",
      phone: objData?.phone ?? "",
      address: objData?.address ?? "",
      address2: objData?.address2 ?? "",
      town: objData?.town ?? "",
      school_motto: objData?.school_motto ?? "",
    });
  }, [reset, objData]);

  const updatePost = useMutation(
    (updatedPost) => {
      const { id, ...postData } = updatedPost;
      return axios.patch(
        `${process.env.REACT_APP_BASE_URL}/school/update/${id}`,
        postData
      ); // returning the axios.patch Promise
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["school-data"]);
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
        <div className="space-y-6 px-4 pb-4 sm:pb-6 lg:px-4 xl:pb-8 relative z-0">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Update School Info
          </h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="name"
                  value="Name"
                  color={errors.name ? "failure" : "gray"}
                />
              </div>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <TextInput
                    id="name"
                    placeholder="Name"
                    required={true}
                    color={errors.first_name ? "failure" : "gray"}
                    helperText={errors.name?.message}
                    {...field}
                  />
                )}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="email"
                  value="Email"
                  color={errors.email ? "failure" : "gray"}
                />
              </div>
              <Controller
                control={control}
                name="email"
                defaultValue={objData?.email ?? ""}
                render={({ field }) => (
                  <TextInput
                    id="email"
                    placeholder="Email"
                    required={true}
                    color={errors.email ? "failure" : "gray"}
                    helperText={errors.email?.message}
                    {...field}
                  />
                )}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="phone"
                  value="Phone"
                  color={errors.phone ? "failure" : "gray"}
                />
              </div>
              <Controller
                control={control}
                name="phone"
                defaultValue={objData?.phone ?? ""}
                render={({ field }) => (
                  <TextInput
                    id="phone"
                    placeholder="Phone"
                    required={true}
                    color={errors.phone ? "failure" : "gray"}
                    helperText={errors.phone?.message}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="address"
                    value="Address"
                    color={errors.address ? "failure" : "gray"}
                  />
                </div>
                <Controller
                  control={control}
                  name="address"
                  defaultValue={objData?.address ?? ""}
                  render={({ field }) => (
                    <TextInput
                      id="address"
                      placeholder="Address"
                      required={true}
                      color={errors.address ? "failure" : "gray"}
                      helperText={errors.address?.message}
                      {...field}
                    />
                  )}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="address2"
                    value="Address 2"
                    color={errors.address2 ? "failure" : "gray"}
                  />
                </div>
                <Controller
                  control={control}
                  name="address2"
                  defaultValue={objData?.address2 ?? ""}
                  render={({ field }) => (
                    <TextInput
                      id="address2"
                      placeholder="Address 2"
                      required={true}
                      color={errors.address2 ? "failure" : "gray"}
                      helperText={errors.address2?.message}
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="town"
                  value="Town"
                  color={errors.town ? "failure" : "gray"}
                />
              </div>
              <Controller
                control={control}
                name="town"
                defaultValue={objData?.town ?? ""}
                render={({ field }) => (
                  <TextInput
                    id="town"
                    placeholder="Town"
                    required={true}
                    color={errors.town ? "failure" : "gray"}
                    helperText={errors.town?.message}
                    {...field}
                  />
                )}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="school_motto"
                  value="School Motto"
                  color={errors.school_motto ? "failure" : "gray"}
                />
              </div>
              <Controller
                control={control}
                name="school_motto"
                defaultValue={objData?.school_motto ?? ""}
                render={({ field }) => (
                  <Textarea
                    id="school_motto"
                    placeholder="School Motto"
                    required={true}
                    rows={4}
                    color={errors.school_motto ? "failure" : "gray"}
                    helperText={errors.school_motto?.message}
                    {...field}
                  />
                )}
              />
            </div>

            <div className="w-full mt-3 flex items-end">
              <Button
                className="ml-auto"
                color="purple"
                type="submit"
                isProcessing={isLoading}
              >
                Save Info
              </Button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SchoolUpdate;
