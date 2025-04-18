import React from "react";
import CreditLinesTable from "./components/CreditLinesTable";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-10">
      <div className="w-full max-w-6xl">
        <CreditLinesTable />
      </div>
    </div>
  );
};

export default App;
