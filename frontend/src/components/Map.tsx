import React, { useCallback, useMemo } from "react";
import {
    YMap,
    YMapDefaultSchemeLayer,
    YMapDefaultFeaturesLayer,
    YMapMarker,
    YMapListener,
    YMapComponentsProvider,
    YMapCustomClusterer
} from "ymap3-components";
import './Map.css';

interface MarkerProps {
    coordinates: number[],
    id: number,
    draggable: boolean,
    content: React.ReactNode,
    onClick?: (id: number) => void,
    onDbClick?: (id: number) => void
}

interface MapProps extends React.HTMLAttributes<HTMLDivElement> {
    coordinates: [number, number],
    zoom: number,
    zoomRange: { min: number, max: number },
    markers: MarkerProps[],
    onMapClick?: (event: any, coordinates: any) => void,
    renderCluster: (coordinates: any, features: any) => React.ReactNode,
    gridSize?: number,
    camera?: { tilt: number, azimuth: number }
}

export default function Map({
    coordinates,
    zoom,
    markers,
    onMapClick,
    zoomRange,
    renderCluster,
    camera,
    gridSize,
    ...props }: MapProps) {
    let location = {
        center: coordinates,
        zoom: zoom
    };

    const features = useMemo(() => {
        return markers.map(marker => ({
            type: 'Feature',
            id: marker.id,
            geometry: {
                type: 'Point',
                coordinates: marker.coordinates
            },
            properties: {
                originalMarker: marker
            }
        }));
    }, [markers]);

    const renderMarker = useCallback((feature: any) => {
        const marker = feature.properties.originalMarker;
        return (
            <YMapMarker
                key={`marker-${marker.id}-${marker.coordinates[0]}-${marker.coordinates[1]}`}
                coordinates={marker.coordinates}
                draggable={marker.draggable}
                onClick={() => marker.onClick?.(marker.id)}
                onDoubleClick={() => marker.onDbClick?.(marker.id)}
            >
                {marker.content}
            </YMapMarker>
        );
    }, []);

    const renderClusterMarker = useCallback((coordinates: any, features: any) => {
        return (
            <YMapMarker
                key={`cluster-${coordinates[0]}-${coordinates[1]}`}
                coordinates={coordinates}
            >
                {renderCluster(coordinates, features)}
            </YMapMarker>
        );
    }, [renderCluster]);

    const darkTheme = useMemo(() => [
        {
            "tags": "geographic_line",
            "stylers": [
                {
                    "opacity": 0
                }
            ]
        },
        {
            "tags": "country",
            "elements": "geometry.fill",
            "stylers": [
                {
                    "color": "#808080"
                },
                {
                    "opacity": 0.8,
                    "zoom": 0
                },
                {
                    "opacity": 0.8,
                    "zoom": 1
                },
                {
                    "opacity": 0.8,
                    "zoom": 2
                },
                {
                    "opacity": 1,
                    "zoom": 3
                },
                {
                    "opacity": 1,
                    "zoom": 4
                },
                {
                    "opacity": 1,
                    "zoom": 5
                },
                {
                    "opacity": 1,
                    "zoom": 6
                },
                {
                    "opacity": 1,
                    "zoom": 7
                },
                {
                    "opacity": 1,
                    "zoom": 8
                },
                {
                    "opacity": 1,
                    "zoom": 9
                },
                {
                    "opacity": 1,
                    "zoom": 10
                },
                {
                    "opacity": 1,
                    "zoom": 11
                },
                {
                    "opacity": 1,
                    "zoom": 12
                },
                {
                    "opacity": 1,
                    "zoom": 13
                },
                {
                    "opacity": 1,
                    "zoom": 14
                },
                {
                    "opacity": 1,
                    "zoom": 15
                },
                {
                    "opacity": 1,
                    "zoom": 16
                },
                {
                    "opacity": 1,
                    "zoom": 17
                },
                {
                    "opacity": 1,
                    "zoom": 18
                },
                {
                    "opacity": 1,
                    "zoom": 19
                },
                {
                    "opacity": 1,
                    "zoom": 20
                },
                {
                    "opacity": 1,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": "country",
            "elements": "geometry.outline",
            "stylers": [
                {
                    "color": "#545454"
                },
                {
                    "opacity": 0.15,
                    "zoom": 0
                },
                {
                    "opacity": 0.15,
                    "zoom": 1
                },
                {
                    "opacity": 0.15,
                    "zoom": 2
                },
                {
                    "opacity": 0.15,
                    "zoom": 3
                },
                {
                    "opacity": 0.15,
                    "zoom": 4
                },
                {
                    "opacity": 0.15,
                    "zoom": 5
                },
                {
                    "opacity": 0.25,
                    "zoom": 6
                },
                {
                    "opacity": 0.5,
                    "zoom": 7
                },
                {
                    "opacity": 0.47,
                    "zoom": 8
                },
                {
                    "opacity": 0.44,
                    "zoom": 9
                },
                {
                    "opacity": 0.41,
                    "zoom": 10
                },
                {
                    "opacity": 0.38,
                    "zoom": 11
                },
                {
                    "opacity": 0.35,
                    "zoom": 12
                },
                {
                    "opacity": 0.33,
                    "zoom": 13
                },
                {
                    "opacity": 0.3,
                    "zoom": 14
                },
                {
                    "opacity": 0.28,
                    "zoom": 15
                },
                {
                    "opacity": 0.25,
                    "zoom": 16
                },
                {
                    "opacity": 0.25,
                    "zoom": 17
                },
                {
                    "opacity": 0.25,
                    "zoom": 18
                },
                {
                    "opacity": 0.25,
                    "zoom": 19
                },
                {
                    "opacity": 0.25,
                    "zoom": 20
                },
                {
                    "opacity": 0.25,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": "region",
            "elements": "geometry.fill",
            "stylers": [
                {
                    "color": "#666666",
                    "opacity": 0.5,
                    "zoom": 0
                },
                {
                    "color": "#666666",
                    "opacity": 0.5,
                    "zoom": 1
                },
                {
                    "color": "#666666",
                    "opacity": 0.5,
                    "zoom": 2
                },
                {
                    "color": "#666666",
                    "opacity": 0.5,
                    "zoom": 3
                },
                {
                    "color": "#666666",
                    "opacity": 0.5,
                    "zoom": 4
                },
                {
                    "color": "#666666",
                    "opacity": 0.5,
                    "zoom": 5
                },
                {
                    "color": "#666666",
                    "opacity": 1,
                    "zoom": 6
                },
                {
                    "color": "#666666",
                    "opacity": 1,
                    "zoom": 7
                },
                {
                    "color": "#808080",
                    "opacity": 1,
                    "zoom": 8
                },
                {
                    "color": "#808080",
                    "opacity": 1,
                    "zoom": 9
                },
                {
                    "color": "#808080",
                    "opacity": 1,
                    "zoom": 10
                },
                {
                    "color": "#808080",
                    "opacity": 1,
                    "zoom": 11
                },
                {
                    "color": "#808080",
                    "opacity": 1,
                    "zoom": 12
                },
                {
                    "color": "#808080",
                    "opacity": 1,
                    "zoom": 13
                },
                {
                    "color": "#808080",
                    "opacity": 1,
                    "zoom": 14
                },
                {
                    "color": "#808080",
                    "opacity": 1,
                    "zoom": 15
                },
                {
                    "color": "#808080",
                    "opacity": 1,
                    "zoom": 16
                },
                {
                    "color": "#808080",
                    "opacity": 1,
                    "zoom": 17
                },
                {
                    "color": "#808080",
                    "opacity": 1,
                    "zoom": 18
                },
                {
                    "color": "#808080",
                    "opacity": 1,
                    "zoom": 19
                },
                {
                    "color": "#808080",
                    "opacity": 1,
                    "zoom": 20
                },
                {
                    "color": "#808080",
                    "opacity": 1,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": "region",
            "elements": "geometry.outline",
            "stylers": [
                {
                    "color": "#545454"
                },
                {
                    "opacity": 0.15,
                    "zoom": 0
                },
                {
                    "opacity": 0.15,
                    "zoom": 1
                },
                {
                    "opacity": 0.15,
                    "zoom": 2
                },
                {
                    "opacity": 0.15,
                    "zoom": 3
                },
                {
                    "opacity": 0.15,
                    "zoom": 4
                },
                {
                    "opacity": 0.15,
                    "zoom": 5
                },
                {
                    "opacity": 0.25,
                    "zoom": 6
                },
                {
                    "opacity": 0.5,
                    "zoom": 7
                },
                {
                    "opacity": 0.47,
                    "zoom": 8
                },
                {
                    "opacity": 0.44,
                    "zoom": 9
                },
                {
                    "opacity": 0.41,
                    "zoom": 10
                },
                {
                    "opacity": 0.38,
                    "zoom": 11
                },
                {
                    "opacity": 0.35,
                    "zoom": 12
                },
                {
                    "opacity": 0.33,
                    "zoom": 13
                },
                {
                    "opacity": 0.3,
                    "zoom": 14
                },
                {
                    "opacity": 0.28,
                    "zoom": 15
                },
                {
                    "opacity": 0.25,
                    "zoom": 16
                },
                {
                    "opacity": 0.25,
                    "zoom": 17
                },
                {
                    "opacity": 0.25,
                    "zoom": 18
                },
                {
                    "opacity": 0.25,
                    "zoom": 19
                },
                {
                    "opacity": 0.25,
                    "zoom": 20
                },
                {
                    "opacity": 0.25,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": {
                "any": "admin",
                "none": [
                    "country",
                    "region",
                    "locality",
                    "district",
                    "address"
                ]
            },
            "elements": "geometry.fill",
            "stylers": [
                {
                    "color": "#808080"
                },
                {
                    "opacity": 0.5,
                    "zoom": 0
                },
                {
                    "opacity": 0.5,
                    "zoom": 1
                },
                {
                    "opacity": 0.5,
                    "zoom": 2
                },
                {
                    "opacity": 0.5,
                    "zoom": 3
                },
                {
                    "opacity": 0.5,
                    "zoom": 4
                },
                {
                    "opacity": 0.5,
                    "zoom": 5
                },
                {
                    "opacity": 1,
                    "zoom": 6
                },
                {
                    "opacity": 1,
                    "zoom": 7
                },
                {
                    "opacity": 1,
                    "zoom": 8
                },
                {
                    "opacity": 1,
                    "zoom": 9
                },
                {
                    "opacity": 1,
                    "zoom": 10
                },
                {
                    "opacity": 1,
                    "zoom": 11
                },
                {
                    "opacity": 1,
                    "zoom": 12
                },
                {
                    "opacity": 1,
                    "zoom": 13
                },
                {
                    "opacity": 1,
                    "zoom": 14
                },
                {
                    "opacity": 1,
                    "zoom": 15
                },
                {
                    "opacity": 1,
                    "zoom": 16
                },
                {
                    "opacity": 1,
                    "zoom": 17
                },
                {
                    "opacity": 1,
                    "zoom": 18
                },
                {
                    "opacity": 1,
                    "zoom": 19
                },
                {
                    "opacity": 1,
                    "zoom": 20
                },
                {
                    "opacity": 1,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": {
                "any": "admin",
                "none": [
                    "country",
                    "region",
                    "locality",
                    "district",
                    "address"
                ]
            },
            "elements": "geometry.outline",
            "stylers": [
                {
                    "color": "#545454"
                },
                {
                    "opacity": 0.15,
                    "zoom": 0
                },
                {
                    "opacity": 0.15,
                    "zoom": 1
                },
                {
                    "opacity": 0.15,
                    "zoom": 2
                },
                {
                    "opacity": 0.15,
                    "zoom": 3
                },
                {
                    "opacity": 0.15,
                    "zoom": 4
                },
                {
                    "opacity": 0.15,
                    "zoom": 5
                },
                {
                    "opacity": 0.25,
                    "zoom": 6
                },
                {
                    "opacity": 0.5,
                    "zoom": 7
                },
                {
                    "opacity": 0.47,
                    "zoom": 8
                },
                {
                    "opacity": 0.44,
                    "zoom": 9
                },
                {
                    "opacity": 0.41,
                    "zoom": 10
                },
                {
                    "opacity": 0.38,
                    "zoom": 11
                },
                {
                    "opacity": 0.35,
                    "zoom": 12
                },
                {
                    "opacity": 0.33,
                    "zoom": 13
                },
                {
                    "opacity": 0.3,
                    "zoom": 14
                },
                {
                    "opacity": 0.28,
                    "zoom": 15
                },
                {
                    "opacity": 0.25,
                    "zoom": 16
                },
                {
                    "opacity": 0.25,
                    "zoom": 17
                },
                {
                    "opacity": 0.25,
                    "zoom": 18
                },
                {
                    "opacity": 0.25,
                    "zoom": 19
                },
                {
                    "opacity": 0.25,
                    "zoom": 20
                },
                {
                    "opacity": 0.25,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": {
                "any": "landcover",
                "none": "vegetation"
            },
            "stylers": [
                {
                    "hue": "#404040"
                }
            ]
        },
        {
            "tags": "vegetation",
            "elements": "geometry",
            "stylers": [
                {
                    "color": "#595959",
                    "opacity": 0.1,
                    "zoom": 0
                },
                {
                    "color": "#595959",
                    "opacity": 0.1,
                    "zoom": 1
                },
                {
                    "color": "#595959",
                    "opacity": 0.1,
                    "zoom": 2
                },
                {
                    "color": "#595959",
                    "opacity": 0.1,
                    "zoom": 3
                },
                {
                    "color": "#595959",
                    "opacity": 0.1,
                    "zoom": 4
                },
                {
                    "color": "#595959",
                    "opacity": 0.1,
                    "zoom": 5
                },
                {
                    "color": "#595959",
                    "opacity": 0.2,
                    "zoom": 6
                },
                {
                    "color": "#404040",
                    "opacity": 0.3,
                    "zoom": 7
                },
                {
                    "color": "#404040",
                    "opacity": 0.4,
                    "zoom": 8
                },
                {
                    "color": "#404040",
                    "opacity": 0.6,
                    "zoom": 9
                },
                {
                    "color": "#404040",
                    "opacity": 0.8,
                    "zoom": 10
                },
                {
                    "color": "#404040",
                    "opacity": 1,
                    "zoom": 11
                },
                {
                    "color": "#404040",
                    "opacity": 1,
                    "zoom": 12
                },
                {
                    "color": "#404040",
                    "opacity": 1,
                    "zoom": 13
                },
                {
                    "color": "#3b3b3b",
                    "opacity": 1,
                    "zoom": 14
                },
                {
                    "color": "#363636",
                    "opacity": 1,
                    "zoom": 15
                },
                {
                    "color": "#363636",
                    "opacity": 1,
                    "zoom": 16
                },
                {
                    "color": "#363636",
                    "opacity": 1,
                    "zoom": 17
                },
                {
                    "color": "#363636",
                    "opacity": 1,
                    "zoom": 18
                },
                {
                    "color": "#363636",
                    "opacity": 1,
                    "zoom": 19
                },
                {
                    "color": "#363636",
                    "opacity": 1,
                    "zoom": 20
                },
                {
                    "color": "#363636",
                    "opacity": 1,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": "park",
            "elements": "geometry",
            "stylers": [
                {
                    "color": "#404040",
                    "opacity": 0.1,
                    "zoom": 0
                },
                {
                    "color": "#404040",
                    "opacity": 0.1,
                    "zoom": 1
                },
                {
                    "color": "#404040",
                    "opacity": 0.1,
                    "zoom": 2
                },
                {
                    "color": "#404040",
                    "opacity": 0.1,
                    "zoom": 3
                },
                {
                    "color": "#404040",
                    "opacity": 0.1,
                    "zoom": 4
                },
                {
                    "color": "#404040",
                    "opacity": 0.1,
                    "zoom": 5
                },
                {
                    "color": "#404040",
                    "opacity": 0.2,
                    "zoom": 6
                },
                {
                    "color": "#404040",
                    "opacity": 0.3,
                    "zoom": 7
                },
                {
                    "color": "#404040",
                    "opacity": 0.4,
                    "zoom": 8
                },
                {
                    "color": "#404040",
                    "opacity": 0.6,
                    "zoom": 9
                },
                {
                    "color": "#404040",
                    "opacity": 0.8,
                    "zoom": 10
                },
                {
                    "color": "#404040",
                    "opacity": 1,
                    "zoom": 11
                },
                {
                    "color": "#404040",
                    "opacity": 1,
                    "zoom": 12
                },
                {
                    "color": "#404040",
                    "opacity": 1,
                    "zoom": 13
                },
                {
                    "color": "#3b3b3b",
                    "opacity": 1,
                    "zoom": 14
                },
                {
                    "color": "#363636",
                    "opacity": 1,
                    "zoom": 15
                },
                {
                    "color": "#363636",
                    "opacity": 0.9,
                    "zoom": 16
                },
                {
                    "color": "#363636",
                    "opacity": 0.8,
                    "zoom": 17
                },
                {
                    "color": "#363636",
                    "opacity": 0.7,
                    "zoom": 18
                },
                {
                    "color": "#363636",
                    "opacity": 0.7,
                    "zoom": 19
                },
                {
                    "color": "#363636",
                    "opacity": 0.7,
                    "zoom": 20
                },
                {
                    "color": "#363636",
                    "opacity": 0.7,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": "national_park",
            "elements": "geometry",
            "stylers": [
                {
                    "color": "#404040",
                    "opacity": 0.1,
                    "zoom": 0
                },
                {
                    "color": "#404040",
                    "opacity": 0.1,
                    "zoom": 1
                },
                {
                    "color": "#404040",
                    "opacity": 0.1,
                    "zoom": 2
                },
                {
                    "color": "#404040",
                    "opacity": 0.1,
                    "zoom": 3
                },
                {
                    "color": "#404040",
                    "opacity": 0.1,
                    "zoom": 4
                },
                {
                    "color": "#404040",
                    "opacity": 0.1,
                    "zoom": 5
                },
                {
                    "color": "#404040",
                    "opacity": 0.2,
                    "zoom": 6
                },
                {
                    "color": "#404040",
                    "opacity": 0.3,
                    "zoom": 7
                },
                {
                    "color": "#404040",
                    "opacity": 0.4,
                    "zoom": 8
                },
                {
                    "color": "#404040",
                    "opacity": 0.6,
                    "zoom": 9
                },
                {
                    "color": "#404040",
                    "opacity": 0.8,
                    "zoom": 10
                },
                {
                    "color": "#404040",
                    "opacity": 1,
                    "zoom": 11
                },
                {
                    "color": "#404040",
                    "opacity": 1,
                    "zoom": 12
                },
                {
                    "color": "#404040",
                    "opacity": 1,
                    "zoom": 13
                },
                {
                    "color": "#3b3b3b",
                    "opacity": 1,
                    "zoom": 14
                },
                {
                    "color": "#363636",
                    "opacity": 1,
                    "zoom": 15
                },
                {
                    "color": "#363636",
                    "opacity": 0.7,
                    "zoom": 16
                },
                {
                    "color": "#363636",
                    "opacity": 0.7,
                    "zoom": 17
                },
                {
                    "color": "#363636",
                    "opacity": 0.7,
                    "zoom": 18
                },
                {
                    "color": "#363636",
                    "opacity": 0.7,
                    "zoom": 19
                },
                {
                    "color": "#363636",
                    "opacity": 0.7,
                    "zoom": 20
                },
                {
                    "color": "#363636",
                    "opacity": 0.7,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": "cemetery",
            "elements": "geometry",
            "stylers": [
                {
                    "color": "#404040",
                    "zoom": 0
                },
                {
                    "color": "#404040",
                    "zoom": 1
                },
                {
                    "color": "#404040",
                    "zoom": 2
                },
                {
                    "color": "#404040",
                    "zoom": 3
                },
                {
                    "color": "#404040",
                    "zoom": 4
                },
                {
                    "color": "#404040",
                    "zoom": 5
                },
                {
                    "color": "#404040",
                    "zoom": 6
                },
                {
                    "color": "#404040",
                    "zoom": 7
                },
                {
                    "color": "#404040",
                    "zoom": 8
                },
                {
                    "color": "#404040",
                    "zoom": 9
                },
                {
                    "color": "#404040",
                    "zoom": 10
                },
                {
                    "color": "#404040",
                    "zoom": 11
                },
                {
                    "color": "#404040",
                    "zoom": 12
                },
                {
                    "color": "#404040",
                    "zoom": 13
                },
                {
                    "color": "#3b3b3b",
                    "zoom": 14
                },
                {
                    "color": "#363636",
                    "zoom": 15
                },
                {
                    "color": "#363636",
                    "zoom": 16
                },
                {
                    "color": "#363636",
                    "zoom": 17
                },
                {
                    "color": "#363636",
                    "zoom": 18
                },
                {
                    "color": "#363636",
                    "zoom": 19
                },
                {
                    "color": "#363636",
                    "zoom": 20
                },
                {
                    "color": "#363636",
                    "zoom": 21
                }
            ]
        },
        {
            "tags": "sports_ground",
            "elements": "geometry",
            "stylers": [
                {
                    "color": "#4d4d4d",
                    "opacity": 0,
                    "zoom": 0
                },
                {
                    "color": "#4d4d4d",
                    "opacity": 0,
                    "zoom": 1
                },
                {
                    "color": "#4d4d4d",
                    "opacity": 0,
                    "zoom": 2
                },
                {
                    "color": "#4d4d4d",
                    "opacity": 0,
                    "zoom": 3
                },
                {
                    "color": "#4d4d4d",
                    "opacity": 0,
                    "zoom": 4
                },
                {
                    "color": "#4d4d4d",
                    "opacity": 0,
                    "zoom": 5
                },
                {
                    "color": "#4d4d4d",
                    "opacity": 0,
                    "zoom": 6
                },
                {
                    "color": "#4d4d4d",
                    "opacity": 0,
                    "zoom": 7
                },
                {
                    "color": "#4d4d4d",
                    "opacity": 0,
                    "zoom": 8
                },
                {
                    "color": "#4d4d4d",
                    "opacity": 0,
                    "zoom": 9
                },
                {
                    "color": "#4d4d4d",
                    "opacity": 0,
                    "zoom": 10
                },
                {
                    "color": "#4d4d4d",
                    "opacity": 0,
                    "zoom": 11
                },
                {
                    "color": "#4d4d4d",
                    "opacity": 0,
                    "zoom": 12
                },
                {
                    "color": "#4d4d4d",
                    "opacity": 0,
                    "zoom": 13
                },
                {
                    "color": "#484848",
                    "opacity": 0,
                    "zoom": 14
                },
                {
                    "color": "#424242",
                    "opacity": 0.5,
                    "zoom": 15
                },
                {
                    "color": "#414141",
                    "opacity": 1,
                    "zoom": 16
                },
                {
                    "color": "#404040",
                    "opacity": 1,
                    "zoom": 17
                },
                {
                    "color": "#404040",
                    "opacity": 1,
                    "zoom": 18
                },
                {
                    "color": "#3f3f3f",
                    "opacity": 1,
                    "zoom": 19
                },
                {
                    "color": "#3e3e3e",
                    "opacity": 1,
                    "zoom": 20
                },
                {
                    "color": "#3d3d3d",
                    "opacity": 1,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": "terrain",
            "elements": "geometry",
            "stylers": [
                {
                    "hue": "#4d4d4d"
                },
                {
                    "opacity": 0.3,
                    "zoom": 0
                },
                {
                    "opacity": 0.3,
                    "zoom": 1
                },
                {
                    "opacity": 0.3,
                    "zoom": 2
                },
                {
                    "opacity": 0.3,
                    "zoom": 3
                },
                {
                    "opacity": 0.3,
                    "zoom": 4
                },
                {
                    "opacity": 0.35,
                    "zoom": 5
                },
                {
                    "opacity": 0.4,
                    "zoom": 6
                },
                {
                    "opacity": 0.6,
                    "zoom": 7
                },
                {
                    "opacity": 0.8,
                    "zoom": 8
                },
                {
                    "opacity": 0.9,
                    "zoom": 9
                },
                {
                    "opacity": 1,
                    "zoom": 10
                },
                {
                    "opacity": 1,
                    "zoom": 11
                },
                {
                    "opacity": 1,
                    "zoom": 12
                },
                {
                    "opacity": 1,
                    "zoom": 13
                },
                {
                    "opacity": 1,
                    "zoom": 14
                },
                {
                    "opacity": 1,
                    "zoom": 15
                },
                {
                    "opacity": 1,
                    "zoom": 16
                },
                {
                    "opacity": 1,
                    "zoom": 17
                },
                {
                    "opacity": 1,
                    "zoom": 18
                },
                {
                    "opacity": 1,
                    "zoom": 19
                },
                {
                    "opacity": 1,
                    "zoom": 20
                },
                {
                    "opacity": 1,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": "geographic_line",
            "elements": "geometry",
            "stylers": [
                {
                    "color": "#b3b3b3"
                }
            ]
        },
        {
            "tags": "land",
            "elements": "geometry",
            "stylers": [
                {
                    "color": "#4d4d4d",
                    "zoom": 0
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 1
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 2
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 3
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 4
                },
                {
                    "color": "#4a4a4a",
                    "zoom": 5
                },
                {
                    "color": "#484848",
                    "zoom": 6
                },
                {
                    "color": "#454545",
                    "zoom": 7
                },
                {
                    "color": "#424242",
                    "zoom": 8
                },
                {
                    "color": "#424242",
                    "zoom": 9
                },
                {
                    "color": "#424242",
                    "zoom": 10
                },
                {
                    "color": "#424242",
                    "zoom": 11
                },
                {
                    "color": "#424242",
                    "zoom": 12
                },
                {
                    "color": "#424242",
                    "zoom": 13
                },
                {
                    "color": "#404040",
                    "zoom": 14
                },
                {
                    "color": "#3d3d3d",
                    "zoom": 15
                },
                {
                    "color": "#3d3d3d",
                    "zoom": 16
                },
                {
                    "color": "#3c3c3c",
                    "zoom": 17
                },
                {
                    "color": "#3c3c3c",
                    "zoom": 18
                },
                {
                    "color": "#3c3c3c",
                    "zoom": 19
                },
                {
                    "color": "#3b3b3b",
                    "zoom": 20
                },
                {
                    "color": "#3b3b3b",
                    "zoom": 21
                }
            ]
        },
        {
            "tags": "residential",
            "elements": "geometry",
            "stylers": [
                {
                    "color": "#4d4d4d",
                    "opacity": 0.5,
                    "zoom": 0
                },
                {
                    "color": "#4d4d4d",
                    "opacity": 0.5,
                    "zoom": 1
                },
                {
                    "color": "#4d4d4d",
                    "opacity": 0.5,
                    "zoom": 2
                },
                {
                    "color": "#4d4d4d",
                    "opacity": 0.5,
                    "zoom": 3
                },
                {
                    "color": "#4d4d4d",
                    "opacity": 0.5,
                    "zoom": 4
                },
                {
                    "color": "#4d4d4d",
                    "opacity": 0.5,
                    "zoom": 5
                },
                {
                    "color": "#4d4d4d",
                    "opacity": 0.5,
                    "zoom": 6
                },
                {
                    "color": "#4d4d4d",
                    "opacity": 0.5,
                    "zoom": 7
                },
                {
                    "color": "#4d4d4d",
                    "opacity": 0.5,
                    "zoom": 8
                },
                {
                    "color": "#4d4d4d",
                    "opacity": 0.5,
                    "zoom": 9
                },
                {
                    "color": "#4d4d4d",
                    "opacity": 0.5,
                    "zoom": 10
                },
                {
                    "color": "#4d4d4d",
                    "opacity": 0.5,
                    "zoom": 11
                },
                {
                    "color": "#4d4d4d",
                    "opacity": 0.5,
                    "zoom": 12
                },
                {
                    "color": "#4d4d4d",
                    "opacity": 1,
                    "zoom": 13
                },
                {
                    "color": "#484848",
                    "opacity": 1,
                    "zoom": 14
                },
                {
                    "color": "#424242",
                    "opacity": 1,
                    "zoom": 15
                },
                {
                    "color": "#414141",
                    "opacity": 1,
                    "zoom": 16
                },
                {
                    "color": "#404040",
                    "opacity": 1,
                    "zoom": 17
                },
                {
                    "color": "#404040",
                    "opacity": 1,
                    "zoom": 18
                },
                {
                    "color": "#3f3f3f",
                    "opacity": 1,
                    "zoom": 19
                },
                {
                    "color": "#3e3e3e",
                    "opacity": 1,
                    "zoom": 20
                },
                {
                    "color": "#3d3d3d",
                    "opacity": 1,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": "locality",
            "elements": "geometry",
            "stylers": [
                {
                    "color": "#4d4d4d",
                    "zoom": 0
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 1
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 2
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 3
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 4
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 5
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 6
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 7
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 8
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 9
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 10
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 11
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 12
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 13
                },
                {
                    "color": "#484848",
                    "zoom": 14
                },
                {
                    "color": "#424242",
                    "zoom": 15
                },
                {
                    "color": "#414141",
                    "zoom": 16
                },
                {
                    "color": "#404040",
                    "zoom": 17
                },
                {
                    "color": "#404040",
                    "zoom": 18
                },
                {
                    "color": "#3f3f3f",
                    "zoom": 19
                },
                {
                    "color": "#3e3e3e",
                    "zoom": 20
                },
                {
                    "color": "#3d3d3d",
                    "zoom": 21
                }
            ]
        },
        {
            "tags": {
                "any": "structure",
                "none": [
                    "building",
                    "fence"
                ]
            },
            "elements": "geometry",
            "stylers": [
                {
                    "opacity": 0.9
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 0
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 1
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 2
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 3
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 4
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 5
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 6
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 7
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 8
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 9
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 10
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 11
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 12
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 13
                },
                {
                    "color": "#484848",
                    "zoom": 14
                },
                {
                    "color": "#424242",
                    "zoom": 15
                },
                {
                    "color": "#414141",
                    "zoom": 16
                },
                {
                    "color": "#404040",
                    "zoom": 17
                },
                {
                    "color": "#404040",
                    "zoom": 18
                },
                {
                    "color": "#3f3f3f",
                    "zoom": 19
                },
                {
                    "color": "#3e3e3e",
                    "zoom": 20
                },
                {
                    "color": "#3d3d3d",
                    "zoom": 21
                }
            ]
        },
        {
            "tags": "building",
            "elements": "geometry.fill",
            "stylers": [
                {
                    "color": "#4d4d4d"
                },
                {
                    "opacity": 0.7,
                    "zoom": 0
                },
                {
                    "opacity": 0.7,
                    "zoom": 1
                },
                {
                    "opacity": 0.7,
                    "zoom": 2
                },
                {
                    "opacity": 0.7,
                    "zoom": 3
                },
                {
                    "opacity": 0.7,
                    "zoom": 4
                },
                {
                    "opacity": 0.7,
                    "zoom": 5
                },
                {
                    "opacity": 0.7,
                    "zoom": 6
                },
                {
                    "opacity": 0.7,
                    "zoom": 7
                },
                {
                    "opacity": 0.7,
                    "zoom": 8
                },
                {
                    "opacity": 0.7,
                    "zoom": 9
                },
                {
                    "opacity": 0.7,
                    "zoom": 10
                },
                {
                    "opacity": 0.7,
                    "zoom": 11
                },
                {
                    "opacity": 0.7,
                    "zoom": 12
                },
                {
                    "opacity": 0.7,
                    "zoom": 13
                },
                {
                    "opacity": 0.7,
                    "zoom": 14
                },
                {
                    "opacity": 0.7,
                    "zoom": 15
                },
                {
                    "opacity": 0.9,
                    "zoom": 16
                },
                {
                    "opacity": 0.6,
                    "zoom": 17
                },
                {
                    "opacity": 0.6,
                    "zoom": 18
                },
                {
                    "opacity": 0.6,
                    "zoom": 19
                },
                {
                    "opacity": 0.6,
                    "zoom": 20
                },
                {
                    "opacity": 0.6,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": "building",
            "elements": "geometry.outline",
            "stylers": [
                {
                    "color": "#616161"
                },
                {
                    "opacity": 0.5,
                    "zoom": 0
                },
                {
                    "opacity": 0.5,
                    "zoom": 1
                },
                {
                    "opacity": 0.5,
                    "zoom": 2
                },
                {
                    "opacity": 0.5,
                    "zoom": 3
                },
                {
                    "opacity": 0.5,
                    "zoom": 4
                },
                {
                    "opacity": 0.5,
                    "zoom": 5
                },
                {
                    "opacity": 0.5,
                    "zoom": 6
                },
                {
                    "opacity": 0.5,
                    "zoom": 7
                },
                {
                    "opacity": 0.5,
                    "zoom": 8
                },
                {
                    "opacity": 0.5,
                    "zoom": 9
                },
                {
                    "opacity": 0.5,
                    "zoom": 10
                },
                {
                    "opacity": 0.5,
                    "zoom": 11
                },
                {
                    "opacity": 0.5,
                    "zoom": 12
                },
                {
                    "opacity": 0.5,
                    "zoom": 13
                },
                {
                    "opacity": 0.5,
                    "zoom": 14
                },
                {
                    "opacity": 0.5,
                    "zoom": 15
                },
                {
                    "opacity": 0.5,
                    "zoom": 16
                },
                {
                    "opacity": 1,
                    "zoom": 17
                },
                {
                    "opacity": 1,
                    "zoom": 18
                },
                {
                    "opacity": 1,
                    "zoom": 19
                },
                {
                    "opacity": 1,
                    "zoom": 20
                },
                {
                    "opacity": 1,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": {
                "any": "urban_area",
                "none": [
                    "residential",
                    "industrial",
                    "cemetery",
                    "park",
                    "medical",
                    "sports_ground",
                    "beach",
                    "construction_site"
                ]
            },
            "elements": "geometry",
            "stylers": [
                {
                    "color": "#575757",
                    "opacity": 1,
                    "zoom": 0
                },
                {
                    "color": "#575757",
                    "opacity": 1,
                    "zoom": 1
                },
                {
                    "color": "#575757",
                    "opacity": 1,
                    "zoom": 2
                },
                {
                    "color": "#575757",
                    "opacity": 1,
                    "zoom": 3
                },
                {
                    "color": "#575757",
                    "opacity": 1,
                    "zoom": 4
                },
                {
                    "color": "#575757",
                    "opacity": 1,
                    "zoom": 5
                },
                {
                    "color": "#575757",
                    "opacity": 1,
                    "zoom": 6
                },
                {
                    "color": "#575757",
                    "opacity": 1,
                    "zoom": 7
                },
                {
                    "color": "#575757",
                    "opacity": 1,
                    "zoom": 8
                },
                {
                    "color": "#575757",
                    "opacity": 1,
                    "zoom": 9
                },
                {
                    "color": "#575757",
                    "opacity": 1,
                    "zoom": 10
                },
                {
                    "color": "#575757",
                    "opacity": 1,
                    "zoom": 11
                },
                {
                    "color": "#575757",
                    "opacity": 1,
                    "zoom": 12
                },
                {
                    "color": "#575757",
                    "opacity": 1,
                    "zoom": 13
                },
                {
                    "color": "#515151",
                    "opacity": 1,
                    "zoom": 14
                },
                {
                    "color": "#4a4a4a",
                    "opacity": 1,
                    "zoom": 15
                },
                {
                    "color": "#444444",
                    "opacity": 0.67,
                    "zoom": 16
                },
                {
                    "color": "#3d3d3d",
                    "opacity": 0.33,
                    "zoom": 17
                },
                {
                    "color": "#3d3d3d",
                    "opacity": 0,
                    "zoom": 18
                },
                {
                    "color": "#3d3d3d",
                    "opacity": 0,
                    "zoom": 19
                },
                {
                    "color": "#3d3d3d",
                    "opacity": 0,
                    "zoom": 20
                },
                {
                    "color": "#3d3d3d",
                    "opacity": 0,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": "poi",
            "elements": "label.icon",
            "stylers": [
                {
                    "color": "#262626"
                },
                {
                    "secondary-color": "#404040"
                },
                {
                    "tertiary-color": "#404040"
                }
            ]
        },
        {
            "tags": "poi",
            "elements": "label.text.fill",
            "stylers": [
                {
                    "color": "#bfbfbf"
                }
            ]
        },
        {
            "tags": "poi",
            "elements": "label.text.outline",
            "stylers": [
                {
                    "color": "#0f0f0f"
                },
                {
                    "opacity": 0.5
                }
            ]
        },
        {
            "tags": "outdoor",
            "elements": "label.icon",
            "stylers": [
                {
                    "color": "#262626"
                },
                {
                    "secondary-color": "#404040"
                },
                {
                    "tertiary-color": "#404040"
                }
            ]
        },
        {
            "tags": "outdoor",
            "elements": "label.text.fill",
            "stylers": [
                {
                    "color": "#bfbfbf"
                }
            ]
        },
        {
            "tags": "outdoor",
            "elements": "label.text.outline",
            "stylers": [
                {
                    "color": "#0f0f0f"
                },
                {
                    "opacity": 0.5
                }
            ]
        },
        {
            "tags": "park",
            "elements": "label.icon",
            "stylers": [
                {
                    "color": "#262626"
                },
                {
                    "secondary-color": "#404040"
                },
                {
                    "tertiary-color": "#404040"
                }
            ]
        },
        {
            "tags": "park",
            "elements": "label.text.fill",
            "stylers": [
                {
                    "color": "#bfbfbf"
                }
            ]
        },
        {
            "tags": "park",
            "elements": "label.text.outline",
            "stylers": [
                {
                    "color": "#0f0f0f"
                },
                {
                    "opacity": 0.5
                }
            ]
        },
        {
            "tags": "cemetery",
            "elements": "label.icon",
            "stylers": [
                {
                    "color": "#262626"
                },
                {
                    "secondary-color": "#404040"
                },
                {
                    "tertiary-color": "#404040"
                }
            ]
        },
        {
            "tags": "cemetery",
            "elements": "label.text.fill",
            "stylers": [
                {
                    "color": "#bfbfbf"
                }
            ]
        },
        {
            "tags": "cemetery",
            "elements": "label.text.outline",
            "stylers": [
                {
                    "color": "#0f0f0f"
                },
                {
                    "opacity": 0.5
                }
            ]
        },
        {
            "tags": "beach",
            "elements": "label.icon",
            "stylers": [
                {
                    "color": "#262626"
                },
                {
                    "secondary-color": "#404040"
                },
                {
                    "tertiary-color": "#404040"
                }
            ]
        },
        {
            "tags": "beach",
            "elements": "label.text.fill",
            "stylers": [
                {
                    "color": "#bfbfbf"
                }
            ]
        },
        {
            "tags": "beach",
            "elements": "label.text.outline",
            "stylers": [
                {
                    "color": "#0f0f0f"
                },
                {
                    "opacity": 0.5
                }
            ]
        },
        {
            "tags": "medical",
            "elements": "label.icon",
            "stylers": [
                {
                    "color": "#262626"
                },
                {
                    "secondary-color": "#404040"
                },
                {
                    "tertiary-color": "#404040"
                }
            ]
        },
        {
            "tags": "medical",
            "elements": "label.text.fill",
            "stylers": [
                {
                    "color": "#bfbfbf"
                }
            ]
        },
        {
            "tags": "medical",
            "elements": "label.text.outline",
            "stylers": [
                {
                    "color": "#0f0f0f"
                },
                {
                    "opacity": 0.5
                }
            ]
        },
        {
            "tags": "shopping",
            "elements": "label.icon",
            "stylers": [
                {
                    "color": "#262626"
                },
                {
                    "secondary-color": "#404040"
                },
                {
                    "tertiary-color": "#404040"
                }
            ]
        },
        {
            "tags": "shopping",
            "elements": "label.text.fill",
            "stylers": [
                {
                    "color": "#bfbfbf"
                }
            ]
        },
        {
            "tags": "shopping",
            "elements": "label.text.outline",
            "stylers": [
                {
                    "color": "#0f0f0f"
                },
                {
                    "opacity": 0.5
                }
            ]
        },
        {
            "tags": "commercial_services",
            "elements": "label.icon",
            "stylers": [
                {
                    "color": "#262626"
                },
                {
                    "secondary-color": "#404040"
                },
                {
                    "tertiary-color": "#404040"
                }
            ]
        },
        {
            "tags": "commercial_services",
            "elements": "label.text.fill",
            "stylers": [
                {
                    "color": "#bfbfbf"
                }
            ]
        },
        {
            "tags": "commercial_services",
            "elements": "label.text.outline",
            "stylers": [
                {
                    "color": "#0f0f0f"
                },
                {
                    "opacity": 0.5
                }
            ]
        },
        {
            "tags": "food_and_drink",
            "elements": "label.icon",
            "stylers": [
                {
                    "color": "#262626"
                },
                {
                    "secondary-color": "#404040"
                },
                {
                    "tertiary-color": "#404040"
                }
            ]
        },
        {
            "tags": "food_and_drink",
            "elements": "label.text.fill",
            "stylers": [
                {
                    "color": "#bfbfbf"
                }
            ]
        },
        {
            "tags": "food_and_drink",
            "elements": "label.text.outline",
            "stylers": [
                {
                    "color": "#0f0f0f"
                },
                {
                    "opacity": 0.5
                }
            ]
        },
        {
            "tags": "road",
            "elements": "label.icon",
            "types": "point",
            "stylers": [
                {
                    "color": "#262626"
                },
                {
                    "secondary-color": "#404040"
                },
                {
                    "tertiary-color": "#404040"
                }
            ]
        },
        {
            "tags": "road",
            "elements": "label.text.fill",
            "types": "point",
            "stylers": [
                {
                    "color": "#404040"
                }
            ]
        },
        {
            "tags": "entrance",
            "elements": "label.icon",
            "stylers": [
                {
                    "color": "#262626"
                },
                {
                    "secondary-color": "#404040"
                },
                {
                    "hue": "#000000"
                }
            ]
        },
        {
            "tags": "locality",
            "elements": "label.icon",
            "stylers": [
                {
                    "color": "#262626"
                },
                {
                    "secondary-color": "#404040"
                }
            ]
        },
        {
            "tags": "country",
            "elements": "label.text.fill",
            "stylers": [
                {
                    "opacity": 0.8
                },
                {
                    "color": "#999999"
                }
            ]
        },
        {
            "tags": "country",
            "elements": "label.text.outline",
            "stylers": [
                {
                    "color": "#0f0f0f"
                },
                {
                    "opacity": 0.5
                }
            ]
        },
        {
            "tags": "region",
            "elements": "label.text.fill",
            "stylers": [
                {
                    "color": "#999999"
                },
                {
                    "opacity": 0.8
                }
            ]
        },
        {
            "tags": "region",
            "elements": "label.text.outline",
            "stylers": [
                {
                    "color": "#0f0f0f"
                },
                {
                    "opacity": 0.5
                }
            ]
        },
        {
            "tags": "district",
            "elements": "label.text.fill",
            "stylers": [
                {
                    "color": "#999999"
                },
                {
                    "opacity": 0.8
                }
            ]
        },
        {
            "tags": "district",
            "elements": "label.text.outline",
            "stylers": [
                {
                    "color": "#0f0f0f"
                },
                {
                    "opacity": 0.5
                }
            ]
        },
        {
            "tags": {
                "any": "admin",
                "none": [
                    "country",
                    "region",
                    "locality",
                    "district",
                    "address"
                ]
            },
            "elements": "label.text.fill",
            "stylers": [
                {
                    "color": "#999999"
                }
            ]
        },
        {
            "tags": {
                "any": "admin",
                "none": [
                    "country",
                    "region",
                    "locality",
                    "district",
                    "address"
                ]
            },
            "elements": "label.text.outline",
            "stylers": [
                {
                    "color": "#0f0f0f"
                },
                {
                    "opacity": 0.5
                }
            ]
        },
        {
            "tags": "locality",
            "elements": "label.text.fill",
            "stylers": [
                {
                    "color": "#bfbfbf",
                    "zoom": 0
                },
                {
                    "color": "#bfbfbf",
                    "zoom": 1
                },
                {
                    "color": "#bfbfbf",
                    "zoom": 2
                },
                {
                    "color": "#bfbfbf",
                    "zoom": 3
                },
                {
                    "color": "#bfbfbf",
                    "zoom": 4
                },
                {
                    "color": "#c1c1c1",
                    "zoom": 5
                },
                {
                    "color": "#c3c3c3",
                    "zoom": 6
                },
                {
                    "color": "#c5c5c5",
                    "zoom": 7
                },
                {
                    "color": "#c8c8c8",
                    "zoom": 8
                },
                {
                    "color": "#cacaca",
                    "zoom": 9
                },
                {
                    "color": "#cccccc",
                    "zoom": 10
                },
                {
                    "color": "#cccccc",
                    "zoom": 11
                },
                {
                    "color": "#cccccc",
                    "zoom": 12
                },
                {
                    "color": "#cccccc",
                    "zoom": 13
                },
                {
                    "color": "#cccccc",
                    "zoom": 14
                },
                {
                    "color": "#cccccc",
                    "zoom": 15
                },
                {
                    "color": "#cccccc",
                    "zoom": 16
                },
                {
                    "color": "#cccccc",
                    "zoom": 17
                },
                {
                    "color": "#cccccc",
                    "zoom": 18
                },
                {
                    "color": "#cccccc",
                    "zoom": 19
                },
                {
                    "color": "#cccccc",
                    "zoom": 20
                },
                {
                    "color": "#cccccc",
                    "zoom": 21
                }
            ]
        },
        {
            "tags": "locality",
            "elements": "label.text.outline",
            "stylers": [
                {
                    "color": "#0f0f0f"
                },
                {
                    "opacity": 0.5
                }
            ]
        },
        {
            "tags": "road",
            "elements": "label.text.fill",
            "types": "polyline",
            "stylers": [
                {
                    "color": "#bfbfbf"
                }
            ]
        },
        {
            "tags": "road",
            "elements": "label.text.outline",
            "types": "polyline",
            "stylers": [
                {
                    "color": "#0f0f0f"
                },
                {
                    "opacity": 0.5
                }
            ]
        },
        {
            "tags": "road",
            "elements": "geometry.fill.pattern",
            "types": "polyline",
            "stylers": [
                {
                    "scale": 1
                },
                {
                    "color": "#8c8c8c"
                }
            ]
        },
        {
            "tags": "road",
            "elements": "label.text.fill",
            "types": "point",
            "stylers": [
                {
                    "color": "#bfbfbf"
                }
            ]
        },
        {
            "tags": "structure",
            "elements": "label.text.fill",
            "stylers": [
                {
                    "color": "#666666"
                },
                {
                    "opacity": 0.5
                }
            ]
        },
        {
            "tags": "structure",
            "elements": "label.text.outline",
            "stylers": [
                {
                    "color": "#0f0f0f"
                },
                {
                    "opacity": 0.5
                }
            ]
        },
        {
            "tags": "address",
            "elements": "label.text.fill",
            "stylers": [
                {
                    "color": "#666666"
                },
                {
                    "opacity": 0.9,
                    "zoom": 0
                },
                {
                    "opacity": 0.9,
                    "zoom": 1
                },
                {
                    "opacity": 0.9,
                    "zoom": 2
                },
                {
                    "opacity": 0.9,
                    "zoom": 3
                },
                {
                    "opacity": 0.9,
                    "zoom": 4
                },
                {
                    "opacity": 0.9,
                    "zoom": 5
                },
                {
                    "opacity": 0.9,
                    "zoom": 6
                },
                {
                    "opacity": 0.9,
                    "zoom": 7
                },
                {
                    "opacity": 0.9,
                    "zoom": 8
                },
                {
                    "opacity": 0.9,
                    "zoom": 9
                },
                {
                    "opacity": 0.9,
                    "zoom": 10
                },
                {
                    "opacity": 0.9,
                    "zoom": 11
                },
                {
                    "opacity": 0.9,
                    "zoom": 12
                },
                {
                    "opacity": 0.9,
                    "zoom": 13
                },
                {
                    "opacity": 0.9,
                    "zoom": 14
                },
                {
                    "opacity": 0.9,
                    "zoom": 15
                },
                {
                    "opacity": 0.9,
                    "zoom": 16
                },
                {
                    "opacity": 1,
                    "zoom": 17
                },
                {
                    "opacity": 1,
                    "zoom": 18
                },
                {
                    "opacity": 1,
                    "zoom": 19
                },
                {
                    "opacity": 1,
                    "zoom": 20
                },
                {
                    "opacity": 1,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": "address",
            "elements": "label.text.outline",
            "stylers": [
                {
                    "color": "#0f0f0f"
                },
                {
                    "opacity": 0.5
                }
            ]
        },
        {
            "tags": "landscape",
            "elements": "label.text.fill",
            "stylers": [
                {
                    "color": "#999999",
                    "opacity": 1,
                    "zoom": 0
                },
                {
                    "color": "#999999",
                    "opacity": 1,
                    "zoom": 1
                },
                {
                    "color": "#999999",
                    "opacity": 1,
                    "zoom": 2
                },
                {
                    "color": "#999999",
                    "opacity": 1,
                    "zoom": 3
                },
                {
                    "color": "#666666",
                    "opacity": 0.5,
                    "zoom": 4
                },
                {
                    "color": "#666666",
                    "opacity": 0.5,
                    "zoom": 5
                },
                {
                    "color": "#666666",
                    "opacity": 0.5,
                    "zoom": 6
                },
                {
                    "color": "#666666",
                    "opacity": 0.5,
                    "zoom": 7
                },
                {
                    "color": "#666666",
                    "opacity": 0.5,
                    "zoom": 8
                },
                {
                    "color": "#666666",
                    "opacity": 0.5,
                    "zoom": 9
                },
                {
                    "color": "#666666",
                    "opacity": 0.5,
                    "zoom": 10
                },
                {
                    "color": "#666666",
                    "opacity": 0.5,
                    "zoom": 11
                },
                {
                    "color": "#666666",
                    "opacity": 0.5,
                    "zoom": 12
                },
                {
                    "color": "#666666",
                    "opacity": 0.5,
                    "zoom": 13
                },
                {
                    "color": "#666666",
                    "opacity": 0.5,
                    "zoom": 14
                },
                {
                    "color": "#666666",
                    "opacity": 0.5,
                    "zoom": 15
                },
                {
                    "color": "#666666",
                    "opacity": 0.5,
                    "zoom": 16
                },
                {
                    "color": "#666666",
                    "opacity": 0.5,
                    "zoom": 17
                },
                {
                    "color": "#666666",
                    "opacity": 0.5,
                    "zoom": 18
                },
                {
                    "color": "#666666",
                    "opacity": 0.5,
                    "zoom": 19
                },
                {
                    "color": "#666666",
                    "opacity": 0.5,
                    "zoom": 20
                },
                {
                    "color": "#666666",
                    "opacity": 0.5,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": "landscape",
            "elements": "label.text.outline",
            "stylers": [
                {
                    "color": "#0f0f0f"
                },
                {
                    "opacity": 0.5,
                    "zoom": 0
                },
                {
                    "opacity": 0.5,
                    "zoom": 1
                },
                {
                    "opacity": 0.5,
                    "zoom": 2
                },
                {
                    "opacity": 0.5,
                    "zoom": 3
                },
                {
                    "opacity": 0,
                    "zoom": 4
                },
                {
                    "opacity": 0,
                    "zoom": 5
                },
                {
                    "opacity": 0,
                    "zoom": 6
                },
                {
                    "opacity": 0,
                    "zoom": 7
                },
                {
                    "opacity": 0,
                    "zoom": 8
                },
                {
                    "opacity": 0,
                    "zoom": 9
                },
                {
                    "opacity": 0,
                    "zoom": 10
                },
                {
                    "opacity": 0,
                    "zoom": 11
                },
                {
                    "opacity": 0,
                    "zoom": 12
                },
                {
                    "opacity": 0,
                    "zoom": 13
                },
                {
                    "opacity": 0,
                    "zoom": 14
                },
                {
                    "opacity": 0,
                    "zoom": 15
                },
                {
                    "opacity": 0,
                    "zoom": 16
                },
                {
                    "opacity": 0,
                    "zoom": 17
                },
                {
                    "opacity": 0,
                    "zoom": 18
                },
                {
                    "opacity": 0,
                    "zoom": 19
                },
                {
                    "opacity": 0,
                    "zoom": 20
                },
                {
                    "opacity": 0,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": "water",
            "elements": "label.text.fill",
            "stylers": [
                {
                    "color": "#7a7a7a"
                },
                {
                    "opacity": 0.8
                }
            ]
        },
        {
            "tags": "water",
            "elements": "label.text.outline",
            "types": "polyline",
            "stylers": [
                {
                    "color": "#0f0f0f"
                },
                {
                    "opacity": 0.2
                }
            ]
        },
        {
            "tags": {
                "any": "road_1",
                "none": "is_tunnel"
            },
            "elements": "geometry.fill",
            "stylers": [
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 0
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 1
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 2
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 3
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 4
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 5
                },
                {
                    "color": "#6b6b6b",
                    "scale": 2.64,
                    "zoom": 6
                },
                {
                    "color": "#6b6b6b",
                    "scale": 2.84,
                    "zoom": 7
                },
                {
                    "color": "#6b6b6b",
                    "scale": 3.13,
                    "zoom": 8
                },
                {
                    "color": "#6b6b6b",
                    "scale": 3.55,
                    "zoom": 9
                },
                {
                    "color": "#6b6b6b",
                    "scale": 3.21,
                    "zoom": 10
                },
                {
                    "color": "#6b6b6b",
                    "scale": 2.72,
                    "zoom": 11
                },
                {
                    "color": "#6b6b6b",
                    "scale": 2.35,
                    "zoom": 12
                },
                {
                    "color": "#6b6b6b",
                    "scale": 2.02,
                    "zoom": 13
                },
                {
                    "color": "#696969",
                    "scale": 1.81,
                    "zoom": 14
                },
                {
                    "color": "#686868",
                    "scale": 1.69,
                    "zoom": 15
                },
                {
                    "color": "#666666",
                    "scale": 1.66,
                    "zoom": 16
                },
                {
                    "color": "#656565",
                    "scale": 1.31,
                    "zoom": 17
                },
                {
                    "color": "#636363",
                    "scale": 1.08,
                    "zoom": 18
                },
                {
                    "color": "#616161",
                    "scale": 0.93,
                    "zoom": 19
                },
                {
                    "color": "#606060",
                    "scale": 0.84,
                    "zoom": 20
                },
                {
                    "color": "#5e5e5e",
                    "scale": 0.8,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": {
                "any": "road_1"
            },
            "elements": "geometry.outline",
            "stylers": [
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 0
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 1
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 2
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 3
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 4
                },
                {
                    "color": "#383838",
                    "scale": 0.9,
                    "zoom": 5
                },
                {
                    "color": "#383838",
                    "scale": 1.96,
                    "zoom": 6
                },
                {
                    "color": "#383838",
                    "scale": 1.96,
                    "zoom": 7
                },
                {
                    "color": "#383838",
                    "scale": 2.02,
                    "zoom": 8
                },
                {
                    "color": "#383838",
                    "scale": 2.16,
                    "zoom": 9
                },
                {
                    "color": "#383838",
                    "scale": 2.16,
                    "zoom": 10
                },
                {
                    "color": "#383838",
                    "scale": 2.04,
                    "zoom": 11
                },
                {
                    "color": "#383838",
                    "scale": 1.93,
                    "zoom": 12
                },
                {
                    "color": "#383838",
                    "scale": 1.8,
                    "zoom": 13
                },
                {
                    "color": "#383838",
                    "scale": 1.71,
                    "zoom": 14
                },
                {
                    "color": "#383838",
                    "scale": 1.68,
                    "zoom": 15
                },
                {
                    "color": "#383838",
                    "scale": 1.7,
                    "zoom": 16
                },
                {
                    "color": "#383838",
                    "scale": 1.38,
                    "zoom": 17
                },
                {
                    "color": "#383838",
                    "scale": 1.15,
                    "zoom": 18
                },
                {
                    "color": "#383838",
                    "scale": 1,
                    "zoom": 19
                },
                {
                    "color": "#383838",
                    "scale": 0.91,
                    "zoom": 20
                },
                {
                    "color": "#383838",
                    "scale": 0.87,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": {
                "any": "road_2",
                "none": "is_tunnel"
            },
            "elements": "geometry.fill",
            "stylers": [
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 0
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 1
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 2
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 3
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 4
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 5
                },
                {
                    "color": "#6b6b6b",
                    "scale": 2.64,
                    "zoom": 6
                },
                {
                    "color": "#6b6b6b",
                    "scale": 2.84,
                    "zoom": 7
                },
                {
                    "color": "#6b6b6b",
                    "scale": 3.13,
                    "zoom": 8
                },
                {
                    "color": "#6b6b6b",
                    "scale": 3.55,
                    "zoom": 9
                },
                {
                    "color": "#6b6b6b",
                    "scale": 3.21,
                    "zoom": 10
                },
                {
                    "color": "#6b6b6b",
                    "scale": 2.72,
                    "zoom": 11
                },
                {
                    "color": "#6b6b6b",
                    "scale": 2.35,
                    "zoom": 12
                },
                {
                    "color": "#6b6b6b",
                    "scale": 2.02,
                    "zoom": 13
                },
                {
                    "color": "#696969",
                    "scale": 1.81,
                    "zoom": 14
                },
                {
                    "color": "#686868",
                    "scale": 1.69,
                    "zoom": 15
                },
                {
                    "color": "#666666",
                    "scale": 1.66,
                    "zoom": 16
                },
                {
                    "color": "#656565",
                    "scale": 1.31,
                    "zoom": 17
                },
                {
                    "color": "#636363",
                    "scale": 1.08,
                    "zoom": 18
                },
                {
                    "color": "#616161",
                    "scale": 0.93,
                    "zoom": 19
                },
                {
                    "color": "#606060",
                    "scale": 0.84,
                    "zoom": 20
                },
                {
                    "color": "#5e5e5e",
                    "scale": 0.8,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": {
                "any": "road_2"
            },
            "elements": "geometry.outline",
            "stylers": [
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 0
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 1
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 2
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 3
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 4
                },
                {
                    "color": "#383838",
                    "scale": 0.9,
                    "zoom": 5
                },
                {
                    "color": "#383838",
                    "scale": 1.96,
                    "zoom": 6
                },
                {
                    "color": "#383838",
                    "scale": 1.96,
                    "zoom": 7
                },
                {
                    "color": "#383838",
                    "scale": 2.02,
                    "zoom": 8
                },
                {
                    "color": "#383838",
                    "scale": 2.16,
                    "zoom": 9
                },
                {
                    "color": "#383838",
                    "scale": 2.16,
                    "zoom": 10
                },
                {
                    "color": "#383838",
                    "scale": 2.04,
                    "zoom": 11
                },
                {
                    "color": "#383838",
                    "scale": 1.93,
                    "zoom": 12
                },
                {
                    "color": "#383838",
                    "scale": 1.8,
                    "zoom": 13
                },
                {
                    "color": "#383838",
                    "scale": 1.71,
                    "zoom": 14
                },
                {
                    "color": "#383838",
                    "scale": 1.68,
                    "zoom": 15
                },
                {
                    "color": "#383838",
                    "scale": 1.7,
                    "zoom": 16
                },
                {
                    "color": "#383838",
                    "scale": 1.38,
                    "zoom": 17
                },
                {
                    "color": "#383838",
                    "scale": 1.15,
                    "zoom": 18
                },
                {
                    "color": "#383838",
                    "scale": 1,
                    "zoom": 19
                },
                {
                    "color": "#383838",
                    "scale": 0.91,
                    "zoom": 20
                },
                {
                    "color": "#383838",
                    "scale": 0.87,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": {
                "any": "road_3",
                "none": "is_tunnel"
            },
            "elements": "geometry.fill",
            "stylers": [
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 0
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 1
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 2
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 3
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 4
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 5
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 6
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 7
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 8
                },
                {
                    "color": "#6b6b6b",
                    "scale": 2.23,
                    "zoom": 9
                },
                {
                    "color": "#6b6b6b",
                    "scale": 2.33,
                    "zoom": 10
                },
                {
                    "color": "#6b6b6b",
                    "scale": 1.49,
                    "zoom": 11
                },
                {
                    "color": "#6b6b6b",
                    "scale": 1.48,
                    "zoom": 12
                },
                {
                    "color": "#6b6b6b",
                    "scale": 1.23,
                    "zoom": 13
                },
                {
                    "color": "#696969",
                    "scale": 1.06,
                    "zoom": 14
                },
                {
                    "color": "#686868",
                    "scale": 0.96,
                    "zoom": 15
                },
                {
                    "color": "#666666",
                    "scale": 0.92,
                    "zoom": 16
                },
                {
                    "color": "#656565",
                    "scale": 0.81,
                    "zoom": 17
                },
                {
                    "color": "#636363",
                    "scale": 0.75,
                    "zoom": 18
                },
                {
                    "color": "#616161",
                    "scale": 0.73,
                    "zoom": 19
                },
                {
                    "color": "#606060",
                    "scale": 0.75,
                    "zoom": 20
                },
                {
                    "color": "#5e5e5e",
                    "scale": 0.8,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": {
                "any": "road_3"
            },
            "elements": "geometry.outline",
            "stylers": [
                {
                    "color": "#6b6b6b",
                    "scale": 1.03,
                    "zoom": 0
                },
                {
                    "color": "#6b6b6b",
                    "scale": 1.03,
                    "zoom": 1
                },
                {
                    "color": "#6b6b6b",
                    "scale": 1.03,
                    "zoom": 2
                },
                {
                    "color": "#6b6b6b",
                    "scale": 1.03,
                    "zoom": 3
                },
                {
                    "color": "#6b6b6b",
                    "scale": 1.03,
                    "zoom": 4
                },
                {
                    "color": "#6b6b6b",
                    "scale": 1.03,
                    "zoom": 5
                },
                {
                    "color": "#6b6b6b",
                    "scale": 1.03,
                    "zoom": 6
                },
                {
                    "color": "#6b6b6b",
                    "scale": 1.03,
                    "zoom": 7
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.83,
                    "zoom": 8
                },
                {
                    "color": "#383838",
                    "scale": 2.71,
                    "zoom": 9
                },
                {
                    "color": "#383838",
                    "scale": 1.76,
                    "zoom": 10
                },
                {
                    "color": "#383838",
                    "scale": 1.31,
                    "zoom": 11
                },
                {
                    "color": "#383838",
                    "scale": 1.37,
                    "zoom": 12
                },
                {
                    "color": "#383838",
                    "scale": 1.21,
                    "zoom": 13
                },
                {
                    "color": "#383838",
                    "scale": 1.1,
                    "zoom": 14
                },
                {
                    "color": "#383838",
                    "scale": 1.02,
                    "zoom": 15
                },
                {
                    "color": "#383838",
                    "scale": 1,
                    "zoom": 16
                },
                {
                    "color": "#383838",
                    "scale": 0.88,
                    "zoom": 17
                },
                {
                    "color": "#383838",
                    "scale": 0.81,
                    "zoom": 18
                },
                {
                    "color": "#383838",
                    "scale": 0.79,
                    "zoom": 19
                },
                {
                    "color": "#383838",
                    "scale": 0.81,
                    "zoom": 20
                },
                {
                    "color": "#383838",
                    "scale": 0.87,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": {
                "any": "road_4",
                "none": "is_tunnel"
            },
            "elements": "geometry.fill",
            "stylers": [
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 0
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 1
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 2
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 3
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 4
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 5
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 6
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 7
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 8
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 9
                },
                {
                    "color": "#6b6b6b",
                    "scale": 1.5,
                    "zoom": 10
                },
                {
                    "color": "#6b6b6b",
                    "scale": 1.12,
                    "zoom": 11
                },
                {
                    "color": "#6b6b6b",
                    "scale": 1.25,
                    "zoom": 12
                },
                {
                    "color": "#6b6b6b",
                    "scale": 1.05,
                    "zoom": 13
                },
                {
                    "color": "#696969",
                    "scale": 0.93,
                    "zoom": 14
                },
                {
                    "color": "#686868",
                    "scale": 0.86,
                    "zoom": 15
                },
                {
                    "color": "#666666",
                    "scale": 1.02,
                    "zoom": 16
                },
                {
                    "color": "#656565",
                    "scale": 0.88,
                    "zoom": 17
                },
                {
                    "color": "#636363",
                    "scale": 0.79,
                    "zoom": 18
                },
                {
                    "color": "#616161",
                    "scale": 0.76,
                    "zoom": 19
                },
                {
                    "color": "#606060",
                    "scale": 0.76,
                    "zoom": 20
                },
                {
                    "color": "#5e5e5e",
                    "scale": 0.8,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": {
                "any": "road_4"
            },
            "elements": "geometry.outline",
            "stylers": [
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 0
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 1
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 2
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 3
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 4
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 5
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 6
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 7
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 8
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.72,
                    "zoom": 9
                },
                {
                    "color": "#383838",
                    "scale": 1.22,
                    "zoom": 10
                },
                {
                    "color": "#383838",
                    "scale": 1.04,
                    "zoom": 11
                },
                {
                    "color": "#383838",
                    "scale": 1.17,
                    "zoom": 12
                },
                {
                    "color": "#383838",
                    "scale": 1.06,
                    "zoom": 13
                },
                {
                    "color": "#383838",
                    "scale": 0.97,
                    "zoom": 14
                },
                {
                    "color": "#383838",
                    "scale": 0.92,
                    "zoom": 15
                },
                {
                    "color": "#383838",
                    "scale": 1.09,
                    "zoom": 16
                },
                {
                    "color": "#383838",
                    "scale": 0.95,
                    "zoom": 17
                },
                {
                    "color": "#383838",
                    "scale": 0.86,
                    "zoom": 18
                },
                {
                    "color": "#383838",
                    "scale": 0.82,
                    "zoom": 19
                },
                {
                    "color": "#383838",
                    "scale": 0.82,
                    "zoom": 20
                },
                {
                    "color": "#383838",
                    "scale": 0.86,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": {
                "any": "road_5",
                "none": "is_tunnel"
            },
            "elements": "geometry.fill",
            "stylers": [
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 0
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 1
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 2
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 3
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 4
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 5
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 6
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 7
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 8
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 9
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 10
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 11
                },
                {
                    "color": "#6b6b6b",
                    "scale": 1.11,
                    "zoom": 12
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.84,
                    "zoom": 13
                },
                {
                    "color": "#696969",
                    "scale": 0.72,
                    "zoom": 14
                },
                {
                    "color": "#686868",
                    "scale": 0.84,
                    "zoom": 15
                },
                {
                    "color": "#666666",
                    "scale": 0.97,
                    "zoom": 16
                },
                {
                    "color": "#656565",
                    "scale": 0.83,
                    "zoom": 17
                },
                {
                    "color": "#636363",
                    "scale": 0.75,
                    "zoom": 18
                },
                {
                    "color": "#616161",
                    "scale": 0.73,
                    "zoom": 19
                },
                {
                    "color": "#606060",
                    "scale": 0.74,
                    "zoom": 20
                },
                {
                    "color": "#5e5e5e",
                    "scale": 0.8,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": {
                "any": "road_5"
            },
            "elements": "geometry.outline",
            "stylers": [
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 0
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 1
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 2
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 3
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 4
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 5
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 6
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 7
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 8
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 9
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 10
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.4,
                    "zoom": 11
                },
                {
                    "color": "#383838",
                    "scale": 1.03,
                    "zoom": 12
                },
                {
                    "color": "#383838",
                    "scale": 0.88,
                    "zoom": 13
                },
                {
                    "color": "#383838",
                    "scale": 0.79,
                    "zoom": 14
                },
                {
                    "color": "#383838",
                    "scale": 0.91,
                    "zoom": 15
                },
                {
                    "color": "#383838",
                    "scale": 1.05,
                    "zoom": 16
                },
                {
                    "color": "#383838",
                    "scale": 0.9,
                    "zoom": 17
                },
                {
                    "color": "#383838",
                    "scale": 0.82,
                    "zoom": 18
                },
                {
                    "color": "#383838",
                    "scale": 0.79,
                    "zoom": 19
                },
                {
                    "color": "#383838",
                    "scale": 0.81,
                    "zoom": 20
                },
                {
                    "color": "#383838",
                    "scale": 0.86,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": {
                "any": "road_6",
                "none": "is_tunnel"
            },
            "elements": "geometry.fill",
            "stylers": [
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 0
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 1
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 2
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 3
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 4
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 5
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 6
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 7
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 8
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 9
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 10
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 11
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 12
                },
                {
                    "color": "#6b6b6b",
                    "scale": 2,
                    "zoom": 13
                },
                {
                    "color": "#696969",
                    "scale": 1.13,
                    "zoom": 14
                },
                {
                    "color": "#686868",
                    "scale": 1.11,
                    "zoom": 15
                },
                {
                    "color": "#666666",
                    "scale": 1.16,
                    "zoom": 16
                },
                {
                    "color": "#656565",
                    "scale": 0.93,
                    "zoom": 17
                },
                {
                    "color": "#636363",
                    "scale": 0.8,
                    "zoom": 18
                },
                {
                    "color": "#616161",
                    "scale": 0.75,
                    "zoom": 19
                },
                {
                    "color": "#606060",
                    "scale": 0.75,
                    "zoom": 20
                },
                {
                    "color": "#5e5e5e",
                    "scale": 0.8,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": {
                "any": "road_6"
            },
            "elements": "geometry.outline",
            "stylers": [
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 0
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 1
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 2
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 3
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 4
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 5
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 6
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 7
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 8
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 9
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 10
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 11
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 12
                },
                {
                    "color": "#383838",
                    "scale": 1.49,
                    "zoom": 13
                },
                {
                    "color": "#383838",
                    "scale": 1.09,
                    "zoom": 14
                },
                {
                    "color": "#383838",
                    "scale": 1.13,
                    "zoom": 15
                },
                {
                    "color": "#383838",
                    "scale": 1.22,
                    "zoom": 16
                },
                {
                    "color": "#383838",
                    "scale": 0.99,
                    "zoom": 17
                },
                {
                    "color": "#383838",
                    "scale": 0.87,
                    "zoom": 18
                },
                {
                    "color": "#383838",
                    "scale": 0.82,
                    "zoom": 19
                },
                {
                    "color": "#383838",
                    "scale": 0.82,
                    "zoom": 20
                },
                {
                    "color": "#383838",
                    "scale": 0.86,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": {
                "any": "road_7",
                "none": "is_tunnel"
            },
            "elements": "geometry.fill",
            "stylers": [
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 0
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 1
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 2
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 3
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 4
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 5
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 6
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 7
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 8
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 9
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 10
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 11
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 12
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0,
                    "zoom": 13
                },
                {
                    "color": "#696969",
                    "scale": 0.8,
                    "zoom": 14
                },
                {
                    "color": "#686868",
                    "scale": 0.69,
                    "zoom": 15
                },
                {
                    "color": "#666666",
                    "scale": 0.78,
                    "zoom": 16
                },
                {
                    "color": "#656565",
                    "scale": 0.71,
                    "zoom": 17
                },
                {
                    "color": "#636363",
                    "scale": 0.69,
                    "zoom": 18
                },
                {
                    "color": "#616161",
                    "scale": 0.7,
                    "zoom": 19
                },
                {
                    "color": "#606060",
                    "scale": 0.74,
                    "zoom": 20
                },
                {
                    "color": "#5e5e5e",
                    "scale": 0.8,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": {
                "any": "road_7"
            },
            "elements": "geometry.outline",
            "stylers": [
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 0
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 1
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 2
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 3
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 4
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 5
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 6
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 7
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 8
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 9
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 10
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 11
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 12
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 13
                },
                {
                    "color": "#383838",
                    "scale": 0.84,
                    "zoom": 14
                },
                {
                    "color": "#383838",
                    "scale": 0.77,
                    "zoom": 15
                },
                {
                    "color": "#383838",
                    "scale": 0.84,
                    "zoom": 16
                },
                {
                    "color": "#383838",
                    "scale": 0.78,
                    "zoom": 17
                },
                {
                    "color": "#383838",
                    "scale": 0.75,
                    "zoom": 18
                },
                {
                    "color": "#383838",
                    "scale": 0.76,
                    "zoom": 19
                },
                {
                    "color": "#383838",
                    "scale": 0.79,
                    "zoom": 20
                },
                {
                    "color": "#383838",
                    "scale": 0.86,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": {
                "any": "road_minor",
                "none": "is_tunnel"
            },
            "elements": "geometry.fill",
            "stylers": [
                {
                    "color": "#454545"
                },
                {
                    "scale": 0,
                    "zoom": 0
                },
                {
                    "scale": 0,
                    "zoom": 1
                },
                {
                    "scale": 0,
                    "zoom": 2
                },
                {
                    "scale": 0,
                    "zoom": 3
                },
                {
                    "scale": 0,
                    "zoom": 4
                },
                {
                    "scale": 0,
                    "zoom": 5
                },
                {
                    "scale": 0,
                    "zoom": 6
                },
                {
                    "scale": 0,
                    "zoom": 7
                },
                {
                    "scale": 0,
                    "zoom": 8
                },
                {
                    "scale": 0,
                    "zoom": 9
                },
                {
                    "scale": 0,
                    "zoom": 10
                },
                {
                    "scale": 0,
                    "zoom": 11
                },
                {
                    "scale": 0,
                    "zoom": 12
                },
                {
                    "scale": 0,
                    "zoom": 13
                },
                {
                    "scale": 0,
                    "zoom": 14
                },
                {
                    "scale": 0,
                    "zoom": 15
                },
                {
                    "scale": 0.8,
                    "zoom": 16
                },
                {
                    "scale": 0.8,
                    "zoom": 17
                },
                {
                    "scale": 0.8,
                    "zoom": 18
                },
                {
                    "scale": 0.8,
                    "zoom": 19
                },
                {
                    "scale": 0.8,
                    "zoom": 20
                },
                {
                    "scale": 0.8,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": {
                "any": "road_minor"
            },
            "elements": "geometry.outline",
            "stylers": [
                {
                    "opacity": 0
                }
            ]
        },
        {
            "tags": {
                "any": "road_unclassified",
                "none": "is_tunnel"
            },
            "elements": "geometry.fill",
            "stylers": [
                {
                    "color": "#454545"
                },
                {
                    "scale": 0,
                    "zoom": 0
                },
                {
                    "scale": 0,
                    "zoom": 1
                },
                {
                    "scale": 0,
                    "zoom": 2
                },
                {
                    "scale": 0,
                    "zoom": 3
                },
                {
                    "scale": 0,
                    "zoom": 4
                },
                {
                    "scale": 0,
                    "zoom": 5
                },
                {
                    "scale": 0,
                    "zoom": 6
                },
                {
                    "scale": 0,
                    "zoom": 7
                },
                {
                    "scale": 0,
                    "zoom": 8
                },
                {
                    "scale": 0,
                    "zoom": 9
                },
                {
                    "scale": 0,
                    "zoom": 10
                },
                {
                    "scale": 0,
                    "zoom": 11
                },
                {
                    "scale": 0,
                    "zoom": 12
                },
                {
                    "scale": 0,
                    "zoom": 13
                },
                {
                    "scale": 0,
                    "zoom": 14
                },
                {
                    "scale": 0,
                    "zoom": 15
                },
                {
                    "scale": 0.8,
                    "zoom": 16
                },
                {
                    "scale": 0.8,
                    "zoom": 17
                },
                {
                    "scale": 0.8,
                    "zoom": 18
                },
                {
                    "scale": 0.8,
                    "zoom": 19
                },
                {
                    "scale": 0.8,
                    "zoom": 20
                },
                {
                    "scale": 0.8,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": {
                "any": "road_unclassified"
            },
            "elements": "geometry.outline",
            "stylers": [
                {
                    "opacity": 0
                }
            ]
        },
        {
            "tags": {
                "all": "is_tunnel",
                "none": "path"
            },
            "elements": "geometry.fill",
            "stylers": [
                {
                    "color": "#525252",
                    "zoom": 0
                },
                {
                    "color": "#525252",
                    "zoom": 1
                },
                {
                    "color": "#525252",
                    "zoom": 2
                },
                {
                    "color": "#525252",
                    "zoom": 3
                },
                {
                    "color": "#525252",
                    "zoom": 4
                },
                {
                    "color": "#525252",
                    "zoom": 5
                },
                {
                    "color": "#525252",
                    "zoom": 6
                },
                {
                    "color": "#525252",
                    "zoom": 7
                },
                {
                    "color": "#525252",
                    "zoom": 8
                },
                {
                    "color": "#525252",
                    "zoom": 9
                },
                {
                    "color": "#525252",
                    "zoom": 10
                },
                {
                    "color": "#525252",
                    "zoom": 11
                },
                {
                    "color": "#525252",
                    "zoom": 12
                },
                {
                    "color": "#525252",
                    "zoom": 13
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 14
                },
                {
                    "color": "#474747",
                    "zoom": 15
                },
                {
                    "color": "#464646",
                    "zoom": 16
                },
                {
                    "color": "#454545",
                    "zoom": 17
                },
                {
                    "color": "#454545",
                    "zoom": 18
                },
                {
                    "color": "#444444",
                    "zoom": 19
                },
                {
                    "color": "#434343",
                    "zoom": 20
                },
                {
                    "color": "#424242",
                    "zoom": 21
                }
            ]
        },
        {
            "tags": {
                "all": "path",
                "none": "is_tunnel"
            },
            "elements": "geometry.fill",
            "stylers": [
                {
                    "color": "#1f1f1f"
                },
                {
                    "opacity": 0.5,
                    "zoom": 0
                },
                {
                    "opacity": 0.5,
                    "zoom": 1
                },
                {
                    "opacity": 0.5,
                    "zoom": 2
                },
                {
                    "opacity": 0.5,
                    "zoom": 3
                },
                {
                    "opacity": 0.5,
                    "zoom": 4
                },
                {
                    "opacity": 0.5,
                    "zoom": 5
                },
                {
                    "opacity": 0.5,
                    "zoom": 6
                },
                {
                    "opacity": 0.5,
                    "zoom": 7
                },
                {
                    "opacity": 0.5,
                    "zoom": 8
                },
                {
                    "opacity": 0.5,
                    "zoom": 9
                },
                {
                    "opacity": 0.5,
                    "zoom": 10
                },
                {
                    "opacity": 0.5,
                    "zoom": 11
                },
                {
                    "opacity": 0.5,
                    "zoom": 12
                },
                {
                    "opacity": 0.5,
                    "zoom": 13
                },
                {
                    "opacity": 0.5,
                    "zoom": 14
                },
                {
                    "opacity": 0.5,
                    "zoom": 15
                },
                {
                    "opacity": 0.5,
                    "zoom": 16
                },
                {
                    "opacity": 1,
                    "zoom": 17
                },
                {
                    "opacity": 1,
                    "zoom": 18
                },
                {
                    "opacity": 1,
                    "zoom": 19
                },
                {
                    "opacity": 1,
                    "zoom": 20
                },
                {
                    "opacity": 1,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": {
                "all": "path",
                "none": "is_tunnel"
            },
            "elements": "geometry.outline",
            "stylers": [
                {
                    "opacity": 0.7
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 0
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 1
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 2
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 3
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 4
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 5
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 6
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 7
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 8
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 9
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 10
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 11
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 12
                },
                {
                    "color": "#4d4d4d",
                    "zoom": 13
                },
                {
                    "color": "#484848",
                    "zoom": 14
                },
                {
                    "color": "#424242",
                    "zoom": 15
                },
                {
                    "color": "#414141",
                    "zoom": 16
                },
                {
                    "color": "#404040",
                    "zoom": 17
                },
                {
                    "color": "#404040",
                    "zoom": 18
                },
                {
                    "color": "#3f3f3f",
                    "zoom": 19
                },
                {
                    "color": "#3e3e3e",
                    "zoom": 20
                },
                {
                    "color": "#3d3d3d",
                    "zoom": 21
                }
            ]
        },
        {
            "tags": "road_construction",
            "elements": "geometry.fill",
            "stylers": [
                {
                    "color": "#6b6b6b"
                }
            ]
        },
        {
            "tags": "road_construction",
            "elements": "geometry.outline",
            "stylers": [
                {
                    "color": "#1f1f1f",
                    "zoom": 0
                },
                {
                    "color": "#1f1f1f",
                    "zoom": 1
                },
                {
                    "color": "#1f1f1f",
                    "zoom": 2
                },
                {
                    "color": "#1f1f1f",
                    "zoom": 3
                },
                {
                    "color": "#1f1f1f",
                    "zoom": 4
                },
                {
                    "color": "#1f1f1f",
                    "zoom": 5
                },
                {
                    "color": "#1f1f1f",
                    "zoom": 6
                },
                {
                    "color": "#1f1f1f",
                    "zoom": 7
                },
                {
                    "color": "#1f1f1f",
                    "zoom": 8
                },
                {
                    "color": "#1f1f1f",
                    "zoom": 9
                },
                {
                    "color": "#1f1f1f",
                    "zoom": 10
                },
                {
                    "color": "#1f1f1f",
                    "zoom": 11
                },
                {
                    "color": "#1f1f1f",
                    "zoom": 12
                },
                {
                    "color": "#1f1f1f",
                    "zoom": 13
                },
                {
                    "color": "#383838",
                    "zoom": 14
                },
                {
                    "color": "#1f1f1f",
                    "zoom": 15
                },
                {
                    "color": "#1b1b1b",
                    "zoom": 16
                },
                {
                    "color": "#161616",
                    "zoom": 17
                },
                {
                    "color": "#121212",
                    "zoom": 18
                },
                {
                    "color": "#0e0e0e",
                    "zoom": 19
                },
                {
                    "color": "#090909",
                    "zoom": 20
                },
                {
                    "color": "#050505",
                    "zoom": 21
                }
            ]
        },
        {
            "tags": {
                "any": "ferry"
            },
            "stylers": [
                {
                    "color": "#474747"
                }
            ]
        },
        {
            "tags": "transit_location",
            "elements": "label.icon",
            "stylers": [
                {
                    "hue": "#262626"
                },
                {
                    "saturation": -1
                }
            ]
        },
        {
            "tags": "transit_location",
            "elements": "label.text.fill",
            "stylers": [
                {
                    "color": "#404040"
                }
            ]
        },
        {
            "tags": "transit_location",
            "elements": "label.text.outline",
            "stylers": [
                {
                    "color": "#0f0f0f"
                }
            ]
        },
        {
            "tags": "transit_schema",
            "elements": "geometry.fill",
            "stylers": [
                {
                    "color": "#404040"
                },
                {
                    "scale": 0.7
                },
                {
                    "opacity": 0.6,
                    "zoom": 0
                },
                {
                    "opacity": 0.6,
                    "zoom": 1
                },
                {
                    "opacity": 0.6,
                    "zoom": 2
                },
                {
                    "opacity": 0.6,
                    "zoom": 3
                },
                {
                    "opacity": 0.6,
                    "zoom": 4
                },
                {
                    "opacity": 0.6,
                    "zoom": 5
                },
                {
                    "opacity": 0.6,
                    "zoom": 6
                },
                {
                    "opacity": 0.6,
                    "zoom": 7
                },
                {
                    "opacity": 0.6,
                    "zoom": 8
                },
                {
                    "opacity": 0.6,
                    "zoom": 9
                },
                {
                    "opacity": 0.6,
                    "zoom": 10
                },
                {
                    "opacity": 0.6,
                    "zoom": 11
                },
                {
                    "opacity": 0.6,
                    "zoom": 12
                },
                {
                    "opacity": 0.6,
                    "zoom": 13
                },
                {
                    "opacity": 0.6,
                    "zoom": 14
                },
                {
                    "opacity": 0.5,
                    "zoom": 15
                },
                {
                    "opacity": 0.4,
                    "zoom": 16
                },
                {
                    "opacity": 0.4,
                    "zoom": 17
                },
                {
                    "opacity": 0.4,
                    "zoom": 18
                },
                {
                    "opacity": 0.4,
                    "zoom": 19
                },
                {
                    "opacity": 0.4,
                    "zoom": 20
                },
                {
                    "opacity": 0.4,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": "transit_schema",
            "elements": "geometry.outline",
            "stylers": [
                {
                    "opacity": 0
                }
            ]
        },
        {
            "tags": "transit_line",
            "elements": "geometry.fill.pattern",
            "stylers": [
                {
                    "color": "#262626"
                },
                {
                    "opacity": 0,
                    "zoom": 0
                },
                {
                    "opacity": 0,
                    "zoom": 1
                },
                {
                    "opacity": 0,
                    "zoom": 2
                },
                {
                    "opacity": 0,
                    "zoom": 3
                },
                {
                    "opacity": 0,
                    "zoom": 4
                },
                {
                    "opacity": 0,
                    "zoom": 5
                },
                {
                    "opacity": 0,
                    "zoom": 6
                },
                {
                    "opacity": 0,
                    "zoom": 7
                },
                {
                    "opacity": 0,
                    "zoom": 8
                },
                {
                    "opacity": 0,
                    "zoom": 9
                },
                {
                    "opacity": 0,
                    "zoom": 10
                },
                {
                    "opacity": 0,
                    "zoom": 11
                },
                {
                    "opacity": 0,
                    "zoom": 12
                },
                {
                    "opacity": 1,
                    "zoom": 13
                },
                {
                    "opacity": 1,
                    "zoom": 14
                },
                {
                    "opacity": 1,
                    "zoom": 15
                },
                {
                    "opacity": 1,
                    "zoom": 16
                },
                {
                    "opacity": 1,
                    "zoom": 17
                },
                {
                    "opacity": 1,
                    "zoom": 18
                },
                {
                    "opacity": 1,
                    "zoom": 19
                },
                {
                    "opacity": 1,
                    "zoom": 20
                },
                {
                    "opacity": 1,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": "transit_line",
            "elements": "geometry.fill",
            "stylers": [
                {
                    "color": "#262626"
                },
                {
                    "scale": 0.4
                },
                {
                    "opacity": 0,
                    "zoom": 0
                },
                {
                    "opacity": 0,
                    "zoom": 1
                },
                {
                    "opacity": 0,
                    "zoom": 2
                },
                {
                    "opacity": 0,
                    "zoom": 3
                },
                {
                    "opacity": 0,
                    "zoom": 4
                },
                {
                    "opacity": 0,
                    "zoom": 5
                },
                {
                    "opacity": 0,
                    "zoom": 6
                },
                {
                    "opacity": 0,
                    "zoom": 7
                },
                {
                    "opacity": 0,
                    "zoom": 8
                },
                {
                    "opacity": 0,
                    "zoom": 9
                },
                {
                    "opacity": 0,
                    "zoom": 10
                },
                {
                    "opacity": 0,
                    "zoom": 11
                },
                {
                    "opacity": 0,
                    "zoom": 12
                },
                {
                    "opacity": 1,
                    "zoom": 13
                },
                {
                    "opacity": 1,
                    "zoom": 14
                },
                {
                    "opacity": 1,
                    "zoom": 15
                },
                {
                    "opacity": 1,
                    "zoom": 16
                },
                {
                    "opacity": 1,
                    "zoom": 17
                },
                {
                    "opacity": 1,
                    "zoom": 18
                },
                {
                    "opacity": 1,
                    "zoom": 19
                },
                {
                    "opacity": 1,
                    "zoom": 20
                },
                {
                    "opacity": 1,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": "water",
            "elements": "geometry",
            "stylers": [
                {
                    "color": "#2e2e2e",
                    "zoom": 0
                },
                {
                    "color": "#2e2e2e",
                    "zoom": 1
                },
                {
                    "color": "#2e2e2e",
                    "zoom": 2
                },
                {
                    "color": "#2e2e2e",
                    "zoom": 3
                },
                {
                    "color": "#2e2e2e",
                    "zoom": 4
                },
                {
                    "color": "#2e2e2e",
                    "zoom": 5
                },
                {
                    "color": "#2e2e2e",
                    "zoom": 6
                },
                {
                    "color": "#2e2e2e",
                    "zoom": 7
                },
                {
                    "color": "#2c2c2c",
                    "zoom": 8
                },
                {
                    "color": "#2b2b2b",
                    "zoom": 9
                },
                {
                    "color": "#292929",
                    "zoom": 10
                },
                {
                    "color": "#282828",
                    "zoom": 11
                },
                {
                    "color": "#272727",
                    "zoom": 12
                },
                {
                    "color": "#262626",
                    "zoom": 13
                },
                {
                    "color": "#252525",
                    "zoom": 14
                },
                {
                    "color": "#242424",
                    "zoom": 15
                },
                {
                    "color": "#222222",
                    "zoom": 16
                },
                {
                    "color": "#212121",
                    "zoom": 17
                },
                {
                    "color": "#202020",
                    "zoom": 18
                },
                {
                    "color": "#1f1f1f",
                    "zoom": 19
                },
                {
                    "color": "#1d1d1d",
                    "zoom": 20
                },
                {
                    "color": "#1c1c1c",
                    "zoom": 21
                }
            ]
        },
        {
            "tags": "water",
            "elements": "geometry",
            "types": "polyline",
            "stylers": [
                {
                    "opacity": 0.4,
                    "zoom": 0
                },
                {
                    "opacity": 0.4,
                    "zoom": 1
                },
                {
                    "opacity": 0.4,
                    "zoom": 2
                },
                {
                    "opacity": 0.4,
                    "zoom": 3
                },
                {
                    "opacity": 0.6,
                    "zoom": 4
                },
                {
                    "opacity": 0.8,
                    "zoom": 5
                },
                {
                    "opacity": 1,
                    "zoom": 6
                },
                {
                    "opacity": 1,
                    "zoom": 7
                },
                {
                    "opacity": 1,
                    "zoom": 8
                },
                {
                    "opacity": 1,
                    "zoom": 9
                },
                {
                    "opacity": 1,
                    "zoom": 10
                },
                {
                    "opacity": 1,
                    "zoom": 11
                },
                {
                    "opacity": 1,
                    "zoom": 12
                },
                {
                    "opacity": 1,
                    "zoom": 13
                },
                {
                    "opacity": 1,
                    "zoom": 14
                },
                {
                    "opacity": 1,
                    "zoom": 15
                },
                {
                    "opacity": 1,
                    "zoom": 16
                },
                {
                    "opacity": 1,
                    "zoom": 17
                },
                {
                    "opacity": 1,
                    "zoom": 18
                },
                {
                    "opacity": 1,
                    "zoom": 19
                },
                {
                    "opacity": 1,
                    "zoom": 20
                },
                {
                    "opacity": 1,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": "bathymetry",
            "elements": "geometry",
            "stylers": [
                {
                    "hue": "#2e2e2e"
                }
            ]
        },
        {
            "tags": {
                "any": [
                    "industrial",
                    "construction_site"
                ]
            },
            "elements": "geometry",
            "stylers": [
                {
                    "color": "#454545",
                    "zoom": 0
                },
                {
                    "color": "#454545",
                    "zoom": 1
                },
                {
                    "color": "#454545",
                    "zoom": 2
                },
                {
                    "color": "#454545",
                    "zoom": 3
                },
                {
                    "color": "#454545",
                    "zoom": 4
                },
                {
                    "color": "#454545",
                    "zoom": 5
                },
                {
                    "color": "#454545",
                    "zoom": 6
                },
                {
                    "color": "#454545",
                    "zoom": 7
                },
                {
                    "color": "#454545",
                    "zoom": 8
                },
                {
                    "color": "#454545",
                    "zoom": 9
                },
                {
                    "color": "#454545",
                    "zoom": 10
                },
                {
                    "color": "#454545",
                    "zoom": 11
                },
                {
                    "color": "#454545",
                    "zoom": 12
                },
                {
                    "color": "#454545",
                    "zoom": 13
                },
                {
                    "color": "#404040",
                    "zoom": 14
                },
                {
                    "color": "#3b3b3b",
                    "zoom": 15
                },
                {
                    "color": "#3a3a3a",
                    "zoom": 16
                },
                {
                    "color": "#393939",
                    "zoom": 17
                },
                {
                    "color": "#393939",
                    "zoom": 18
                },
                {
                    "color": "#383838",
                    "zoom": 19
                },
                {
                    "color": "#373737",
                    "zoom": 20
                },
                {
                    "color": "#363636",
                    "zoom": 21
                }
            ]
        },
        {
            "tags": {
                "any": "transit",
                "none": [
                    "transit_location",
                    "transit_line",
                    "transit_schema",
                    "is_unclassified_transit"
                ]
            },
            "elements": "geometry",
            "stylers": [
                {
                    "color": "#454545",
                    "zoom": 0
                },
                {
                    "color": "#454545",
                    "zoom": 1
                },
                {
                    "color": "#454545",
                    "zoom": 2
                },
                {
                    "color": "#454545",
                    "zoom": 3
                },
                {
                    "color": "#454545",
                    "zoom": 4
                },
                {
                    "color": "#454545",
                    "zoom": 5
                },
                {
                    "color": "#454545",
                    "zoom": 6
                },
                {
                    "color": "#454545",
                    "zoom": 7
                },
                {
                    "color": "#454545",
                    "zoom": 8
                },
                {
                    "color": "#454545",
                    "zoom": 9
                },
                {
                    "color": "#454545",
                    "zoom": 10
                },
                {
                    "color": "#454545",
                    "zoom": 11
                },
                {
                    "color": "#454545",
                    "zoom": 12
                },
                {
                    "color": "#454545",
                    "zoom": 13
                },
                {
                    "color": "#404040",
                    "zoom": 14
                },
                {
                    "color": "#3b3b3b",
                    "zoom": 15
                },
                {
                    "color": "#3a3a3a",
                    "zoom": 16
                },
                {
                    "color": "#393939",
                    "zoom": 17
                },
                {
                    "color": "#393939",
                    "zoom": 18
                },
                {
                    "color": "#383838",
                    "zoom": 19
                },
                {
                    "color": "#373737",
                    "zoom": 20
                },
                {
                    "color": "#363636",
                    "zoom": 21
                }
            ]
        },
        {
            "tags": "fence",
            "elements": "geometry.fill",
            "stylers": [
                {
                    "color": "#4f4f4f"
                },
                {
                    "opacity": 0.75,
                    "zoom": 0
                },
                {
                    "opacity": 0.75,
                    "zoom": 1
                },
                {
                    "opacity": 0.75,
                    "zoom": 2
                },
                {
                    "opacity": 0.75,
                    "zoom": 3
                },
                {
                    "opacity": 0.75,
                    "zoom": 4
                },
                {
                    "opacity": 0.75,
                    "zoom": 5
                },
                {
                    "opacity": 0.75,
                    "zoom": 6
                },
                {
                    "opacity": 0.75,
                    "zoom": 7
                },
                {
                    "opacity": 0.75,
                    "zoom": 8
                },
                {
                    "opacity": 0.75,
                    "zoom": 9
                },
                {
                    "opacity": 0.75,
                    "zoom": 10
                },
                {
                    "opacity": 0.75,
                    "zoom": 11
                },
                {
                    "opacity": 0.75,
                    "zoom": 12
                },
                {
                    "opacity": 0.75,
                    "zoom": 13
                },
                {
                    "opacity": 0.75,
                    "zoom": 14
                },
                {
                    "opacity": 0.75,
                    "zoom": 15
                },
                {
                    "opacity": 0.75,
                    "zoom": 16
                },
                {
                    "opacity": 0.45,
                    "zoom": 17
                },
                {
                    "opacity": 0.45,
                    "zoom": 18
                },
                {
                    "opacity": 0.45,
                    "zoom": 19
                },
                {
                    "opacity": 0.45,
                    "zoom": 20
                },
                {
                    "opacity": 0.45,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": "medical",
            "elements": "geometry",
            "stylers": [
                {
                    "color": "#454545",
                    "zoom": 0
                },
                {
                    "color": "#454545",
                    "zoom": 1
                },
                {
                    "color": "#454545",
                    "zoom": 2
                },
                {
                    "color": "#454545",
                    "zoom": 3
                },
                {
                    "color": "#454545",
                    "zoom": 4
                },
                {
                    "color": "#454545",
                    "zoom": 5
                },
                {
                    "color": "#454545",
                    "zoom": 6
                },
                {
                    "color": "#454545",
                    "zoom": 7
                },
                {
                    "color": "#454545",
                    "zoom": 8
                },
                {
                    "color": "#454545",
                    "zoom": 9
                },
                {
                    "color": "#454545",
                    "zoom": 10
                },
                {
                    "color": "#454545",
                    "zoom": 11
                },
                {
                    "color": "#454545",
                    "zoom": 12
                },
                {
                    "color": "#454545",
                    "zoom": 13
                },
                {
                    "color": "#404040",
                    "zoom": 14
                },
                {
                    "color": "#3b3b3b",
                    "zoom": 15
                },
                {
                    "color": "#3a3a3a",
                    "zoom": 16
                },
                {
                    "color": "#393939",
                    "zoom": 17
                },
                {
                    "color": "#393939",
                    "zoom": 18
                },
                {
                    "color": "#383838",
                    "zoom": 19
                },
                {
                    "color": "#373737",
                    "zoom": 20
                },
                {
                    "color": "#363636",
                    "zoom": 21
                }
            ]
        },
        {
            "tags": "beach",
            "elements": "geometry",
            "stylers": [
                {
                    "color": "#454545",
                    "opacity": 0.3,
                    "zoom": 0
                },
                {
                    "color": "#454545",
                    "opacity": 0.3,
                    "zoom": 1
                },
                {
                    "color": "#454545",
                    "opacity": 0.3,
                    "zoom": 2
                },
                {
                    "color": "#454545",
                    "opacity": 0.3,
                    "zoom": 3
                },
                {
                    "color": "#454545",
                    "opacity": 0.3,
                    "zoom": 4
                },
                {
                    "color": "#454545",
                    "opacity": 0.3,
                    "zoom": 5
                },
                {
                    "color": "#454545",
                    "opacity": 0.3,
                    "zoom": 6
                },
                {
                    "color": "#454545",
                    "opacity": 0.3,
                    "zoom": 7
                },
                {
                    "color": "#454545",
                    "opacity": 0.3,
                    "zoom": 8
                },
                {
                    "color": "#454545",
                    "opacity": 0.3,
                    "zoom": 9
                },
                {
                    "color": "#454545",
                    "opacity": 0.3,
                    "zoom": 10
                },
                {
                    "color": "#454545",
                    "opacity": 0.3,
                    "zoom": 11
                },
                {
                    "color": "#454545",
                    "opacity": 0.3,
                    "zoom": 12
                },
                {
                    "color": "#454545",
                    "opacity": 0.65,
                    "zoom": 13
                },
                {
                    "color": "#404040",
                    "opacity": 1,
                    "zoom": 14
                },
                {
                    "color": "#3b3b3b",
                    "opacity": 1,
                    "zoom": 15
                },
                {
                    "color": "#3a3a3a",
                    "opacity": 1,
                    "zoom": 16
                },
                {
                    "color": "#393939",
                    "opacity": 1,
                    "zoom": 17
                },
                {
                    "color": "#393939",
                    "opacity": 1,
                    "zoom": 18
                },
                {
                    "color": "#383838",
                    "opacity": 1,
                    "zoom": 19
                },
                {
                    "color": "#373737",
                    "opacity": 1,
                    "zoom": 20
                },
                {
                    "color": "#363636",
                    "opacity": 1,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": {
                "all": [
                    "is_tunnel",
                    "path"
                ]
            },
            "elements": "geometry.fill",
            "stylers": [
                {
                    "color": "#303030"
                },
                {
                    "opacity": 0.3
                }
            ]
        },
        {
            "tags": {
                "all": [
                    "is_tunnel",
                    "path"
                ]
            },
            "elements": "geometry.outline",
            "stylers": [
                {
                    "opacity": 0
                }
            ]
        },
        {
            "tags": "road_limited",
            "elements": "geometry.fill",
            "stylers": [
                {
                    "color": "#1f1f1f"
                },
                {
                    "scale": 0,
                    "zoom": 0
                },
                {
                    "scale": 0,
                    "zoom": 1
                },
                {
                    "scale": 0,
                    "zoom": 2
                },
                {
                    "scale": 0,
                    "zoom": 3
                },
                {
                    "scale": 0,
                    "zoom": 4
                },
                {
                    "scale": 0,
                    "zoom": 5
                },
                {
                    "scale": 0,
                    "zoom": 6
                },
                {
                    "scale": 0,
                    "zoom": 7
                },
                {
                    "scale": 0,
                    "zoom": 8
                },
                {
                    "scale": 0,
                    "zoom": 9
                },
                {
                    "scale": 0,
                    "zoom": 10
                },
                {
                    "scale": 0,
                    "zoom": 11
                },
                {
                    "scale": 0,
                    "zoom": 12
                },
                {
                    "scale": 0.1,
                    "zoom": 13
                },
                {
                    "scale": 0.2,
                    "zoom": 14
                },
                {
                    "scale": 0.3,
                    "zoom": 15
                },
                {
                    "scale": 0.5,
                    "zoom": 16
                },
                {
                    "scale": 0.6,
                    "zoom": 17
                },
                {
                    "scale": 0.69,
                    "zoom": 18
                },
                {
                    "scale": 0.7,
                    "zoom": 19
                },
                {
                    "scale": 0.74,
                    "zoom": 20
                },
                {
                    "scale": 0.8,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": "road_limited",
            "elements": "geometry.outline",
            "stylers": [
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 0
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 1
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 2
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 3
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 4
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 5
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 6
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 7
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 8
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 9
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 10
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 11
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.9,
                    "zoom": 12
                },
                {
                    "color": "#6b6b6b",
                    "scale": 0.1,
                    "zoom": 13
                },
                {
                    "color": "#383838",
                    "scale": 0.2,
                    "zoom": 14
                },
                {
                    "color": "#383838",
                    "scale": 0.3,
                    "zoom": 15
                },
                {
                    "color": "#383838",
                    "scale": 0.5,
                    "zoom": 16
                },
                {
                    "color": "#383838",
                    "scale": 0.6,
                    "zoom": 17
                },
                {
                    "color": "#383838",
                    "scale": 0.75,
                    "zoom": 18
                },
                {
                    "color": "#383838",
                    "scale": 0.76,
                    "zoom": 19
                },
                {
                    "color": "#383838",
                    "scale": 0.79,
                    "zoom": 20
                },
                {
                    "color": "#383838",
                    "scale": 0.86,
                    "zoom": 21
                }
            ]
        },
        {
            "tags": "transit_stop",
            "elements": "label.icon",
            "stylers": [
                {
                    "color": "#0f0f0f"
                },
                {
                    "secondary-color": "#404040"
                },
                {
                    "tertiary-color": "#404040"
                }
            ]
        },
        {
            "tags": "entrance",
            "elements": "label.text.fill",
            "stylers": [
                {
                    "color": "#bfbfbf"
                },
                {
                    "opacity": 1
                }
            ]
        },
        {
            "tags": "entrance",
            "elements": "label.text.outline",
            "stylers": [
                {
                    "color": "#0f0f0f"
                },
                {
                    "opacity": 0.5
                }
            ]
        },
        {
            "tags": {
                "any": [
                    "urban_area",
                    "locality"
                ]
            },
            "elements": "geometry",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "tags": {
                "any": [
                    "terrain",
                    "bathymetry",
                    "landscape"
                ],
                "none": "land"
            },
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "tags": {
                "any": [
                    "park",
                    "cemetery"
                ]
            },
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "tags": {
                "any": [
                    "vegetation"
                ]
            },
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "tags": {
                "any": [
                    "industrial",
                    "construction_site",
                    "medical",
                    "sports_ground",
                    "beach"
                ]
            },
            "types": "polygon",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "tags": {
                "any": "transit",
                "none": [
                    "transit_location",
                    "transit_line",
                    "transit_schema",
                    "is_unclassified_transit"
                ]
            },
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "tags": {
                "any": "urban_area",
                "none": [
                    "residential",
                    "industrial",
                    "cemetery",
                    "park",
                    "medical",
                    "sports_ground",
                    "beach",
                    "construction_site"
                ]
            },
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "tags": {
                "any": [
                    "transit"
                ]
            },
            "elements": [
                "label.icon",
                "label.text"
            ],
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "tags": {
                "any": [
                    "outdoor",
                    "park",
                    "cemetery",
                    "medical"
                ]
            },
            "elements": "label",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "tags": {
                "any": "poi",
                "none": [
                    "outdoor",
                    "park",
                    "cemetery",
                    "medical"
                ]
            },
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "tags": {
                "any": "road"
            },
            "types": "point",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "tags": {
                "any": [
                    "food_and_drink",
                    "shopping",
                    "commercial_services"
                ]
            },
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "tags": {
                "any": [
                    "traffic_light"
                ]
            },
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "tags": {
                "any": [
                    "entrance"
                ]
            },
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "tags": {
                "any": [
                    "road"
                ],
                "none": [
                    "road_1",
                    "road_2",
                    "road_3",
                    "road_4",
                    "road_5",
                    "road_6",
                    "road_7"
                ]
            },
            "elements": "label.icon",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "tags": {
                "any": [
                    "region",
                    "road_1",
                    "road_2",
                    "road_3",
                    "road_4"
                ]
            },
            "elements": "label",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "tags": {
                "any": [
                    "district"
                ]
            },
            "elements": "label",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "tags": {
                "any": "admin",
                "none": [
                    "country",
                    "region",
                    "locality",
                    "district",
                    "address"
                ]
            },
            "elements": "label",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "tags": {
                "any": [
                    "road_5",
                    "road_6"
                ]
            },
            "elements": "label",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "tags": {
                "any": [
                    "address",
                    "road_7",
                    "road_limited",
                    "road_unclassified",
                    "road_minor",
                    "road_construction",
                    "path"
                ]
            },
            "elements": "label",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "tags": {
                "any": [
                    "building",
                    "address",
                    "fence"
                ]
            },
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "tags": {
                "any": [
                    "transit"
                ]
            },
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "tags": {
                "any": "landcover",
                "none": "vegetation"
            },
            "stylers": {
                "visibility": "off"
            }
        }
    ], []);

    return (
        <div {...props}>
            <YMapComponentsProvider apiKey={import.meta.env.VITE_YMAP_KEY}>
                <YMap
                    location={location}
                    zoomRange={zoomRange}
                    camera={camera}
                    behaviors={[
                        'drag',
                        'scrollZoom',
                        'mouseRotate',
                        'mouseTilt',
                        'pinchZoom',
                        'pinchRotate',
                        'panTilt']}
                >
                    <YMapDefaultSchemeLayer
                        customization={darkTheme}
                    />
                    <YMapDefaultFeaturesLayer />

                    <YMapListener
                        onClick={onMapClick}
                    />

                    <YMapCustomClusterer
                        features={features}
                        gridSize={gridSize || 16}
                        marker={renderMarker}
                        cluster={renderClusterMarker}
                    />

                </YMap>
            </YMapComponentsProvider>
        </div >
    );
}