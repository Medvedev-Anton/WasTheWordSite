import './Loader.css';

export default function Loader({ ...props }) {
    return (
        <div className="map-loading-container" {...props}>
            <div className="map-loading-spinner">
                <div className="spinner"></div>
            </div>
        </div>
    );
}