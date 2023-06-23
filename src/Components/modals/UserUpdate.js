import {
  Button,
  Checkbox,
  Label,
  Modal,
  Select,
  TextInput,
} from "flowbite-react";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import "react-datepicker/dist/react-datepicker.css";
const roles = [
  {
    name: "ADMIN",
    value: "ADMIN",
  },
  {
    name: "USER",
    value: "USER",
  },
];

const UserUpdate = ({
  onClose,
  open,
  objData,
  setShowErrorToast,
  setShowSuccessToast,
}) => {
  const FormSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    role: z
      .enum(["ADMIN", "USER"])
      .refine((value) => value === "ADMIN" || value === "USER", {
        message: "Role must be 'ADMIN' or 'USER'",
      }),

    activeStatus: z.boolean(),
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
      role: objData?.role ?? "USER",
      activeStatus: objData?.activeStatus ?? false,
    });
  }, [reset, objData]);

  const updatePost = useMutation(
    (updatedPost) => {
      const { id, ...postData } = updatedPost;
      return axios.patch(
        `${process.env.REACT_APP_BASE_URL}/user/${id}`,
        postData
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["users-data"]);
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
            Update User
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
                <Label
                  htmlFor="name"
                  value="Full Name"
                  color={errors.name ? "failure" : "gray"}
                />
              </div>
              <Controller
                control={control}
                name="name"
                defaultValue=""
                render={({ field }) => (
                  <TextInput
                    id="name"
                    placeholder="John Doe"
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
                <Label
                  htmlFor="email"
                  value="Email"
                  color={errors.email ? "failure" : "gray"}
                />
              </div>
              <Controller
                control={control}
                name="email"
                defaultValue=""
                render={({ field }) => (
                  <TextInput
                    id="email"
                    placeholder="name@mail.com"
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
                  htmlFor="role"
                  value="Role"
                  color={`${errors.role ? "failure" : "gray"}`}
                />
              </div>
              <Controller
                control={control}
                name="role"
                defaultValue=""
                render={({ field }) => (
                  <div>
                    <Select
                      id="role"
                      value={field.value}
                      color={`${errors.role ? "failure" : "gray"}`}
                      {...field}
                      helperText={errors.role?.message}
                      required={true}
                    >
                      <option value="" disabled>
                        Select Role
                      </option>
                      {roles?.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                )}
              />

              <div className="mt-4 flex items-center gap-2">
                <Controller
                  control={control}
                  name="activeStatus"
                  defaultValue={objData?.activeStatus ?? false}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      id="activeStatus"
                      label="Can Login"
                      {...field}
                    />
                  )}
                />
                <Label
                  htmlFor="activeStatus"
                  value="Can Login"
                  color={`${errors.activeStatus ? "failure" : "gray"}`}
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
                Save User
              </Button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default UserUpdate;
