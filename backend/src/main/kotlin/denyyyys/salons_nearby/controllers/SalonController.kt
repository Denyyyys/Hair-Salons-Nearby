package denyyyys.salons_nearby.controllers

import denyyyys.salons_nearby.models.Salon
import denyyyys.salons_nearby.repositories.SalonRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/salons")
class SalonController(private val salonRepository: SalonRepository) {

    @GetMapping
    fun getAllSalons(): List<Salon> {
        return salonRepository.findAll()
    }

    @GetMapping("/{booksyBusinessId}")
    fun getSalonByBooksyBusinessId(@PathVariable booksyBusinessId: Long): ResponseEntity<Salon> {
        val salon = salonRepository.findByBooksyBusinessId(booksyBusinessId)
        if (salon != null) {
            return ResponseEntity.ok(salon)
        }

        return ResponseEntity.notFound().build()
    }
}