package denyyyys.salons_nearby.models

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document("users")
data class User(
    @Id
    val id: String? = null,
    val email: String,
    val username: String,
    val password: String,
    val role: Role
)

enum class Role {
    USER,
    ADMIN
}