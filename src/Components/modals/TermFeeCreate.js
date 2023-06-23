import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "react-datepicker/dist/react-datepicker.css";

const TermFeeCreate = ({
  onClose,
  open,
  setShowErrorToast,
  setShowSuccessToast,
}) => {
  const FormSchema = z.object({
    classId: z.string().min(1, { message: "Class is required" }),
    // termFees: z.array(
    //   z.object({
    //     termId: z.number().min(1, { message: "Term is required" }),
    //     amount: z
    //       .number()
    //       .min(0, { message: "Amount must be a positive number" }),
    //   })
    // ),
  });

  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormSchema),
    reValidateMode: "onChange",
  });

  const queryClient = useQueryClient();

  // reset form
  useEffect(() => {
    reset({
      classId: 0,
      termId: 0,
      amount: 0,
    });
  }, [reset]);

  // fetch classes for drop down
  const fetchClassList = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/classes/all`
      );
      return response.data.grade;
    } catch (error) {
      throw new Error("Error fetching class data");
    }
  };
  const { data: classList } = useQuery(["clas-data"], fetchClassList, {
    cacheTime: 10 * 60 * 1000, // cache for 10 minutes
  });
  // fetch terms
  const fetchTermList = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/terms/all`
      );
      return response.data.term;
    } catch (error) {
      throw new Error("Error fetching term data");
    }
  };

  const { data: termList } = useQuery(["term-data"], fetchTermList, {
    cacheTime: 10 * 60 * 1000, // cache for 10 minutes
  });

  const createPost = useMutation(
    (newPost) =>
      axios.post(`${process.env.REACT_APP_BASE_URL}/termfees/post`, newPost),
    {
      onSuccess: () => {
        setShowSuccessToast(true);
        queryClient.invalidateQueries(["termsfee-data"]);
        reset();

        onClose();
      },
      onError: () => {
        setShowErrorToast(true);
      },
    }
  );
  const classId = watch("classId") ?? "0";
  const { isLoading } = createPost;
  const onSubmit = async (data) => {
    console.log("Form Data:", data); // Log the entire form data object

    try {
      const termFees = termList.map((term) => {
        const amount = data[`term${term.id}`];
        console.log("classId:", classId);
        console.log("termId:", term.id);
        console.log(`term${term.id} amount:`, amount);
        return {
          classId: Number(classId),
          termId: term.id,
          amount: parseFloat(amount),
        };
      });

      console.log("Term Fees:", termFees); // Log the final termFees array

      termFees.forEach((termFee) => {
        createPost.mutate(termFee);
      });
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
            Add New Class
          </h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* select class */}
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="classId"
                  value="Class"
                  color={`${errors.classId ? "failure" : "gray"}`}
                />
              </div>
              <Controller
                control={control}
                name="classId"
                defaultValue="0" // Updated defaultValue to 0 (number)
                render={({ field }) => (
                  <div>
                    <Select
                      id="classId"
                      value={field.value}
                      color={`${errors.classId ? "failure" : "gray"}`}
                      required={true}
                      helperText={errors.classId?.message}
                      {...field}
                    >
                      <option value={0} disabled>
                        Select Class
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

            {/* input fees for each term */}
            {termList?.map((term) => (
              <div key={term.id}>
                <div className="mb-2 block">
                  <Label
                    htmlFor={`term${term.id}`}
                    value={`${term.name} Fees`}
                    color={errors[`term${term.id}`] ? "failure" : "gray"}
                  />
                </div>
                <Controller
                  control={control}
                  name={`term${term.id}`}
                  defaultValue=""
                  render={({ field }) => (
                    <TextInput
                      id={`term${term.id}`}
                      placeholder="Enter Fee Amount"
                      required={true}
                      color={errors[`term${term.id}`] ? "failure" : "gray"}
                      helperText={errors[`term${term.id}`]?.message}
                      value={field.value || 0}
                      type="number"
                      onChange={(e) =>
                        setValue(`term${term.id}`, e.target.valueAsNumber, {
                          shouldValidate: true,
                        })
                      }
                    />
                  )}
                />
              </div>
            ))}

            <div className="w-full mt-3 flex items-end">
              <Button
                className="ml-auto"
                color="purple"
                type="submit"
                isProcessing={isLoading}
              >
                Add TermFee
              </Button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default TermFeeCreate;
