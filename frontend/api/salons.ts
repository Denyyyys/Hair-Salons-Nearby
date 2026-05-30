import { API_BASE_URL } from "@/constants";
import axios from "axios";

import type {
    GetSalonsParams,
    SalonListItem,
    SalonDetails,
    Service
} from "@/types/salon";

import type {
    PaginatedResponse
} from "@/types/common";

export async function getSalons(params: GetSalonsParams = {}) {
    const { data } = await axios.get<PaginatedResponse<SalonListItem>>(
        `${API_BASE_URL}/api/salons`, { params });

    return data
}

export async function getSalonById(booksyBusinessId: number) {
    const { data } = await axios.get<SalonDetails>(
        `${API_BASE_URL}/api/salons/${booksyBusinessId}`
    );
    return data;
}

export async function tryEditSalon(
    booksyBusinessId: number,
    token: string,
    payload: {
        address: string;
        description: string;
        district: string;
        email: string | null;
        facebookLink: string | null;
        instagramLink: string | null;
        name: string;
        phone: string | null;
        services: Service[];
    }
) {
    return axios.put(`${API_BASE_URL}/api/salons/${booksyBusinessId}`, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}