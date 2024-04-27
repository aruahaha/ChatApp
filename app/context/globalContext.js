import { createContext, useState } from "react";

export const GlobalContext = createContext(null);

function GlobalState({ children }) {
  const [showPassWord, setShowPassWord] = useState(true);
  const [user, setUser] = useState({
    userName: "",
    userId: "",
    roomId: "",
    socketId: "",
  });
  const [room, setRoom] = useState(null);

  return (
    <GlobalContext.Provider
      value={{ showPassWord, setShowPassWord, user, setUser, room, setRoom }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalState;
