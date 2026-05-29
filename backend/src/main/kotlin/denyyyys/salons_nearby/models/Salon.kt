package denyyyys.salons_nearby.models

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.mapping.Field

@Document(collection = "salons")
data class Salon(
    @Id
    val id: String? = null,
    @Field("booksy_business_id")
    val booksyBusinessId: Long,
    val address: String,
    val description: String,
    val district: String,
    val email: String?,
    @Field("facebook_link")
    val facebookLink: String?,
    @Field("instagram_link")
    val instagramLink: String?,
    val name: String,
    val phone: String?,
    val rating: Double,
    @Field("reviews_count")
    val reviewsCount: Int,
    val services: List<Service> = emptyList()
)

data class Service(
    val name: String? = null,
    @Field("min_price")
    val minPrice: Int = 0,
    @Field("max_price")
    val maxPrice: Int = 0
)