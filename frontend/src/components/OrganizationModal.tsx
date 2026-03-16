// Modal.tsx
import { useEffect } from "react";
import "./OrganizationModal.css";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    type: string;
    description: string;
    imageUrl?: string;
}

export default function OrganizationModal({
    isOpen,
    onClose,
    title,
    type,
    description
}: ModalProps) {
    const typeImages: Record<string, string> = {
        'Производственная': 'image/organizations/production.jpg',
        'Коммерческая': 'image/organizations/commercial.jpg',
        'Административная': 'image/organizations/administrative.jpg',
        'Образовательная': 'image/organizations/educational.jpg',
        'Свободная': 'image/organizations/free_appointment.jpg'
    };

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const imageUrl = typeImages[type];

    return (
        <div className="game-modal-overlay" onClick={onClose}>
            <div className="game-modal" onClick={(e) => e.stopPropagation()}>
                <div className="game-modal__frame">
                    <img
                        src="/image/border_modal.png"
                        className="game-modal__frame-img"
                        alt="рамка"
                    />

                    <div className="game-modal__image">
                        <img src={imageUrl} alt={title} />
                    </div>

                    <button className="game-modal__close" onClick={onClose} />
                </div>

                <div className="game-modal__info">
                    <h3>{title}</h3>
                    <div className="type">{type}</div>
                    <p>{description}</p>
                </div>
            </div>
        </div>
    );
}