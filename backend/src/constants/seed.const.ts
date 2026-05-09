import { EmployeeRole } from "@prisma/client"

export const minShippingCostSeed: number = 10000
export const maxShippingCostSeed: number = 30000 
export const minQuantityItemSelectedSeed: number = 1
export const maxQuantityItemSelectedSeed: number = 10
export const minDiscountFactorSeed: number = 0.8
export const maxDiscountFactorSeed: number = 1.0
export const oldestPeriodYears: number = 1 

export const branchSeedData = [
    {
        storeName: 'Toko Segar Nusantara',
        address: 'Jl. Braga No. 12, Sumur Bandung',
        city: 'Bandung',
        province: 'Jawa Barat',
        latitude: -6.9175,
        longitude: 107.6087,
        maxDeliveryDistance: 10.0,
    },
    {
        storeName: 'Warung Berkah Selatan',
        address: 'Jl. Fatmawati No. 88, Cilandak',
        city: 'Jakarta Selatan',
        province: 'DKI Jakarta',
        latitude: -6.2983,
        longitude: 106.7942,
        maxDeliveryDistance: 15.0,
    },
    {
        storeName: 'Toko Makmur Malioboro',
        address: 'Jl. Malioboro No. 21, Gedongtengen',
        city: 'Yogyakarta',
        province: 'DI Yogyakarta',
        latitude: -7.7928,
        longitude: 110.3657,
        maxDeliveryDistance: 10.0,
    },
    {
        storeName: 'Pasar Segar Monas',
        address: 'Jl. Medan Merdeka Barat No. 5, Gambir',
        city: 'Jakarta Pusat',
        province: 'DKI Jakarta',
        latitude: -6.1944,
        longitude: 106.8229,
        maxDeliveryDistance: 15.0,
    },
    {
        storeName: 'Toko Untung Tunjungan',
        address: 'Jl. Tunjungan No. 55, Genteng',
        city: 'Surabaya',
        province: 'Jawa Timur',
        latitude: -7.2575,
        longitude: 112.7521,
        maxDeliveryDistance: 12.0,
    },
]

