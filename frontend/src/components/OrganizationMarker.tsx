import './OrganizationMarker.css';

interface OrganizationMarkerProps {
    imagePath: string,
    name: string,
    orgLevel: number
}

export default function OrganizationMarker({ imagePath, name, orgLevel }: OrganizationMarkerProps) {
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