"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for marker icon issues in React-Leaflet
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

export default function Map() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-lg" />;

    const position: [number, number] = [10.3015, 103.9572]; // Sheraton Phu Quoc

    return (
        <div className="h-[400px] w-full rounded-lg overflow-hidden border-2 border-[#D4AF37]/30 shadow-xl">
            <MapContainer
                center={position}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position} icon={icon}>
                    <Popup>
                        <div className="text-center">
                            <h3 className="font-bold">쉐라톤 푸꾸옥 롱비치 리조트</h3>
                            <p>Sheraton Phu Quoc Long Beach Resort</p>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