export const userSeedData = [
    // Admins
    {
        email: 'kimgeovedi@gmail.com',
        username: 'kimgeovedi',
        role: 'EMPLOYEE' as const,
        employee: {
            fullName: 'Kim Geovedi',
            role: EmployeeRole.SUPER_ADMIN,
            branchCity: 'Yogyakarta',
        },
    },
    {
        email: 'arif.dwiyanto@gmail.com',
        username: 'arif.dwiyanto',
        role: 'EMPLOYEE' as const,
        employee: {
            fullName: 'Arif Dwiyanto',
            role: EmployeeRole.STORE_ADMIN,
            branchCity: 'Bandung',
        },
    },
    {
        email: 'flazen.work@gmail.com',
        username: 'flazen.work',
        role: 'EMPLOYEE' as const,
        employee: {
            fullName: 'Flazen Work',
            role: EmployeeRole.STORE_ADMIN,
            branchCity: 'Jakarta Selatan',
        },
    },
    {
        email: 'leonardho81@gmail.com',
        username: 'leonardho.rante',
        role: 'EMPLOYEE' as const,
        employee: {
            fullName: 'Leonardho Admin',
            role: EmployeeRole.SUPER_ADMIN,
            branchCity: 'Jakarta Selatan',
        },
    },
    // Customers
    {
        email: 'flazen.edu@gmail.com',
        username: 'flazen.edu',
        role: 'CUSTOMER' as const,
        addressCity: 'Jakarta Selatan',
        addresses: [
            { label: 'Apartemen', type: 'Rumah', receiptName: 'Flazen Edu', notes: 'Unit 12A', phone: '081200000010', address: 'Apartemen Mediterania, Jakarta Barat', isPrimary: true, province: 'DKI Jakarta', city: 'Jakarta Barat', district: 'Tanjung Duren', village: 'Tanjung Duren Selatan' },
            { label: 'Kampus', type: 'Lainnya', receiptName: 'Flazen Edu', notes: 'Gedung rektorat', phone: '081200000011', address: 'Universitas Indonesia, Depok', isPrimary: false, province: 'Jawa Barat', city: 'Depok', district: 'Beji', village: 'Kukusan' },
            { label: 'Rumah Ortu', type: 'Rumah', receiptName: 'Flazen Edu', notes: 'Cat tembok kuning', phone: '081200000012', address: 'Jl. Kebon Jeruk No. 5, Jakarta Barat', isPrimary: false, province: 'DKI Jakarta', city: 'Jakarta Barat', district: 'Kebon Jeruk', village: 'Kebon Jeruk' },
        ],
    },
    {
        email: 'tester_customer_jkt@gmail.com',
        username: 'tester_jkt',
        role: 'CUSTOMER' as const,
        addressCity: 'Jakarta Selatan',
        addresses: [
            { label: 'Rumah', type: 'Rumah', receiptName: 'Tester Jakarta', notes: 'Dekat lampu merah', phone: '081200000013', address: 'Jl. Fatmawati No. 30, Jakarta Selatan', isPrimary: true, province: 'DKI Jakarta', city: 'Jakarta Selatan', district: 'Cilandak', village: 'Cipete Selatan' },
            { label: 'Kantor', type: 'Kantor', receiptName: 'Tester Jakarta', notes: 'Lobby utama', phone: '081200000014', address: 'Jl. Gatot Subroto No. 99, Jakarta Selatan', isPrimary: false, province: 'DKI Jakarta', city: 'Jakarta Selatan', district: 'Setiabudi', village: 'Kuningan Timur' },
            { label: 'Gym', type: 'Lainnya', receiptName: 'Tester Jakarta', notes: 'Titipkan ke resepsionis', phone: '081200000015', address: 'Jl. Kemang Raya No. 12, Jakarta Selatan', isPrimary: false, province: 'DKI Jakarta', city: 'Jakarta Selatan', district: 'Mampang Prapatan', village: 'Kemang' },
        ],
    },
    {
        email: 'tester_customer_bdg@gmail.com',
        username: 'tester_bdg',
        role: 'CUSTOMER' as const,
        addressCity: 'Bandung',
        addresses: [
            { label: 'Rumah', type: 'Rumah', receiptName: 'Tester Bandung', notes: 'Depan warung bu Tini', phone: '081200000016', address: 'Jl. Cihampelas No. 100, Bandung', isPrimary: true, province: 'Jawa Barat', city: 'Bandung', district: 'Coblong', village: 'Lebak Gede' },
            { label: 'Kantor', type: 'Kantor', receiptName: 'Tester Bandung', notes: 'Lantai 4 ruang marketing', phone: '081200000017', address: 'Jl. Soekarno Hatta No. 456, Bandung', isPrimary: false, province: 'Jawa Barat', city: 'Bandung', district: 'Buah Batu', village: 'Sekejati' },
            { label: 'Kos', type: 'Rumah', receiptName: 'Tester Bandung', notes: 'Kamar paling ujung', phone: '081200000018', address: 'Jl. Tubagus Ismail No. 7, Bandung', isPrimary: false, province: 'Jawa Barat', city: 'Bandung', district: 'Coblong', village: 'Dago' },
        ],
    },
    {
        email: 'tester_customer_diy@gmail.com',
        username: 'tester_diy',
        role: 'CUSTOMER' as const,
        addressCity: 'Yogyakarta',
        addresses: [
            { label: 'Rumah', type: 'Rumah', receiptName: 'Tester Jogja', notes: 'Belakang masjid', phone: '081200000019', address: 'Jl. Malioboro No. 55, Yogyakarta', isPrimary: true, province: 'DI Yogyakarta', city: 'Yogyakarta', district: 'Gedongtengen', village: 'Sosromenduran' },
            { label: 'Kampus', type: 'Lainnya', receiptName: 'Tester Jogja', notes: 'Gedung fakultas teknik', phone: '081200000020', address: 'Universitas Gadjah Mada, Yogyakarta', isPrimary: false, province: 'DI Yogyakarta', city: 'Sleman', district: 'Depok', village: 'Caturtunggal' },
            { label: 'Kos', type: 'Rumah', receiptName: 'Tester Jogja', notes: 'Pagar merah nomor 3', phone: '081200000021', address: 'Jl. Kaliurang KM 5, Sleman, Yogyakarta', isPrimary: false, province: 'DI Yogyakarta', city: 'Sleman', district: 'Ngaglik', village: 'Sinduharjo' },
        ],
    },
]