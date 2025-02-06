import { useState, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { useNotifications } from "../../contexts/notification/NotificationContext";
import { RiNotificationLine  } from "react-icons/ri";


const NotificationButton = () => {
    const { notifications, markAllAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const unreadCount = notifications.filter(n => !n.seen).length;

    return (
        <div className="relative">
            {/* Botão do sino */}
            <button 
                className="relative p-1.5 text-gray-700 hover:text-blue-600"
                onClick={() => { setIsOpen(!isOpen); markAllAsRead(); }}
            >
                <RiNotificationLine className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px]  rounded-full px-1">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div ref={dropdownRef}  className="absolute right-0 mt-2 w-96 bg-white border border-gray-300 shadow-lg rounded-md p-2">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-semibold text-gray-800">Notificações</h3>
                        <button onClick={() => setIsOpen(false)}>
                            <FaTimes className="text-gray-500 hover:text-red-500" />
                        </button>
                    </div>
                    {notifications.length === 0 ? (
                        <p className="text-gray-500 text-sm">Nenhuma notificação</p>
                    ) : (
                        <ul>
                            {notifications.map((notification) => (
                                <li key={notification.id} className={`p-2 border-b ${notification.seen ? "text-gray-500 text-sm" : "text-black font-semibold"}`}>
                                    {notification.message}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationButton;
