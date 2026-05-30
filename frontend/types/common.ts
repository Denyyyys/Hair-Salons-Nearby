export type PaginatedResponse<T> = {
    items: T[];
    page: number;
    totalPages: number;
    totalItems: number;
};