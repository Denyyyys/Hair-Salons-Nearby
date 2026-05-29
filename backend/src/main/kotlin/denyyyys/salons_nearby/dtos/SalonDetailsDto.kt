package denyyyys.salons_nearby.dtos

import denyyyys.salons_nearby.models.Service

data class SalonDetailsDto(
    val booksyBusinessId: Long,
    val address: String,
    val description: String,
    val district: String,
    val email: String?,
    val facebookLink: String?,
    val instagramLink: String?,
    val name: String,
    val phone: String?,
    val rating: Double,
    val reviewsCount: Int,
    val minPrice: Int?,
    val maxPrice: Int?,
    val services: List<Service>
)