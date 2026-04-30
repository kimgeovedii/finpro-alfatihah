import axios from "axios"
import { getCityFromCoords, getCityIdFromCoords, getLocationId, getShippingCost } from "../shipping"

jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>

describe("Shipment Utils", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })
  
    describe("getCityFromCoords", () => {
        it("Should return city name from valid coordinate", async () => {
            // Test Data
            const lat = -6.2
            const long = 106.8
    
            // Mock Third Service API
            mockedAxios.get.mockResolvedValue({
                data: {
                    results: [
                        {
                            components: { city: "Jakarta" }
                        }
                    ]
                }
            } as any)
    
            // Exec Util
            const result = await getCityFromCoords(lat, long)
    
            // Test Criteria
            expect(typeof result).toBe("string")
            expect(result).toBe("Jakarta")
        })
  
        it("Should throw error if no results found", async () => {
            // Test Data
            const lat = -6.2
            const long = 106.8
    
            // Mock Third Service API
            mockedAxios.get.mockResolvedValue({
                data: { results: [] }
            } as any)
    
            // Exec Util + Test Criteria
            await expect(getCityFromCoords(lat, long)).rejects.toEqual({
                code: 422,
                message: "Unable to resolve location from coordinates"
            })
        })
  
        it("Should fallback to town/village/county if city not available", async () => {
            // Test Data
            const lat = -6.2
            const long = 106.8
    
            // Mock Third Service API
            mockedAxios.get.mockResolvedValue({
            data: {
                results: [
                    {
                        components: { town: "Bekasi" }
                    }
                ]
            }
            } as any)
    
            // Exec Util
            const result = await getCityFromCoords(lat, long)
    
            // Test Criteria
            expect(result).toBe("Bekasi")
        })
  
        it("Should throw error if no city-related field exists", async () => {
            // Test Data
            const lat = -6.2
            const long = 106.8
    
            // Mock Third Service API
            mockedAxios.get.mockResolvedValue({
            data: {
                results: [
                    {
                        components: {}
                    }
                ]
            }
            } as any)
    
            // Exec Util + Test Criteria
            await expect(getCityFromCoords(lat, long)).rejects.toEqual({
                code: 422,
                message: "Unable to determine city from coordinates"
            })
        })
    })
  
    describe("getLocationId", () => {
        it("Should return location id from valid city name", async () => {
            // Test Data
            const cityName = "Jakarta"
    
            // Mock Third Service API
            mockedAxios.get.mockResolvedValue({
                data: {
                    data: [{ id: 123 }]
                }
            } as any)
    
            // Exec Util
            const result = await getLocationId(cityName)
    
            // Test Criteria
            expect(typeof result).toBe("number")
            expect(result).toBe(123)
        })
    
        it("Should throw error if city not found", async () => {
            // Test Data
            const cityName = "UnknownCity"
    
            // Mock Third Service API
            mockedAxios.get.mockResolvedValue({
                data: { data: [] }
            } as any)
    
            // Exec Util + Test Criteria
            await expect(getLocationId(cityName)).rejects.toEqual({
                code: 422,
                message: `City "${cityName}" not found`
            })
        })
    })
  
    describe("getCityIdFromCoords", () => {
        it("Should return city id from coordinate", async () => {
            // Test Data
            const lat = -6.2
            const long = 106.8
    
            // Mock Third Service API
            mockedAxios.get
                .mockResolvedValueOnce({
                    data: {
                        results: [
                            { components: { city: "Jakarta" } }
                        ]
                    }
                } as any)
                .mockResolvedValueOnce({
                    data: {
                        data: [{ id: 456 }]
                    }
            } as any)
    
            // Exec Util
            const result = await getCityIdFromCoords(lat, long)
    
            // Test Criteria
            expect(typeof result).toBe("number")
            expect(result).toBe(456)
        })
    })
  
    describe("getShippingCost", () => {
        it("Should return cheapest shipping cost", async () => {
            // Test Data
            const originId = 1
            const destinationId = 2
            const weight = 1000
    
            // Mock Third Service API
            mockedAxios.post.mockResolvedValue({
                data: {
                    data: [
                        { cost: 20000 },
                        { cost: 15000 },
                        { cost: 18000 }
                    ]
                }
            } as any)
    
            // Exec Util
            const result = await getShippingCost(originId, destinationId, weight)
    
            // Test Criteria
            expect(typeof result).toBe("number")
            expect(result).toBe(15000)
        })
  
        it("Should throw error if no shipping options available", async () => {
            // Test Data
            const originId = 1
            const destinationId = 2
    
            // Mock Third Service API
            mockedAxios.post.mockResolvedValue({data: { data: [] }} as any)
    
            // Exec Util + Test Criteria
            await expect(getShippingCost(originId, destinationId)).rejects.toEqual({
                code: 422,
                message: "Shipping cost unavailable for this route"
            })
        })
    })
})