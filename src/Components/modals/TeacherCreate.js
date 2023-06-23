import { Button, Label, Modal, TextInput } from "flowbite-react";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "react-datepicker/dist/react-datepicker.css";

const TeacherCreate = ({
  onClose,
  open,
  setShowErrorToast,
  setShowSuccessToast,
}) => {
  // first_name,last_name,dob,
  const FormSchema = z.object({
    first_name: z.string().min(2, { message: "First name is required" }),
    last_name: z.string().min(2, { message: "Last name is required" }),
    phone: z
      .string()
      .regex(/^(\+?\d{2,3})?0?\d{9}$/, { message: "Invalid phone number" }),
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
      first_name: "",
      last_name: "",
      phone: "",
    });
  }, [reset]);

  const createPost = useMutation(
    (newPost) =>
      axios.post(`${process.env.REACT_APP_BASE_URL}/teachers/post`, newPost),
    {
      onSuccess: () => {
        setShowSuccessToast(true);
        queryClient.invalidateQueries(["teachers-data"]);
        onClose();
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
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal show={open} size="md" popup={true} onClose={onClose}>
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8 relative z-0">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Add New Teacher
          </h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="first_name"
                  value="First Name"
                  color={errors.first_name ? "failure" : "gray"}
                />
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
                <Label
                  htmlFor="last_name"
                  value="Last Name"
                  color={errors.last_name ? "failure" : "gray"}
                />
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
                defaultValue=""
                render={({ field }) => (
                  <TextInput
                    id="phone"
                    placeholder="0700000000"
                    required={true}
                    color={errors.phone ? "failure" : "gray"}
                    helperText={errors.phone?.message}
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
                Add Teacher
              </Button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default TeacherCreate;
