import React from 'react';
import './ClusterMarker.css';

interface ClusterMarkerProps {
    count: number;
    onClick?: () => void;
    variant?: 'default' | 'metal';
}

export const ClusterMarker: React.FC<ClusterMarkerProps> = ({ 
    count, 
    onClick,
    variant = 'default' 
}) => {
    const getCountClass = () => {
        if (count < 10) return 'small';
        if (count < 50) return 'medium';
        if (count < 100) return 'large';
        return 'extra-large';
    };

    const getCountAttribute = () => {
        if (count < 10) return 10;
        if (count < 50) return 50;
        if (count < 100) return 100;
        return 200;
    };

    return (
        <div
            className={`cluster-marker ${getCountClass()} ${variant}`}
            data-count={getCountAttribute()}
            onClick={onClick}
        >
            <div className="cluster-pulse" />
            <div className="cluster-glow" />
            <div className="cluster-content">
                <span className="cluster-count">{count}</span>
            </div>
        </div>
    );
};