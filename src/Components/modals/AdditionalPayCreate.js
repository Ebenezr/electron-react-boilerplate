import { Button, Label, Modal, TextInput } from "flowbite-react";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AdditionalPayCreate = ({
  onClose,
  open,
  setShowErrorToast,
  setShowSuccessToast,
}) => {
  const FormSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(2, { message: "Name is required" }),
    amount: z.number().min(1, { message: "Amount is required" }),
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
      amount: 0,
    });
  }, [reset]);

  const createPost = useMutation(
    (newPost) =>
      axios.post(
        `${process.env.REACT_APP_BASE_URL}/additionalfees/post`,
        newPost
      ),
    {
      onSuccess: () => {
        setShowSuccessToast(true);
        queryClient.invalidateQueries(["additionalfee-data"]);
        reset();

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
      setShowErrorToast(true);
    }
  };

  return (
    <Modal show={open} size="md" popup={true} onClose={onClose}>
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8 relative z-0">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Create Payment
          </h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="name"
                  value="Name"
                  color={errors.first_name ? "failure" : "gray"}
                />
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
                <Label
                  htmlFor="amount"
                  value="Amount"
                  color={errors.amount ? "failure" : "gray"}
                />
              </div>
              <Controller
                control={control}
                name="amount"
                defaultValue={0}
                render={({ field }) => (
                  <TextInput
                    id="amount"
                    type="number"
                    placeholder="Amount"
                    required={true}
                    color={errors.amount ? "failure" : "gray"}
                    helperText={errors.amount?.message}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
                Create Payment
              </Button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AdditionalPayCreate;
