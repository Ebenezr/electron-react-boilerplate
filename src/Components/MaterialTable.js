import React from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import MaterialReactTable, {
  MRT_FullScreenToggleButton,
  MRT_GlobalFilterTextField,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
} from "material-react-table";
import { Tooltip, IconButton, Box, Edit, Delete } from "..."; // replace with your actual imports
import { Pagination, Toolbar } from "@mui/material";
import { Button } from "flowbite-react";

const MyMaterialReactTable = ({
  columns,
  tableData,
  refetch,
  handleDeleteRow,
  setUpdateModalOpen,
  setSelectedData,
  setCreateModalOpen,
  data,
  isError,
  setColumnFilters,
  setGlobalFilter,
  setPagination,
  setSorting,
  tableInstanceRef,
  columnFilters,
  globalFilter,
  isLoading,
  pagination,
  isFetching,
  sorting,
}) => (
  <>
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
              Add Class
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
  </>
);

export default MyMaterialReactTable;
