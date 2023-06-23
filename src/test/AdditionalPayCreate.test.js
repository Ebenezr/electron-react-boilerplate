import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import AdditionalPayCreate from "../Components/modals/AdditionalPayCreate";
import React from "react";

const queryClient = new QueryClient();

describe("AdditionalPayCreate", () => {
  test("renders the component without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AdditionalPayCreate />
      </QueryClientProvider>
    );
  });

  test("submit the form successfully", async () => {
    const mockOnClose = jest.fn();
    const mockShowErrorToast = jest.fn();
    const mockShowSuccessToast = jest.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <AdditionalPayCreate
          onClose={mockOnClose}
          setShowErrorToast={mockShowErrorToast}
          setShowSuccessToast={mockShowSuccessToast}
          open
        />
      </QueryClientProvider>
    );

    userEvent.type(screen.getByPlaceholderText("Name"), "Additional Payment");
    userEvent.type(screen.getByPlaceholderText("Amount"), "100");
    userEvent.click(screen.getByText("Create Payment"));

    await waitFor(() =>
      expect(mockShowSuccessToast).toHaveBeenCalledWith(true)
    );
    expect(mockOnClose).toHaveBeenCalled();
    expect(mockShowErrorToast).not.toHaveBeenCalled();
  });
});
