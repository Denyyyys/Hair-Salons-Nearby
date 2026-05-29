package denyyyys.salons_nearby.repositories

import denyyyys.salons_nearby.models.Salon
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.mongodb.repository.MongoRepository

interface SalonRepository: MongoRepository<Salon, String> {
    fun findByBooksyBusinessId(booksyBusinessId: Long): Salon?

    fun findByNameContainingIgnoreCase(name: String, pageable: Pageable): Page<Salon>
}