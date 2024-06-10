import React, { createContext, useContext, useState } from "react";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState({
    $id: "1",
    username: "Ono Rikka ",
    avatar:
      "https://gamek.mediacdn.vn/133514250583805952/2020/6/18/-15924669694031565030335.jpg",
  });
  const [loading, setLoading] = useState(false);

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
