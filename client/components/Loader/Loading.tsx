"use client";

import "./Loading.css";

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center space-y-2">
      <div className="loader border rounded-2xl"></div>
      <h2>Loading..</h2>
    </div>
  );
};

export default Loader;
