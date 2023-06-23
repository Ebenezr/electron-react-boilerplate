import React, { Suspense } from "react";
import Layout from "./Components/Layout";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import ErrorBoundary from "./Components/ErrorBoundary/ErrorBoundary";
import { ThemeProvider } from "./context/ThemeContext";
const Student = React.lazy(() => import("./Pages/Student"));
const Teacher = React.lazy(() => import("./Pages/Teacher"));
const Guardian = React.lazy(() => import("./Pages/Guardian"));
const User = React.lazy(() => import("./Pages/User"));
const Class = React.lazy(() => import("./Pages/Class"));
const School = React.lazy(() => import("./Pages/Setting"));
const Payment = React.lazy(() => import("./Pages/Payment"));
const Calendar = React.lazy(() => import("./Pages/Calendar"));
const AdditionalPayment = React.lazy(() => import("./Pages/AdditionalPayment"));
const StudentClassReport = React.lazy(() =>
  import("./Pages/Reports/ClassReport")
);

// Create a client
const queryClient = new QueryClient();
function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <BrowserRouter>
            <Suspense fallback={<Spinner />}>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route
                  path="/dashboard"
                  element={
                    <Layout>
                      <Dashboard />
                    </Layout>
                  }
                />
                <Route
                  path="/students"
                  element={
                    <Layout>
                      <Student />
                    </Layout>
                  }
                />
                <Route
                  path="/teachers"
                  element={
                    <Layout>
                      <Teacher />
                    </Layout>
                  }
                />
                <Route
                  path="/classes"
                  element={
                    <Layout>
                      <Class />
                    </Layout>
                  }
                />
                <Route
                  path="/guardians"
                  element={
                    <Layout>
                      <Guardian />
                    </Layout>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <Layout>
                      <User />
                    </Layout>
                  }
                />
                <Route
                  path="/payments"
                  element={
                    <Layout>
                      <Payment />
                    </Layout>
                  }
                />
                <Route
                  path="/additional-payments"
                  element={
                    <Layout>
                      <AdditionalPayment />
                    </Layout>
                  }
                />

                <Route
                  path="/school"
                  element={
                    <Layout>
                      <School />
                    </Layout>
                  }
                />
                <Route
                  path="/calendar"
                  element={
                    <Layout>
                      <Calendar />
                    </Layout>
                  }
                />
                <Route
                  path="/studentclassreport"
                  element={
                    <Layout>
                      <StudentClassReport />
                    </Layout>
                  }
                />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
function Spinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
    </div>
  );
}
