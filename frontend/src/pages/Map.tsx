import { default as MapComponent } from '../components/Map';
import { ClusterMarker } from '../components/ClusterMarker';
import OrganizationMarker from '../components/OrganizationMarker';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import OrganizationModal from '../components/OrganizationModal';
import { getMediaUrl } from '../config';
import './Map.css';

interface OrganizationProps {
    id: number,
    name: string,
    description: string,
    orgType: string,
    membersCount: number,
    subOrganizations?: { id: number; name: string; orgType?: string }[],
};

export default function Map() {
    const [organizations, setOrganizations] = useState<OrganizationProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [currentOrganization, setCurrentOrganization] = useState<number | null>(null);
    const [coordinatesMap, setCoordinatesMap] = useState<[number, number]>([37, 50]);

    const fetchOrganizations = async () => {
        const dataPromise = axios.get('/api/organizations');
        const timerPromise = new Promise(resolve => setTimeout(resolve, 1000));

        try {
            const [response] = await Promise.all([dataPromise, timerPromise]);
            setOrganizations(response.data);
        } catch (error) {
            console.error('Failed to fetch chats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const addJitter = (longitude: number, latitude: number, id: number): [number, number] => {
        const seed = id * 0.01;

        const jitterLong = (Math.sin(seed) * 0.002) + (Math.cos(seed * 2) * 0.001);
        const jitterLat = (Math.cos(seed) * 0.002) + (Math.sin(seed * 3) * 0.001);

        return [
            longitude + jitterLong,
            latitude + jitterLat
        ];
    };

    const navigate = useNavigate();
    const markers = useMemo(() => {
        return organizations.filter((organization: any) =>
            organization.longitude != null &&
            organization.latitude != null &&
            !isNaN(organization.longitude) &&
            !isNaN(organization.latitude)
        ).map((organization: any) => ({
            id: organization.id,
            coordinates: addJitter(organization.longitude, organization.latitude, organization.id),
            draggable: false,
            content: (
                <OrganizationMarker
                    key={organization.id}
                    imagePath={getMediaUrl(organization.imageUrl) ?? ""}
                    name={organization.name}
                />
            ),
            onClick: (id: number) => {
                setCurrentOrganization(id);
                setIsOpenModal(true);
                setCoordinatesMap([organization.longitude, organization.latitude]);
            },
            onDbClick: (id: number) => {
                const organization = organizations.find(org => org.id === id);
                if (organization) {
                    navigate(`/organizations`, {
                        state: {
                            selectOrganizationFromMap: organization
                        }
                    });
                }
            }
        }));
    }, [organizations]);

    const selectOrganization = organizations.find(organization => { return organization.id === currentOrganization });

    return (
        <>
            <div className="map-wrapper">
                {isLoading ? <Loader style={{ zIndex: 0 }} /> :
                    <>
                        <MapComponent
                            className="map-layer"
                            coordinates={coordinatesMap}
                            zoom={4}
                            camera={{ tilt: 85, azimuth: 0 }}
                            markers={markers}
                            onMapClick={() => { }}
                            zoomRange={{ min: 2, max: 40 }}
                            renderCluster={(_coordinates: any, features: any) => (<ClusterMarker count={features.length} onClick={() => { }} />)}
                        />

                        <div className="map-edge-blur" />
                    </>
                }


                <img
                    src='/image/border_map.png'
                    className="map-frame-overlay"
                    alt=""
                />
            </div>

            <div>
                {selectOrganization
                    ? <OrganizationModal
                        title={selectOrganization.name}
                        description={selectOrganization.description}
                        isOpen={isOpenModal}
                        type={selectOrganization.orgType}
                        membersCount={selectOrganization.membersCount}
                        subOrganizations={selectOrganization.subOrganizations}
                        onClose={() => {
                            setIsOpenModal(false);
                            setCurrentOrganization(null);
                        }}
                    />
                    : ""}
            </div>
        </>
    );
}