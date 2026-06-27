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
import { Organization } from '../types';

interface OrganizationProps {
    id: number,
    name: string,
    description: string,
    orgType: string,
    membersCount: number,
    coverImage?: string,
    presetCoverUrl?: string,
    typeDefaultCoverUrl?: string,
    subOrganizations?: Organization[],
};

export default function Map() {
    const [organizations, setOrganizations] = useState<OrganizationProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [currentOrganization, setCurrentOrganization] = useState<number | null>(null);
    const [coordinatesMap, setCoordinatesMap] = useState<[number, number]>([37, 50]);
    const [currentZoom, setCurrentZoom] = useState<number | null>(null);

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
        const allMarkers: any[] = [];
        
        const BASE_RADIUS = 0.12;
        const RADIUS_SCALE = 0.4;
        
        const addOrganizationWithChildren = (
            org: any, 
            parentLon: number, 
            parentLat: number, 
            angle: number, 
            radius: number,
            level: number = 0
        ) => {
            const lon = Number(org.longitude);
            const lat = Number(org.latitude);
            
            const orgLon = level === 0 
                ? lon 
                : parentLon + (radius / Math.cos(parentLat * Math.PI / 180)) * Math.cos(angle);
            const orgLat = level === 0 
                ? lat 
                : parentLat + radius * Math.sin(angle);
            
            allMarkers.push({
                id: org.id,
                coordinates: level === 0 ? addJitter(orgLon, orgLat, org.id) : [orgLon, orgLat],
                draggable: false,
                content: (
                    <OrganizationMarker
                        key={`org-${level}-${org.id}`}
                        imagePath={getMediaUrl(org.imageUrl) ?? ""}
                        name={org.name}
                        orgLevel={level}
                        zoom={currentZoom}
                    />
                ),
                onClick: (id: number) => {
                    setCurrentOrganization(id);
                    setIsOpenModal(true);
                    // setCoordinatesMap([orgLon, orgLat]);
                },
                onDbClick: (id: number) => {
                    navigate(`/organizations`, {
                        state: { selectOrganizationFromMap: org }
                    });
                }
            });
            
            if (org.subOrganizations && org.subOrganizations.length > 0) {
                const subOrgs = org.subOrganizations;
                const count = subOrgs.length;
                const childRadius = radius * RADIUS_SCALE;
                
                subOrgs.forEach((subOrg: any, index: number) => {
                    const childAngle = (2 * Math.PI * index) / count;
                    addOrganizationWithChildren(
                        subOrg, 
                        orgLon, 
                        orgLat, 
                        childAngle, 
                        childRadius, 
                        level + 1
                    );
                });
            }
        };
        
        organizations.forEach((organization: any) => {
            const lon = Number(organization.longitude);
            const lat = Number(organization.latitude);
            
            if (
                organization.longitude != null &&
                organization.latitude != null &&
                !isNaN(lon) &&
                !isNaN(lat)
            ) {
                addOrganizationWithChildren(organization, lon, lat, 0, BASE_RADIUS, 0);
            }
        });
        
        return allMarkers;
    }, [organizations]);

    const findOrg = (orgId: number) => {
        let orgData = null;

        organizations.forEach(org => {
            if (org.id == orgId) {
                orgData = org;
            }

            if (org.subOrganizations && org.subOrganizations.length !== 0) {
                const suborgs = org.subOrganizations;

                suborgs.forEach(suborg => {
                    if (suborg.id == orgId) {
                        orgData = suborg;
                    }

                    if (suborg.subOrganizations && suborg.subOrganizations.length !== 0) {
                        const subsuborgs = suborg.subOrganizations;

                        subsuborgs.forEach(subsuborg => {
                            if (subsuborg.id == orgId) {
                                orgData = subsuborg;
                            }
                        });
                    }
                });
            }
        });

        return orgData;
    }

    // const selectOrganization = organizations.find(organization => { return organization.id === currentOrganization });
    const selectOrganization = findOrg(currentOrganization || -1);

    const onChangeZoom = (zoom: number) => {
        // setCurrentZoom(zoom);
    }

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
                            onChangeZoom={onChangeZoom}
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
                        coverImage={selectOrganization.coverImage}
                        presetCoverUrl={selectOrganization.presetCoverUrl}
                        typeDefaultCoverUrl={selectOrganization.typeDefaultCoverUrl}
                        onClose={() => {
                            setIsOpenModal(false);
                            setCurrentOrganization(null);
                        }}
                        imageIconUrl={selectOrganization.imageUrl}
                    />
                    : ""}
            </div>
        </>
    );
}