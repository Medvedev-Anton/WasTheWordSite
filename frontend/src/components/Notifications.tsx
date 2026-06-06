import { useEffect, useRef, useState } from 'react';
import './Notifications.css';
import axios from 'axios';
import { Bell } from 'lucide-react';

export default function Notifications() {
    const [showNotifyModal, setShowNotifyModal] = useState<boolean>(false);
    const [countTotalNotifies, setCountTotalNotifies] = useState<number>(0);
    const [notifications, setNotifications] = useState([]);

    const notifyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showNotifyModal && notifyRef.current && !notifyRef.current.contains(event.target as Node)) {
                setShowNotifyModal(false);
            }
        };

        if (showNotifyModal) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifyModal]);

    // Запрос на получение всех уведомлений пользователя
    const fetchNotifications = async () => {
        const result = await axios.get('/api/notifications');

        const notificationsResponse = result.data.notifications;
        
        setCountTotalNotifies(notificationsResponse.length);
        setNotifications(notificationsResponse);
    }

    // Обрабатывает клик на кнопку колокольчика уведомлений
    const handleNotifyIconClick = () => {
        if (showNotifyModal == false) {
            setCountTotalNotifies(0);
        }
        else {
            setNotifications([]);
        }

        setShowNotifyModal(!showNotifyModal);
    }

    return (
        <div 
            className="notify-wrapper"
            ref={notifyRef}
        >
            <Bell 
                size={24} 
                onClick={handleNotifyIconClick} 
            />
            <span 
                className="count-total-notifies"
                onClick={handleNotifyIconClick}
            >
                {countTotalNotifies}
            </span>
            {
            showNotifyModal
            ?
            <div className="notifies-modal">
                <p>
                Уведомления
                </p>
                <ul className="notifies-list">
                {
                    notifications.map(n => 
                    (
                        <li>
                        { n }
                        </li>
                    )
                    )
                }
                </ul>
            </div>
            :
            ""
            }
            
        </div>
    );
}