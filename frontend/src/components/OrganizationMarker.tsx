import './OrganizationMarker.css';

interface OrganizationMarkerProps {
    imagePath: string,
    name: string,
    orgLevel: number,
    zoom: number | null
}

export default function OrganizationMarker({ imagePath, name, orgLevel, zoom }: OrganizationMarkerProps) {
    const getScale = () => {
        const minScale = 0.5;
        const maxScale = 1.5;
        const minZoom = 2;
        const maxZoom = 20;
        
        // Линейная интерполяция
        const scale = minScale + (zoom - minZoom) * (maxScale - minScale) / (maxZoom - minZoom);
        return Math.max(minScale, Math.min(maxScale, scale));
    };

    const scale = getScale();

    return (
        <div className="custom-marker vertical">
            <div className="marker-content">
                <div className={`marker-icon-wrapper level-${orgLevel}`}>
                    <img src={imagePath} alt={name} />
                </div>
                <div className="marker-info">
                    <div className="marker-name">{name}</div>
                </div>
            </div>
        </div>
    );
}