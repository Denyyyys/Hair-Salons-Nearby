package denyyyys.salons_nearby.repositories

import denyyyys.salons_nearby.models.Salon
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Criteria
import org.springframework.data.mongodb.core.query.Query
import org.springframework.stereotype.Repository

@Repository
class SalonRepositoryImpl(
    private val mongoTemplate: MongoTemplate
) : SalonRepositoryCustom {
    override fun searchSalons(
        name: String?,
        district: String?,
        serviceType: String?,
        pageable: Pageable
    ): Page<Salon> {
        val criteria = mutableListOf<Criteria>()

        if (!name.isNullOrBlank()) {
            criteria.add(Criteria.where("name").regex(name, "i"))
        }
        if (!district.isNullOrBlank()) {
            criteria.add(Criteria.where("district").regex(district, "i"))
        }
        if (!serviceType.isNullOrBlank()) {
            criteria.add(Criteria.where("services.name").regex(serviceType, "i"))
        }

        val query = Query()
        if (criteria.isNotEmpty()) {
            query.addCriteria(Criteria().andOperator(*criteria.toTypedArray()))
        }

        val total = mongoTemplate.count(query, Salon::class.java)
        val items = mongoTemplate.find(query.with(pageable), Salon::class.java)

        return PageImpl(items, pageable, total)
    }
}
