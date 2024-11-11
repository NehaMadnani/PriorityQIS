"use client";

import React, { useState, useEffect, ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import { LatLngExpression } from 'leaflet';
import { useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import PriorityWeightSliders from '../components/Slider';

// Combining Region and NewRegion interfaces
type CombinedRegion = {
    id?: number;
    name?: string;
    coordinates?: number[];
    ndvi: number;
    nightLights: number;
    area?: number;
    population?: number;
    priorityScore?: number;
    landDegradation: number;
    wealth: number;
    populationTrend: number;
    luminosity: number;
};

interface ClientOnlyProps {
    children: ReactNode;
}

interface Weights {
    ld: number;
    wealth: number;
    pop: number;
    lum: number;
}

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then((mod) => mod.Circle), { ssr: false });
const MapTooltip = dynamic(() => import('react-leaflet').then((mod) => mod.Tooltip), { ssr: false });

// Client-side only wrapper component
const ClientOnly = ({ children }: ClientOnlyProps) => {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) return null;
    return <>{children}</>;
};

const countryCoordinates: { [key: string]: LatLngExpression } = {
    Algeria: [28.0339, 1.6596],
    Angola: [-11.2027, 17.8739],
    Benin: [9.3077, 2.3158],
    Botswana: [-22.3285, 24.6849],
    "Burkina Faso": [12.2383, -1.5616],
    Burundi: [-3.3731, 29.9189],
    Cameroon: [3.848, 11.5021],
    Chad: [15.4542, 18.7322],
    "Democratic Republic of the Congo": [-4.0383, 21.7587],
    Egypt: [26.8206, 30.8025],
    Ethiopia: [9.145, 40.4897],
    Ghana: [7.9465, -1.0232],
    Kenya: [-1.2921, 36.8219],
    Madagascar: [-18.7669, 46.8691],
    Malawi: [-13.2543, 34.3015],
    Mali: [17.5707, -3.9962],
    Morocco: [31.7917, -7.0926],
    Mozambique: [-18.6657, 35.5296],
    Namibia: [-22.9576, 18.4904]
};

const mockRegions: CombinedRegion[] = [
    {
        id: 1,
        name: "Algiers",
        coordinates: [36.7538, 3.0588],
        landDegradation: 0.7,
        wealth: 0.3,
        populationTrend: 0.5,
        luminosity: 0.2,
        ndvi: 0.6,
        nightLights: 0.4
    },
    {
        id: 2,
        name: "Oran",
        coordinates: [35.6969, -0.6331],
        landDegradation: 0.6,
        wealth: 0.4,
        populationTrend: 0.4,
        luminosity: 0.3,
        ndvi: 0.7,
        nightLights: 0.5
    },
    {
        id: 3,
        name: "Constantine",
        coordinates: [36.3650, 6.6147],
        landDegradation: 0.8,
        wealth: 0.2,
        populationTrend: 0.6,
        luminosity: 0.5,
        ndvi: 0.5,
        nightLights: 0.6
    }
];

const getRegionColor = (index: number) => {
    const colors = ['#ff0000', '#ffa500', '#00ff00']; // red, orange, green
    return colors[index];
};

const MapUpdater = ({ center }: { center: LatLngExpression }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 5);
    }, [center, map]);
    return null;
};

