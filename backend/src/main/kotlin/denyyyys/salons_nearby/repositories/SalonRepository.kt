package denyyyys.salons_nearby.repositories

import denyyyys.salons_nearby.models.Salon
import org.springframework.data.mongodb.repository.MongoRepository

interface SalonRepository: MongoRepository<Salon, String> {
    fun findByBooksyBusinessId(booksyBusinessId: Long): Salon?
}