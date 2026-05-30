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

export type Service = {
    name: string | null;
    minPrice: number;
    maxPrice: number;
};

export type SalonDetails = {
    booksyBusinessId: number;
    address: string;
    description: string;
    district: string;
    email: string | null;
    facebookLink: string | null;
    instagramLink: string | null;
    name: string;
    phone: string | null;
    rating: number;
    reviewsCount: number;
    minPrice: number | null;
    maxPrice: number | null;
    services: Service[];
};
