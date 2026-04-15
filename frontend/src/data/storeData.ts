import type { FeatureCollection, Point } from "geojson";

export interface StoreProperties {
    name: string;
    address: string;
    distance: string;
    phone: string;
    hours: string;
}

export const USER_LOCATION: [number, number] = [-7.7956, 110.3695];

export const storeGeoJSON: FeatureCollection<Point, StoreProperties> = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [110.3770, -7.7830], // Colombo area
            },
            properties: {
                name: "Alfatihah Branch - Colombo",
                address: "Jl. Colombo No. 1, Caturtunggal, Sleman, Yogyakarta",
                distance: "1.2 km away",
                phone: "+62 274 555 001",
                hours: "07:00 - 22:00",
            },
        },
        {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [110.3599, -7.7925], // Malioboro area
            },
            properties: {
                name: "Alfatihah Branch - Malioboro",
                address: "Jl. Malioboro No. 42, Gedongtengen, Yogyakarta",
                distance: "2.8 km away",
                phone: "+62 274 555 002",
                hours: "08:00 - 23:00",
            },
        },
        {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [110.3882, -7.7620], // Seturan area
            },
            properties: {
                name: "Alfatihah Branch - Seturan",
                address: "Jl. Seturan Raya No. 15, Caturtunggal, Sleman",
                distance: "3.5 km away",
                phone: "+62 274 555 003",
                hours: "07:00 - 21:00",
            },
        },
        {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [110.4100, -7.7825], // Maguwoharjo area
            },
            properties: {
                name: "Alfatihah Branch - Maguwoharjo",
                address: "Jl. Laksda Adisucipto KM 9, Maguwoharjo, Sleman",
                distance: "4.1 km away",
                phone: "+62 274 555 004",
                hours: "08:00 - 22:00",
            },
        },
        {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [110.3485, -7.8130], // Prawirotaman area
            },
            properties: {
                name: "Alfatihah Branch - Prawirotaman",
                address: "Jl. Prawirotaman No. 30, Brontokusuman, Yogyakarta",
                distance: "2.1 km away",
                phone: "+62 274 555 005",
                hours: "07:00 - 22:00",
            },
        },
    ],
};
