import { API_BASE_URL } from "@/constants";
import axios from "axios";

import type {
    GetSalonsParams,
    SalonListItem,
} from "@/types/salon";

import type {
    PaginatedResponse
} from "@/types/common";

export async function getSalons(params: GetSalonsParams = {}) {
    const { data } = await axios.get<PaginatedResponse<SalonListItem>>(
        `${API_BASE_URL}/api/salons`, { params });

    return data
}