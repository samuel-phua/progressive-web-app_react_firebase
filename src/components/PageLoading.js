import React from "react";
import Header from "./Header";
import Loading from "./Loading";

const PageLoading = (props) => {
  return (
    <div id="PageLoading" className="inner-container">
      <Header />
      <Loading />
    </div>
  );
};

export default PageLoading;
