import axios from 'axios'
import { courierShippingDefault, weightGramsShippingDefault } from '../constants/business.const'

const RAJA_ONGKIR_BASE_URL = 'https://rajaongkir.komerce.id/api/v1'
const OPENCAGE_BASE_URL = 'https://api.opencagedata.com/geocode/v1/json'
const RAJA_ONGKIR_API_KEY = process.env.RAJA_ONGKIR_API_KEY!
const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY!

// Reverse geocode lat/long to city name using OpenCage
const getCityFromCoords = async (lat: number, long: number): Promise<string> => {
    // Exec the API
    const response = await axios.get(OPENCAGE_BASE_URL, {
        params: {
            q: `${lat}+${long}`,
            key: OPENCAGE_API_KEY,
            language: 'id',
            no_annotations: 1,
        }
    })

    const results = response.data.results
    if (!results || results.length === 0) throw { code: 422, message: 'Unable to resolve location from coordinates' }

    const components = results[0].components
    const city = components.city || components.town || components.village || components.county
    if (!city) throw { code: 422, message: 'Unable to determine city from coordinates' }

    return city as string
}

// Search destination id from Raja Ongkir V2 by city name
const getLocationId = async (cityName: string): Promise<number> => {
    // Exec the API
    const response = await axios.get(`${RAJA_ONGKIR_BASE_URL}/destination/domestic-destination`, {
        params: {
            search: cityName,
            limit: 5,
            offset: 0
        },
        headers: { key: RAJA_ONGKIR_API_KEY }
    })

    const data = response.data.data
    if (!data || data.length === 0) throw { code: 422, message: `City "${cityName}" not found` }

    return data[0].id
}

export const getCityIdFromCoords = async (lat: number, long: number): Promise<number> => {
    const cityName = await getCityFromCoords(lat, long)

    return await getLocationId(cityName)
}

// Calculate the shipping cost by origin, dest id, courier, and weight
export const getShippingCost = async (originId: number, destinationId: number, weightGrams: number = weightGramsShippingDefault, courier: string = courierShippingDefault): Promise<number> => {
    const params = new URLSearchParams()
    params.append('origin', String(originId))
    params.append('destination', String(destinationId))
    params.append('weight', String(weightGrams))
    params.append('courier', courier)
    params.append('price', 'lowest')

    // Exec the API
    const response = await axios.post(
        `${RAJA_ONGKIR_BASE_URL}/calculate/domestic-cost`,
        params,
        {
            headers: {
                key: RAJA_ONGKIR_API_KEY,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    )

    const results = response.data.data
    if (!results || results.length === 0) throw { code: 422, message: 'Shipping cost unavailable for this route' }

    // Pick the cheapest service
    const cheapest = results.reduce((min: any, service: any) => service.cost < min.cost ? service : min, results[0])

    return cheapest.cost
}