// Modal.tsx
import { useEffect } from "react";
import { getMediaUrl } from "../config";
import "./OrganizationModal.css";

interface SubOrg {
    id: number;
    name: string;
    orgType?: string;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    type: string;
    description: string;
    membersCount?: number;
    subOrganizations?: SubOrg[];
    coverImage?: string;
    presetCoverUrl?: string;
}

export default function OrganizationModal({
    isOpen,
    onClose,
    title,
    type,
    description,
    membersCount,
    subOrganizations,
    coverImage,
    presetCoverUrl,
}: ModalProps) {
    const typeImages: Record<string, string> = {
        'Производственная': '/image/organizations/production.jpg',
        'Коммерческая': '/image/organizations/commercial.jpg',
        'Административная': '/image/organizations/administrative.jpg',
        'Образовательная': '/image/organizations/educational.jpg',
        'Волонтёрская': '/image/organizations/free_appointment.jpg',
        'Спортивная': '/image/organizations/free_appointment.jpg',
        'Свободная': '/image/organizations/free_appointment.jpg'
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

    // Priority: uploaded cover → preset cover → type-based static image
    const rawImageUrl = coverImage || presetCoverUrl || typeImages[type];
    const imageUrl = (coverImage || presetCoverUrl) ? getMediaUrl(rawImageUrl) : rawImageUrl;

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
                    {(membersCount !== undefined || (subOrganizations && subOrganizations.length > 0)) && (
                        <div className="game-modal__stats">
                            {membersCount !== undefined && (
                                <span className="game-modal__members">👥 {membersCount} сотрудников</span>
                            )}
                            {subOrganizations && subOrganizations.length > 0 && (
                                <div className="game-modal__suborgs">
                                    <span className="game-modal__suborgs-label">🏗️ Подразделения:</span>
                                    <ul>
                                        {subOrganizations.slice(0, 4).map(sub => (
                                            <li key={sub.id}>{sub.name}</li>
                                        ))}
                                        {subOrganizations.length > 4 && (
                                            <li className="game-modal__suborgs-more">…и ещё {subOrganizations.length - 4}</li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                    <p>{description}</p>
                </div>
            </div>
        </div>
    );
}