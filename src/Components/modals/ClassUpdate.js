import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "react-datepicker/dist/react-datepicker.css";

const ClassUpdate = ({
  onClose,
  open,
  objData,
  setShowErrorToast,
  setShowSuccessToast,
}) => {
  const FormSchema = z.object({
    name: z.string().min(2, { message: "Name is required" }),
    term_1: z.number().optional(),
    term_2: z.number().optional(),
    term_3: z.number().optional(),
    id: z.number().optional(),
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

  // reset form
  useEffect(() => {
    reset({
      id: objData?.id ?? 0,
      name: objData?.name ?? "",
      teacherId: objData?.teacherId ?? 0,
      term_1: Number(objData?.term_1) ?? 0,
      term_2: Number(objData?.term_2) ?? 0,
      term_3: Number(objData?.term_3) ?? 0,
    });
  }, [reset, objData]);

  // for dropdown
  const fetchTeachersList = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/teachers/all`
      );
      return response.data.teacher;
    } catch (error) {
      throw new Error("Error fetching teacher data");
    }
  };
  const { data: teachersList } = useQuery(["tutor-data"], fetchTeachersList, {
    cacheTime: 10 * 60 * 1000, // cache for 10 minutes
  });

  const updatePost = useMutation(
    (updatedPost) => {
      const { id, ...postData } = updatedPost;
      return axios.patch(
        `${process.env.REACT_APP_BASE_URL}/class/${id}`,
        postData
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["classes-data"]);
        setShowSuccessToast(true);
        reset();
        onClose();
      },
      onError: () => {
        setShowErrorToast(true);
      },
    }
  );
  const teacherId = watch("teacherId") ?? "0";
  const { isLoading } = updatePost;
  const onSubmit = async (data) => {
    try {
      const requestData = {
        ...data,
        teacherId: Number(teacherId), // Convert the value to a number
      };
      updatePost.mutate(requestData);
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
            Add New Class
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

            {/* select teacher */}
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="teacherId"
                  value="Teacher"
                  color={`${errors.teacherId ? "failure" : "gray"}`}
                />
              </div>
              <Controller
                control={control}
                name="teacherId"
                defaultValue={objData}
                render={({ field }) => (
                  <div>
                    <Select
                      id="teacherId"
                      value={field.value}
                      color={`${errors.teacherId ? "failure" : "gray"}`}
                      required={true}
                      helperText={errors.teacherId?.message}
                      {...field}
                    >
                      <option value={0} disabled>
                        Select Class Teacher
                      </option>
                      {teachersList?.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.first_name} {option.last_name}
                        </option>
                      ))}
                    </Select>
                  </div>
                )}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="term_1"
                  value="Term One Fee"
                  color={errors.term_1 ? "failure" : "gray"}
                />
              </div>
              <Controller
                control={control}
                name="term_1"
                defaultValue={0}
                render={({ field }) => (
                  <TextInput
                    id="term_1"
                    placeholder="Term one "
                    required={true}
                    color={errors.term_1 ? "failure" : "gray"}
                    helperText={errors.term_1?.message}
                    type="number"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                )}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="term_2"
                  value="Term Two Fee"
                  color={errors.term_2 ? "failure" : "gray"}
                />
              </div>
              <Controller
                control={control}
                name="term_2"
                defaultValue={0}
                render={({ field }) => (
                  <TextInput
                    id="term_1"
                    placeholder="Term two fee "
                    required={true}
                    color={errors.term_2 ? "failure" : "gray"}
                    helperText={errors.term_2?.message}
                    type="number"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                )}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="term_3"
                  value="Term Three Fee"
                  color={errors.term_3 ? "failure" : "gray"}
                />
              </div>
              <Controller
                control={control}
                name="term_3"
                defaultValue={0}
                render={({ field }) => (
                  <TextInput
                    id="term_3"
                    placeholder="Term three fee "
                    required={true}
                    color={errors.term_3 ? "failure" : "gray"}
                    helperText={errors.term_3?.message}
                    type="number"
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
                Save Class
              </Button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ClassUpdate;
