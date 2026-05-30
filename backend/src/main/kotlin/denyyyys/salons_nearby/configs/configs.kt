package denyyyys.salons_nearby.configs

import denyyyys.salons_nearby.filters.JwtAuthenticationFilter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
class SecurityConfig(private val jwtAuthenticationFilter: JwtAuthenticationFilter) {
    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .cors { }
            .csrf { it.disable() }
            .authorizeHttpRequests {

                it.requestMatchers(
                    "/api/auth/login",
                    "/api/auth/register"
                ).permitAll()

                it.requestMatchers(
                    HttpMethod.GET,
                    "/api/salons/**"
                ).permitAll()

                it.requestMatchers(
                    HttpMethod.POST,
                    "/api/salons/**"
                ).hasRole("ADMIN")

                it.requestMatchers(
                    HttpMethod.PUT,
                    "/api/salons/**"
                ).hasRole("ADMIN")

                it.requestMatchers(
                    HttpMethod.DELETE,
                    "/api/salons/**"
                ).hasRole("ADMIN")

                it.anyRequest().authenticated()
            }
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter::class.java
            )

        return http.build()
    }

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val config = CorsConfiguration().apply {
            allowedOriginPatterns = listOf("*")
            allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
            allowedHeaders = listOf("*")
            allowCredentials = false
        }

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", config)
        return source
    }
}

@Configuration
class PasswordConfig {
    @Bean
    fun passwordEncoder(): PasswordEncoder =
        BCryptPasswordEncoder()
}