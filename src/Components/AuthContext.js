import React, { createContext, useState, useEffect } from "react";

// Создаем контекст
export const AuthContext = createContext();

// Провайдер
export function AuthProvider({ children }) {
    const [isAuth, setIsAuth] = useState(false);
    const [user, setUser] = useState({ name: "", token: "" });

    useEffect(() => {
        // При старте приложения проверяем локальное хранилище
        const token = localStorage.getItem("token");
        const name = localStorage.getItem("name");
        if (token) {
            setUser({ name, token });
            setIsAuth(true);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuth, setIsAuth, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}



// import React, { createContext, useState, useEffect } from 'react';

// export const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [isAuth, setIsAuth] = useState(false);

//   useEffect(() => {
//     // При загрузке приложения проверяем токен
//     const token = localStorage.getItem('token');
//     if (token) {
//       setIsAuth(true);
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{ isAuth, setIsAuth }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
