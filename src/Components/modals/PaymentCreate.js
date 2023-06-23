import { Button, Label, Modal, Radio, Select, TextInput } from "flowbite-react";
import React, { useEffect, useMemo } from "react";
import { useForm, Controller, set } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "react-datepicker/dist/react-datepicker.css";

const PaymentCreate = ({
  onClose,
  open,

  setShowErrorToast,
  setShowSuccessToast,
}) => {
  const [paymentMode, setPaymentMode] = React.useState("Cash");
  const FormSchema = z.object({
    termId: z.string().min(1, "Select a term"),
    classId: z.string().min(1, "Select a class"),
    studentId: z.string().min(1, "Select a student"),
    amount: z.number().refine((value) => value >= 0, {
      message: "Amount total must be a non-negative number",
    }),
    reference: z.string().min(1, "Enter reference"),
    payment_mode: z.enum(["MPESA", "CASH", "BANK", "CHEQUE"]),
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
      termId: "",
      classId: "",
      studentId: "",
      amount: "",
      reference: "",
      payment_mode: "MPESA",
    });
  }, [reset]);

  // fetch students
  const fetchStudentsList = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/students/all`
      );
      return response.data.student;
    } catch (error) {
      throw new Error("Error fetching students data");
    }
  };
  const { data: studentsList } = useQuery(["stud-data"], fetchStudentsList, {
    cacheTime: 10 * 60 * 1000, // cache for 10 minutes
  });
  // fetch classes
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
  //   fetch terms
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
  const { data: termList } = useQuery(["temr-data"], fetchTermList, {
    cacheTime: 10 * 60 * 1000, // cache for 10 minutes
  });

  const createPost = useMutation(
    (newPost) =>
      axios.post(
        `${process.env.REACT_APP_BASE_URL}/fee-payments/post`,
        newPost
      ),
    {
      onSuccess: () => {
        setShowSuccessToast(true);
        queryClient.invalidateQueries(["payments-data"]);
        onClose();
      },
      onError: () => {
        setShowErrorToast(true);
      },
    }
  );
  const classId = watch("classId") ?? "0";
  const studentId = watch("studentId") ?? "0";
  const termId = watch("termId") ?? "0";

  // set classId when student is selected
  const selectedClass = useMemo(() => {
    const selectedStudent = studentsList?.find((student) => {
      return student.id === Number(studentId);
    });

    if (selectedStudent) {
      setValue("classId", `${selectedStudent.classId}`);
    }
  }, [studentsList, studentId, setValue]);

  const { isLoading } = createPost;
  const onSubmit = async (data) => {
    try {
      const requestData = {
        ...data,
        classId: Number(classId),
        studentId: Number(studentId),
        termId: Number(termId),
      };
      createPost.mutate(requestData);
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
            Make Payment
          </h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="studentId"
                  value="Student"
                  color={`${errors.studentId ? "failure" : "gray"}`}
                />
              </div>
              <Controller
                control={control}
                name="studentId"
                render={({ field }) => (
                  <div>
                    <Select
                      id="studentId"
                      value={field.value}
                      color={`${errors.studentId ? "failure" : "gray"}`}
                      required={true}
                      helperText={errors.studentId?.message}
                      {...field}
                    >
                      <option value={0} disabled>
                        Select Student
                      </option>
                      {studentsList?.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.first_name} {option.last_name}
                        </option>
                      ))}
                    </Select>
                  </div>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
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
                  defaultValue={classId}
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
              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="termId"
                    value="Term"
                    color={`${errors.termId ? "failure" : "gray"}`}
                  />
                </div>
                <Controller
                  control={control}
                  name="termId"
                  render={({ field }) => (
                    <div>
                      <Select
                        id="termId"
                        value={termList?.find(
                          (term) => term?.id === field?.value
                        )}
                        color={`${errors.termId ? "failure" : "gray"}`}
                        required={true}
                        helperText={errors.termId?.message}
                        {...field}
                        // onChange={(_, value) => {
                        //   field.onChange(value?.id || 0);
                        // }}
                      >
                        <option value={0} disabled>
                          Select Term
                        </option>
                        {termList?.map((option) => (
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
            {/* PAYMENT MODE */}
            <div>
              <Label
                htmlFor="payment_mode"
                value="Payment Mode"
                color={`${errors.payment_mode ? "failure" : "gray"}`}
              />
              <div className="py-3 grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-full border border-gray-300 p-2 rounded-md  flex items-center cursor-pointer hover:bg-gray-200 ${
                      paymentMode === "MPESA" ? "bg-purple-100" : "bg-white"
                    }`}
                  >
                    <Radio
                      id="MPESA"
                      name="payment_mode"
                      value="MPESA"
                      defaultChecked={true}
                      onChange={() => {
                        setPaymentMode("MPESA");
                        setValue("payment_mode", "MPESA");
                      }}
                      className="text-sm"
                    />
                    <Label htmlFor="MPESA" className="ml-2 text-sm">
                      MPESA
                    </Label>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-full border border-gray-300 p-2 rounded-md  flex items-center cursor-pointer hover:bg-gray-200 ${
                      paymentMode === "BANK" ? "bg-purple-100" : "bg-white"
                    }`}
                  >
                    <Radio
                      id="BANK"
                      name="payment_mode"
                      value="BANK"
                      defaultChecked={false}
                      onChange={() => {
                        setPaymentMode("BANK");
                        setValue("payment_mode", "BANK");
                      }}
                      className="text-sm"
                    />
                    <Label htmlFor="BANK" className="ml-2 text-sm">
                      BANK
                    </Label>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-full border border-gray-300 p-2 rounded-md  flex items-center cursor-pointer hover:bg-gray-200 ${
                      paymentMode === "CASH" ? "bg-purple-100" : "bg-white"
                    }`}
                  >
                    <Radio
                      id="CASH"
                      name="payment_mode"
                      value="CASH"
                      defaultChecked={false}
                      onChange={() => {
                        setPaymentMode("CASH");
                        setValue("payment_mode", "CASH");
                      }}
                      className="text-sm"
                    />
                    <Label htmlFor="CASH" className="ml-2 text-sm">
                      CASH
                    </Label>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-full border border-gray-300 p-2 rounded-md  flex items-center cursor-pointer hover:bg-gray-200 ${
                      paymentMode === "CHEQUE" ? "bg-purple-100" : "bg-white"
                    }`}
                  >
                    <Radio
                      id="CHEQUE"
                      name="payment_mode"
                      value="CHEQUE"
                      defaultChecked={false}
                      onChange={() => {
                        setPaymentMode("CHEQUE");
                        setValue("payment_mode", "CHEQUE");
                      }}
                      className="text-sm"
                    />
                    <Label htmlFor="CHEQUE" className="ml-2 text-sm">
                      CHEQUE
                    </Label>
                  </div>
                </div>
              </div>
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
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="reference"
                  value="Reference"
                  color={errors.reference ? "failure" : "gray"}
                />
              </div>
              <Controller
                control={control}
                name="reference"
                defaultValue=""
                render={({ field }) => (
                  <TextInput
                    id="reference"
                    placeholder="Reference"
                    required={true}
                    color={errors.reference ? "failure" : "gray"}
                    helperText={errors.reference?.message}
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
                Make Payment
              </Button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PaymentCreate;
