package denyyyys.salons_nearby.dtos

data class SalonListItemDto(
    val booksyBusinessId: Long,
    val name: String,
    val address: String,
    val district: String,
    val rating: Double,
    val reviewsCount: Int
)