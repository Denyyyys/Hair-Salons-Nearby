package denyyyys.salons_nearby.controllers

import denyyyys.salons_nearby.constants.DEFAULT_PAGE_SIZE
import denyyyys.salons_nearby.dtos.PaginatedResponse
import denyyyys.salons_nearby.dtos.SalonDetailsDto
import denyyyys.salons_nearby.dtos.SalonListItemDto
import denyyyys.salons_nearby.extensions.toDetailsDto
import denyyyys.salons_nearby.extensions.toListItemDto
import denyyyys.salons_nearby.models.Salon
import denyyyys.salons_nearby.repositories.SalonRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/salons")
class SalonController(private val salonRepository: SalonRepository) {

    @GetMapping
    fun getAllSalons(@RequestParam(defaultValue = "1") page: Int): PaginatedResponse<SalonListItemDto> {
        val result = salonRepository.findAll(PageRequest.of(page - 1, DEFAULT_PAGE_SIZE))

        return PaginatedResponse(
            items = result.content.map { it.toListItemDto() },
            page = page,
            totalPages = result.totalPages,
            totalItems = result.totalElements
        )
    }

    @GetMapping("/{booksyBusinessId}")
    fun getSalonByBooksyBusinessId(@PathVariable booksyBusinessId: Long): ResponseEntity<SalonDetailsDto> {
        val salon = salonRepository.findByBooksyBusinessId(booksyBusinessId)
        if (salon != null) {
            return ResponseEntity.ok(salon.toDetailsDto())
        }
        return ResponseEntity.notFound().build()
    }
}