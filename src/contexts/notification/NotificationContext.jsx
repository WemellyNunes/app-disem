import { createContext, useContext, useState, useEffect } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState(() => {
        return JSON.parse(localStorage.getItem("notifications")) || [];
    });

    const addNotification = (message) => {
        const newNotification = { id: Date.now(), message, seen: false };
        const updatedNotifications = [newNotification, ...notifications];
        setNotifications(updatedNotifications);
        localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    };

    const markAllAsRead = () => {
        const updatedNotifications = notifications.map(n => ({ ...n, seen: true }));
        setNotifications(updatedNotifications);
        localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    };

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, markAllAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
