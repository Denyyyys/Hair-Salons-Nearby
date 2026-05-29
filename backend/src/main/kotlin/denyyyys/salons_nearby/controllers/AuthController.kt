package denyyyys.salons_nearby.controllers

import denyyyys.salons_nearby.dtos.AuthResponse
import denyyyys.salons_nearby.dtos.ErrorResponse
import denyyyys.salons_nearby.dtos.UserLoginRequest
import denyyyys.salons_nearby.dtos.UserRegisterRequest
import denyyyys.salons_nearby.models.Role
import denyyyys.salons_nearby.models.User
import denyyyys.salons_nearby.repositories.UserRepository
import denyyyys.salons_nearby.services.JwtService
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService
) {
    @PostMapping("/register")
    fun register(@RequestBody request: UserRegisterRequest): ResponseEntity<Any> {
        if (userRepository.existsByUsername(request.username) || userRepository.existsByEmail(request.email)) {
            return ResponseEntity.badRequest().body(ErrorResponse("Email already exists"))
        }

        val user = userRepository.save(
            User(
                email = request.email,
                username = request.username,
                password = passwordEncoder.encode(request.password)!!,
                role = Role.USER
            )
        )

        return ResponseEntity.ok(
            AuthResponse(
                jwtService.generateToken(user)
            )
        )

    }

    @PostMapping("/login")
    fun login(@RequestBody request: UserLoginRequest): ResponseEntity<Any> {
        val user = userRepository.findByUsername(request.username)  ?: return ResponseEntity.badRequest().body(ErrorResponse("Invalid credentials"))

        if (!passwordEncoder.matches(request.password, user.password)) {
            return ResponseEntity.badRequest().body(ErrorResponse("Invalid credentials"))
        }

        return ResponseEntity.ok(AuthResponse(jwtService.generateToken(user)))
    }
}