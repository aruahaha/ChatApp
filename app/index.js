import React from "react";
import IndexPage from "./main/index";
import GlobalState from "./context/globalContext";

const Index = () => {
  return (
    <GlobalState>
      <IndexPage />
    </GlobalState>
  );
};

export default Index;
