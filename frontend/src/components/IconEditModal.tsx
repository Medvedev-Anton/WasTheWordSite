// components/IconEditModal.tsx
import { useState, useEffect } from 'react';
import { getMediaUrl } from '../config';
import './IconEditModal.css';

interface OrganizationIcon {
    id: number;
    orgType: string;
    imageUrl: string;
}

interface IconEditModalProps {
    isOpen: boolean;
    icon: OrganizationIcon | null;
    onClose: () => void;
    onSave: (iconId: number, file: File) => Promise<void>;
}

export default function IconEditModal({ isOpen, icon, onClose, onSave }: IconEditModalProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setSelectedFile(null);
            setPreviewUrl(null);
        }
    }, [isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!icon || !selectedFile) return;

        setIsSaving(true);
        try {
            await onSave(icon.id, selectedFile);
            onClose();
        } catch (error) {
            console.error('Failed to save icon:', error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen || !icon) return null;

    return (
        <div className="icon-modal-overlay" onClick={onClose}>
            <div className="icon-modal" onClick={(e) => e.stopPropagation()}>
                <div className="icon-modal-header">
                    <h3>✏️ Редактировать иконку</h3>
                    <button className="icon-modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="icon-modal-body">
                    <div className="icon-preview-section">
                        <div className="current-icon">
                            <h4>Текущая иконка</h4>
                            <div className="icon-preview">
                                <img src={getMediaUrl(icon.imageUrl)} alt={icon.orgType} />
                            </div>
                            <p className="icon-type">
                                {icon.orgType === 'DEFAULT' ? 'По умолчанию' : icon.orgType}
                            </p>
                        </div>

                        {previewUrl && (
                            <div className="new-icon">
                                <h4>Новая иконка</h4>
                                <div className="icon-preview new">
                                    <img src={previewUrl} alt="Предпросмотр" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="file-upload-section">
                        <label htmlFor="icon-file-input" className="file-upload-label">
                            📁 Выберите новое изображение
                        </label>
                        <input
                            type="file"
                            id="icon-file-input"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="file-input-hidden"
                        />
                        {selectedFile && (
                            <p className="selected-file-name">Выбран: {selectedFile.name}</p>
                        )}
                        <p className="input-hint">
                            Рекомендуемый размер: 400x300px, формат: JPG, PNG
                        </p>
                    </div>
                </div>

                <div className="icon-modal-footer">
                    <button className="btn-secondary" onClick={onClose} disabled={isSaving}>
                        Отмена
                    </button>
                    <button
                        className="btn-primary"
                        onClick={handleSave}
                        disabled={!selectedFile || isSaving}
                    >
                        {isSaving ? 'Сохранение...' : 'Сохранить'}
                    </button>
                </div>
            </div>
        </div>
    );
}