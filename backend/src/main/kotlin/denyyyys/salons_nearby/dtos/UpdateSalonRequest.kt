package denyyyys.salons_nearby.dtos

import denyyyys.salons_nearby.models.Service

data class UpdateSalonRequest(
    val address: String,
    val description: String,
    val district: String,
    val email: String?,
    val facebookLink: String?,
    val instagramLink: String?,
    val name: String,
    val phone: String?,
    val services: List<Service>
)