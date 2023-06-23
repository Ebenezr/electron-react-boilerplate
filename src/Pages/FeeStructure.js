import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { HiCheck } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import MaterialReactTable, {
  MRT_FullScreenToggleButton,
  MRT_GlobalFilterTextField,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
} from "material-react-table";

import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Pagination,
  Toolbar,
  Tooltip,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import { Delete, Edit } from "@mui/icons-material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Toast } from "flowbite-react";

import axios from "axios";
import ClassUpdate from "../Components/modals/ClassUpdate";
import TermFeeCreate from "../Components/modals/TermFeeCreate";
const KES = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "KES",
});
const FeeStructure = () => {
  const queryClient = useQueryClient();
  const [columnFilters, setColumnFilters] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const tableInstanceRef = useRef(null);
  const [sorting, setSorting] = useState([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [selectedData, setSelectedData] = useState();
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,

    pageSize: 10,
  });
  const [transformedData, setTransformedData] = useState([]);

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
  const { data: classsList } = useQuery(["clas-data"], fetchClassList, {
    cacheTime: 10 * 60 * 1000, // cache for 10 minutes
  });

  const { data, isError, isFetching, isLoading, refetch } = useQuery({
    queryKey: [
      "classes-data",

      columnFilters, //refetch when columnFilters changes

      globalFilter, //refetch when globalFilter changes

      pagination.pageIndex, //refetch when pagination.pageIndex changes

      pagination.pageSize, //refetch when pagination.pageSize changes

      sorting, //refetch when sorting changes
    ],

    queryFn: async () => {
      const fetchURL = new URL(`${process.env.REACT_APP_BASE_URL}/terms`);

      fetchURL.searchParams.set(
        "start",

        `${pagination.pageIndex * pagination.pageSize}`
      );

      fetchURL.searchParams.set("size", `${pagination.pageSize}`);

      fetchURL.searchParams.set("filters", JSON.stringify(columnFilters ?? []));

      fetchURL.searchParams.set("globalFilter", globalFilter ?? "");

      fetchURL.searchParams.set("sorting", JSON.stringify(sorting ?? []));

      const response = await fetch(fetchURL.href);

      const json = await response.json();

      return json;
    },

    keepPreviousData: true,
  });
  useEffect(() => {
    if (data) {
      const transformData = (data) => {
        const classes = {};

        data.forEach((item) => {
          const classId = item.TermFee[0]?.classId;
          const termFee = {
            id: item.TermFee[0]?.id,
            amount: item.TermFee[0]?.amount,
          };

          if (classId && !classes[classId]) {
            classes[classId] = {
              classId: classId,
              termFees: {},
            };
          }

          classes[classId].termFees[item.name] = termFee;
        });

        return Object.values(classes);
      };

      const transformed = transformData(data.items);
      setTransformedData(transformed);
    }
  }, [data]);

  useEffect(() => {
    setTableData(transformedData);
  }, [transformedData]);

  console.log(tableData);

  const columns = useMemo(
    () => [
      {
        accessorKey: "classId",
        header: "Id",
        key: "classIdKey",
      },
      {
        accessorKey: "classId",

        header: "Class",
        size: 40,
        Cell: ({ cell }) => {
          const classs = classsList?.find(
            (classs) => classs.id === cell.getValue()
          );
          return `${classs?.name}`;
        },
      },
      // 3 terms
      {
        accessorKey: "termFees",
        header: "Term 1 Fee",
        Cell: ({ cell }) => {
          const termFee = cell.getValue()["Term 1"]?.amount || "-";
          return KES.format(Number(termFee) ?? 0);
        },
        key: "term1FeeKey",
      },
      {
        accessorKey: "termFees",
        header: "Term 2 Fee",
        Cell: ({ cell }) => {
          const termFee = cell.getValue()["Term 2"]?.amount || "-";
          return KES.format(Number(termFee) ?? 0);
        },
        key: "term2FeeKey",
      },
      {
        accessorKey: "termFees",
        header: "Term 3 Fee",
        Cell: ({ cell }) => {
          const termFee = cell.getValue()["Term 3"]?.amount || "-";
          return KES.format(Number(termFee) ?? 0);
        },
        key: "term3FeeKey",
      },
    ],

    [classsList]
  );

  const deletePost = useMutation((id) => {
    return axios
      .delete(`${process.env.REACT_APP_BASE_URL}/teacher/${id}`)
      .then(() => {
        queryClient.invalidateQueries(["classes-data"]);
        setShowSuccessToast(true);
        refetch();
      })
      .catch(() => {
        setShowErrorToast(true);
      });
  });
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const handleDeleteRow = useCallback((row) => {
    setOpenConfirmDialog(true);
    setRowToDelete(row);
  }, []);
  // close dialog
  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };
  const handleConfirmDelete = () => {
    if (rowToDelete) {
      deletePost.mutate(rowToDelete.getValue("id"));
      tableData.splice(rowToDelete.index, 1);
    }
    setOpenConfirmDialog(false);
    refetch();
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

  //column definitions...
  return (
    <section className="bg-white h-full w-full  p-4">
      <h1 className="mb-4 font-semibold tracking-wide text-lg">
        Fee Structure
      </h1>
      <Box className="border-slate-200 rounded border-[1px] p-4">
        {tableInstanceRef.current && (
          <Toolbar
            sx={() => ({
              backgroundColor: "#ede7f6",

              borderRadius: "4px",

              display: "flex",

              flexDirection: {
                xs: "column",

                lg: "row",
              },

              gap: "1rem",

              justifyContent: "space-between",

              p: "1.5rem 0",
            })}
          >
            <Box className="gap-3 flex items-center">
              <Button
                onClick={() => setCreateModalOpen(true)}
                outline={true}
                gradientDuoTone="purpleToBlue"
              >
                Add Fee Structure
              </Button>
            </Box>

            <MRT_GlobalFilterTextField table={tableInstanceRef.current} />

            <Box>
              <MRT_ToggleFiltersButton table={tableInstanceRef.current} />

              <MRT_ShowHideColumnsButton table={tableInstanceRef.current} />

              <MRT_ToggleDensePaddingButton table={tableInstanceRef.current} />

              <MRT_FullScreenToggleButton table={tableInstanceRef.current} />
            </Box>
          </Toolbar>
        )}

        <MaterialReactTable
          columns={columns}
          data={tableData ?? []}
          initialState={{
            showGlobalFilter: true,
            showColumnFilters: false,
          }}
          enableTopToolbar={false}
          enableRowActions
          manualFiltering
          manualPagination
          manualSorting
          muiToolbarAlertBannerProps={
            isError
              ? {
                  color: "error",

                  children: "Error loading data",
                }
              : undefined
          }
          onColumnFiltersChange={setColumnFilters}
          onGlobalFilterChange={setGlobalFilter}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          renderBottomToolbarCustomActions={() => (
            <>
              <Tooltip arrow title="Refresh Data">
                <IconButton onClick={() => refetch()}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
          renderRowActions={({ row }) => (
            <Box sx={{ display: "flex", gap: "1rem" }}>
              <Tooltip arrow placement="left" title="Edit">
                <IconButton
                  onClick={() => {
                    setUpdateModalOpen(true);
                    setSelectedData(row);
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>

              <Tooltip arrow placement="right" title="Delete">
                <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          )}
          rowCount={data?.itemsPerPage ?? 0}
          tableInstanceRef={tableInstanceRef}
          state={{
            columnFilters,

            globalFilter,

            isLoading,

            pagination,

            showAlertBanner: isError,

            showProgressBars: isFetching,

            sorting,
          }}
          {...(tableInstanceRef.current && (
            <Toolbar
              sx={{
                display: "flex",

                justifyContent: "center",

                flexDirection: "column",
              }}
            >
              <Box
                className="place-items-center"
                sx={{ display: "grid", width: "100%" }}
              >
                <Pagination
                  variant="outlined"
                  shape="rounded"
                  count={data?.totalPages ?? 0}
                  page={pagination.pageIndex + 1}
                  onChange={(event, value) =>
                    setPagination((prevPagination) => ({
                      ...prevPagination,
                      pageIndex: value - 1,
                    }))
                  }
                />
              </Box>
            </Toolbar>
          ))}
        />
        {/* Custom Bottom Toolbar */}

        {tableInstanceRef.current && (
          <Toolbar
            sx={{
              display: "flex",

              justifyContent: "center",

              flexDirection: "column",
            }}
          >
            <Box
              className="place-items-center"
              sx={{ display: "grid", width: "100%" }}
            >
              <Pagination
                variant="outlined"
                shape="rounded"
                count={data?.totalPages ?? 0}
                page={pagination.pageIndex + 1}
                onChange={(event, value) =>
                  setPagination((prevPagination) => ({
                    ...prevPagination,
                    pageIndex: value - 1,
                  }))
                }
              />
            </Box>
          </Toolbar>
        )}
      </Box>
      <TermFeeCreate
        open={createModalOpen}
        setShowSuccessToast={setShowSuccessToast}
        setShowErrorToast={setShowErrorToast}
        onClose={() => setCreateModalOpen(false)}
      />
      <ClassUpdate
        open={updateModalOpen}
        setShowSuccessToast={setShowSuccessToast}
        setShowErrorToast={setShowErrorToast}
        onClose={() => setUpdateModalOpen(false)}
        objData={selectedData?.original}
      />
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this guest?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* toast */}
      {showSuccessToast && (
        <Toast className="absolute bottom-4 left-4">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <HiCheck className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">Data Updated Success.</div>
          <Toast.Toggle onClick={() => setShowSuccessToast(false)} />
        </Toast>
      )}
      {showErrorToast && (
        <Toast className="absolute bottom-4 left-4">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
            <IoMdClose className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">Data update failed.</div>
          <Toast.Toggle onClick={() => setShowErrorToast(false)} />
        </Toast>
      )}
    </section>
  );
};

export default FeeStructure;
