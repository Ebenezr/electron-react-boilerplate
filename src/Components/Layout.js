import React, { Suspense, useContext, useEffect, useState } from "react";
import Aside from "./aside";
import { Footer } from "flowbite-react";
import { ThemeContext } from "../context/ThemeContext";

const Layout = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [renderedChildren, setRenderedChildren] = useState(children);
  const { isDark } = useContext(ThemeContext);
  useEffect(() => {
    setLoading(true);
    setRenderedChildren(children);
    setLoading(false);
  }, [children]);
  return (
    <div className={`flex min-h-screen  ${isDark ? "dark" : ""}`}>
      <Aside />
      <div
        className={`flex-1  ${
          isDark ? "text-gray-400 bg-gray-700" : "text-gray-500"
        }`}
      >
        <div className="flex flex-col min-h-screen">
          <main className="flex-1 p-5">
            <Suspense fallback={<Spinner />}>
              {loading ? <Spinner /> : renderedChildren}
            </Suspense>
          </main>
          <Footer container={true} className="rounded-none">
            <Footer.Copyright href="#" by="School Soft" year={2023} />
            <Footer.LinkGroup>
              <Footer.Link href="#">Version 1.0.0</Footer.Link>
            </Footer.LinkGroup>
          </Footer>
        </div>
      </div>
    </div>
  );
};

export default Layout;
function Spinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
    </div>
  );
}