const PriorityFundingMap = () => {
    const [selectedRegion, setSelectedRegion] = useState<CombinedRegion | null>({
        id: 0,
        name: '',
        coordinates: [0, 0],
        ndvi: 0,
        nightLights: 0,
        area: 0,
        population: 0,
        priorityScore: 0,
        landDegradation: 0,
        wealth: 0,
        populationTrend: 0,
        luminosity: 0 
    });
    const [ndviThreshold, setNdviThreshold] = useState(0.5);
    const [economicThreshold, setEconomicThreshold] = useState(0.5);
    const [weights, setWeights] = useState({ ld: 0.4, wealth: 0.25, pop: 0.2, lum: 0.15 });

    const calculatePriorityScore = (region: CombinedRegion, weights: Weights) => {
        const { landDegradation, wealth, populationTrend, luminosity } = region;
        const { ld, wealth: w, pop, lum } = weights;
        const epsilon = 0.0001;

        return (
            ld * landDegradation +
            w * (1 - wealth) +
            pop * (1 - populationTrend) +
            lum / (luminosity + epsilon)
        );
    };

    const [selectedCountry, setSelectedCountry] = useState("Mali");
    const [mapCenter, setMapCenter] = useState<LatLngExpression>(countryCoordinates["Mali"]);

    const priorityRegions = mockRegions
        .map(region => ({ ...region, priorityScore: calculatePriorityScore(region, weights) }))
        .sort((a, b) => b.priorityScore - a.priorityScore);

    const totalFunding = 1000000;
    const calculateFunding = (score: number) => (
        (score * totalFunding / priorityRegions.reduce((sum, r) => sum + r.priorityScore, 0)).toFixed(0)
    );

    useEffect(() => {
        setMapCenter(countryCoordinates[selectedCountry]);
    }, [selectedCountry]);

    type CityData = {
        [key: string]: CombinedRegion[];
    };
    
    // Add after countryCoordinates definition
    const algeriaCities: CityData = {
        "Algeria": [
            {
                id: 1,
                name: "Algiers",
                coordinates: [36.7538, 3.0588],
                landDegradation: 0.7,
                wealth: 0.3,
                populationTrend: 0.5,
                luminosity: 0.2,
                ndvi: 0.6,
                nightLights: 0.4
            },
            {
                id: 2,
                name: "Oran",
                coordinates: [35.6969, -0.6331],
                landDegradation: 0.6,
                wealth: 0.4,
                populationTrend: 0.4,
                luminosity: 0.3,
                ndvi: 0.7,
                nightLights: 0.5
            },
            {
                id: 3,
                name: "Constantine",
                coordinates: [36.3650, 6.6147],
                landDegradation: 0.8,
                wealth: 0.2,
                populationTrend: 0.6,
                luminosity: 0.5,
                ndvi: 0.5,
                nightLights: 0.6
            }
        ]
    };

    // Add this function to sort cities based on priority scores
const getSortedCities = () => {
    if (!algeriaCities["Algeria"]) return [];
    
    return [...algeriaCities["Algeria"]]
        .map(city => ({
            ...city,
            priorityScore: calculatePriorityScore(city, weights)
        }))
        .sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0));
};


    return (
        <div className="max-w-6xl mx-auto p-4 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-6 w-6" />
                        Priority Funding Map
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <select
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className="mb-4 p-2 border rounded"
                        >
                            {Object.keys(countryCoordinates).map(country => (
                                <option key={country} value={country}>{country}</option>
                            ))}
                        </select>
    
                        <PriorityWeightSliders setWeights={setWeights} />
    
                        <ClientOnly>
                            <div className="h-[500px] relative border rounded-lg overflow-hidden">
                                <MapContainer center={mapCenter} zoom={5} className="h-full w-full">
                                    <MapUpdater center={mapCenter} />
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    {selectedCountry === "Algeria" && getSortedCities().map((region, index) => (
                                        <Circle
                                            key={region.id}
                                            center={region.coordinates as LatLngExpression}
                                            radius={75000}
                                            pathOptions={{
                                                fillColor: getRegionColor(index),
                                                fillOpacity: 0.7,
                                                color: selectedRegion?.id === region.id ? '#000' : getRegionColor(index),
                                                weight: selectedRegion?.id === region.id ? 2 : 1
                                            }}
                                            eventHandlers={{
                                                click: () => setSelectedRegion(region)
                                            }}
                                        >
                                            <MapTooltip>
                                                <div>
                                                    <strong>{region.name}</strong><br />
                                                    Priority Score: {calculatePriorityScore(region, weights).toFixed(2)}<br />
                                                    Suggested Funding: ${calculateFunding(calculatePriorityScore(region, weights))}
                                                </div>
                                            </MapTooltip>
                                        </Circle>
                                    ))}

                                </MapContainer>
                            </div>
                        </ClientOnly>
    
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">NDVI Threshold</label>
                                <Slider
                                    value={[ndviThreshold]}
                                    max={1}
                                    step={0.1}
                                    onValueChange={(value) => setNdviThreshold(value[0])}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Economic Activity Threshold</label>
                                <Slider
                                    value={[economicThreshold]}
                                    max={1}
                                    step={0.1}
                                    onValueChange={(value) => setEconomicThreshold(value[0])}
                                />
                            </div>
    
                            {selectedRegion && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{selectedRegion.name} Details</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span>NDVI Score:</span>
                                                <span>{selectedRegion.ndvi.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Economic Activity:</span>
                                                <span>{selectedRegion.nightLights.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Area:</span>
                                                <span>{selectedRegion.area} km²</span>
                                            </div>
                                            {selectedRegion.population !== undefined && (
                                                <div className="flex justify-between">
                                                    <span>Population:</span>
                                                    <span>{selectedRegion.population.toLocaleString()}</span>
                                                </div>
                                            )}
                                            {selectedRegion.priorityScore !== undefined && (
                                                <div className="flex justify-between font-bold">
                                                    <span>Priority Score:</span>
                                                    <span>{selectedRegion.priorityScore.toFixed(2)}</span>
                                                </div>
                                            )}
                                            {selectedRegion.priorityScore !== undefined && (
                                                <div className="flex justify-between text-green-600 font-bold">
                                                    <span>Suggested Funding:</span>
                                                    <span>${calculateFunding(selectedRegion.priorityScore)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
    
                            <ClientOnly>
                                <BarChart
                                    width={400}
                                    height={200}
                                    data={priorityRegions}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="ndvi" fill="#82ca9d" name="Vegetation Index" />
                                    <Bar dataKey="nightLights" fill="#8884d8" name="Economic Activity" />
                                </BarChart>
                            </ClientOnly>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PriorityFundingMap;
