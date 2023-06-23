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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HiEyeOff, HiEye } from "react-icons/hi";
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

const UserCreate = ({ onClose, open }) => {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // first_name,last_name,dob,
  const FormSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    password: z.string().min(1, { message: "Password is required" }),
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
      name: "",
      email: "",
      password: "",
      role: "USER",

      activeStatus: false,
    });
  }, [reset]);

  const createPost = useMutation(
    (newPost) =>
      axios.post(`${process.env.REACT_APP_BASE_URL}/users/post`, newPost),
    {
      onSuccess: () => {
        setShowSuccessToast(true);
        queryClient.invalidateQueries(["users-data"]);
        onClose();
      },
      onError: () => {
        setShowErrorToast(true);
      },
    }
  );
  const { isLoading } = createPost;
  const onSubmit = async (data) => {
    try {
      createPost.mutate(data);
    } catch (error) {
      console.error(error);
    }
  };
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
    <Modal show={open} size="md" popup={true} onClose={onClose}>
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8 relative z-0">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Add New User
          </h3>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                <Label htmlFor="password1" value="Your password" />
              </div>
              <div className="relative">
                <Controller
                  control={control}
                  shadow={true}
                  name="password"
                  defaultValue=""
                  render={({ field }) => (
                    <TextInput
                      id="password1"
                      type={showPassword ? "text" : "password"}
                      required={true}
                      color={errors.email ? "failure" : "gray"}
                      helperText={errors.password?.message}
                      {...field}
                    />
                  )}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>
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
                  defaultValue={false}
                  render={({ field }) => (
                    <Checkbox id="activeStatus" label="Can Login" {...field} />
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
                Add User
              </Button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default UserCreate;
