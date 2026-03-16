import './OrganizationMarker.css';

interface OrganizationMarkerProps {
    imagePath: string,
    name: string
}

export default function OrganizationMarker({ imagePath, name }: OrganizationMarkerProps) {
    return (
        <div className="custom-marker vertical">
            <div className="marker-content">
                <div className="marker-icon-wrapper">
                    <img src={imagePath} alt={name} />
                </div>
                <div className="marker-info">
                    <div className="marker-name">{name}</div>
                </div>
            </div>
        </div>
    );
}