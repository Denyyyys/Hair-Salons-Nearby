package denyyyys.salons_nearby.configs

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain

@Bean
fun passwordEncoder() = BCryptPasswordEncoder()

@Configuration
class SecurityConfig {
    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
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

        return http.build()
    }
}

@Configuration
class PasswordConfig {
    @Bean
    fun passwordEncoder(): PasswordEncoder =
        BCryptPasswordEncoder()
}