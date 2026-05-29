package denyyyys.salons_nearby.extensions

import denyyyys.salons_nearby.dtos.SalonDetailsDto
import denyyyys.salons_nearby.dtos.SalonListItemDto
import denyyyys.salons_nearby.models.Salon

fun Salon.toListItemDto() = SalonListItemDto(
    booksyBusinessId = booksyBusinessId,
    name = name,
    address = address,
    district = district,
    rating = rating,
    reviewsCount = reviewsCount,
    minPrice = getMinPrice(),
    maxPrice = getMaxPrice()
)

fun Salon.toDetailsDto() = SalonDetailsDto(
    booksyBusinessId = booksyBusinessId,
    address = address,
    description = description,
    district = district,
    email = email,
    facebookLink = facebookLink,
    instagramLink = instagramLink,
    name = name,
    phone = phone,
    rating = rating,
    reviewsCount = reviewsCount,
    minPrice = getMinPrice(),
    maxPrice = getMaxPrice(),
    services = services
)

fun Salon.getMinPrice(): Int? =
    services.minOfOrNull { it.minPrice }

fun Salon.getMaxPrice(): Int? =
    services.maxOfOrNull { it.maxPrice }