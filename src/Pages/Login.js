import {
  Button,
  Card,
  Checkbox,
  Label,
  TextInput,
  Toast,
} from "flowbite-react";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { HiMail, HiEyeOff, HiEye } from "react-icons/hi";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { HiCheck } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";
// import { HiEye, HiEyeOff } from "react-icons/hi";


const Login = () => {
  const navigate = useNavigate();
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const FormSchema = z.object({
    email: z.string().email({ message: "Invalid email formart" }),
    password: z.string({ message: "Password is required" }),
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

  // hash local storage
  const STORAGE_KEY = "authObject";

  // Save data in local storage
  function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  const createPost = useMutation(
    (newPost) => axios.post(`${process.env.REACT_APP_BASE_URL}/login`, newPost),
    {
      // You can handle side effects in onSuccess and onError
      onSuccess: (response) => {
        // pass data
        // signIn(response?.data);
        const expiresAt = Date.now() + 60 * 60 * 1000; // set expiration time to 1 hour from now
        if (typeof window !== "undefined") {
          const authObject = {
            authenticated: true,
            token: response?.data?.token,
            role: response?.data?.role,
            userId: response?.data?.userId,
            name: response?.data?.name,
            email: response?.data?.email,
            expiresAt: expiresAt,
          };
          saveData(authObject);
        }
        setShowSuccessToast(true);
        // if role=ADMIN push to dashboard else push to calendar
        if (response?.data?.role === "ADMIN") {
          navigate("dashboard");
        } else {
          navigate("dashboard");
        }

        reset();
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
      reset();
    } catch (error) {
      console.error(error);
    }
  };

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
    <section className="bg-purple-50 grid place-items-center h-[100vh]">
      <div className="w-80">
        <Card>
          <p className="mx-auto tracking-wide font-semibold text-lg">
            Nakuru Vic Sch
          </p>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="email1"
                  value="Your email"
                  color={errors.email ? "failure" : "gray"}
                />
              </div>
              <Controller
                control={control}
                name="email"
                defaultValue=""
                render={({ field }) => (
                  <TextInput
                    id="email1"
                    type="email"
                    shadow={true}
                    rightIcon={HiMail}
                    placeholder="name@flowbite.com"
                    required={true}
                    color={errors.email ? "failure" : "gray"}
                    helperText={errors.email?.message}
                    {...field}
                  />
                )}
              />
              {/* {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )} */}
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
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember">Remember me</Label>
              </div>
              <Link
                to="dashboard"
                className="text-sm text-purple-600 hover:underline"
              >
                Lost Password?
              </Link>
            </div>
            <Button color="purple" type="submit" isProcessing={isLoading}>
              Submit
            </Button>
          </form>
        </Card>
      </div>
      {showSuccessToast && (
        <Toast className="absolute bottom-4 left-4">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <HiCheck className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">
            Logged in successfully.
          </div>
          <Toast.Toggle onClick={() => setShowSuccessToast(false)} />
        </Toast>
      )}

      {showErrorToast && (
        <Toast className="absolute bottom-4 left-4">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
            <IoMdClose className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">
            Login failed. Please try again.
          </div>
          <Toast.Toggle onClick={() => setShowErrorToast(false)} />
        </Toast>
      )}
    </section>
  );
};

export default Login;
