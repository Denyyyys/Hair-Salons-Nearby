export type SalonListItem = {
    booksyBusinessId: number;
    name: string;
    address: string;
    district: string;
    rating: number;
    reviewsCount: number;
    minPrice: number | null;
    maxPrice: number | null;
};

export type GetSalonsParams = {
    page?: number;
    name?: string;
    district?: string;
    serviceType?: string;
};