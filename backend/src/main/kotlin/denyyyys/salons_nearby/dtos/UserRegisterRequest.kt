package denyyyys.salons_nearby.dtos

data class UserRegisterRequest(
    val email: String,
    val username: String,
    val password: String
)