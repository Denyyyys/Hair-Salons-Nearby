package denyyyys.salons_nearby.extensions

import denyyyys.salons_nearby.dtos.SalonListItemDto
import denyyyys.salons_nearby.models.Salon

fun Salon.toListItemDto() = SalonListItemDto(
    booksyBusinessId = booksyBusinessId,
    name = name,
    address = address,
    district = district,
    rating = rating,
    reviewsCount = reviewsCount
)