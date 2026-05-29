package denyyyys.salons_nearby.dtos

data class PaginatedResponse<T>(
    val items: List<T>,
    val page: Int,
    val totalPages: Int,
    val totalItems: Long
)