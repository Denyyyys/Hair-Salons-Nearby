package denyyyys.salons_nearby.services

import denyyyys.salons_nearby.models.User
import io.jsonwebtoken.Jwts
import org.springframework.stereotype.Service
import io.jsonwebtoken.security.Keys
import java.util.Date

@Service
class JwtService {
    private val secret: String? = System.getenv("JWT_SECRET")

    fun generateToken(user: User): String {
        if (secret == null) {
            throw RuntimeException("JWT Secret cannot null");
        }

        val now = Date()
        val expiration = Date(
            now.time + 24 * 60 * 60 * 1000
        )
        return Jwts.builder()
            .subject(user.username)
            .claim("email", user.email)
            .claim("role", user.role.name)
            .issuedAt(now)
            .expiration(expiration)
            .signWith(Keys.hmacShaKeyFor(secret.toByteArray()))
            .compact()
    }

    fun extractUsername(token: String): String {
        if (secret == null) {
            throw RuntimeException("JWT Secret cannot null");
        }

        return Jwts.parser()
            .verifyWith(Keys.hmacShaKeyFor(secret.toByteArray()))
            .build()
            .parseSignedClaims(token)
            .payload
            .subject
    }

    fun extractRole(token: String): String {
        if (secret == null) {
            throw RuntimeException("JWT Secret cannot null");
        }

        return Jwts.parser()
            .verifyWith(Keys.hmacShaKeyFor(secret.toByteArray()))
            .build()
            .parseSignedClaims(token)
            .payload["role"] as String
    }

    fun validateToken(token: String): Boolean {
        if (secret == null) {
            throw RuntimeException("JWT Secret cannot null");
        }

        try {
            Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(secret.toByteArray()))
                .build()
                .parseSignedClaims(token)

            return true
        } catch (e: Exception) {
            return false
        }
    }
}