import scrapy
import json
from ..items import SalonItem, ServiceDict
from typing import List

class BooksyWarsawSpider(scrapy.Spider):
    name = "booksy_warsaw"
    allowed_domains = ["pl.booksy.com", "booksy.com"]

    DEFAULT_START_PAGE = 1
    DEFAULT_END_PAGE = 2
    BASE_URL = (
        "https://booksy.com/pl-pl/s/3_warszawa"
    )

    def __init__(
        self,
        x_access_token=None,
        x_api_key=None,
        start_page=DEFAULT_START_PAGE,
        end_page=DEFAULT_END_PAGE
    ):
        super().__init__()

        if not x_access_token:
            raise ValueError("x_access_token is required")

        if not x_api_key:
            raise ValueError("x_api_key is required")
        
        self.x_access_token = x_access_token
        self.x_api_key = x_api_key
        self.start_page = int(start_page)
        self.end_page = int(end_page)

        self.api_headers = {
            "x-access-token": self.x_access_token,
            "x-api-key": self.x_api_key,
        }
        
    async def start(self):
        for page in range(self.start_page, self.end_page + 1):
            url = (
                f"{self.BASE_URL}"
                f"?businessesPage={page}"
            )

            yield scrapy.Request(
                url=url,
                callback=self.parse
            )


    def parse(self, response):
        salons = response.css("#search-results > ul li")

        for salon in salons:
            business_id = salon.css("div::attr(data-business-id)").get()
            api_url = (f"https://pl.booksy.com/core/v2/customer_api/businesses/{business_id}/")

            yield scrapy.Request(
                url=api_url,
                headers=self.api_headers,
                callback=self.parse_business
            )


    def parse_business(self, response):
        data = json.loads(response.text)

        business = data["business"]

        district = None
        for region in business["regions"]:
            if region["type"] == "neighborhood":
                district = region["name"]
                break
        
        services: List[ServiceDict] = []
        
        for service_category in business["service_categories"]:
            for service in service_category["services"]:

                variants = service.get("variants", [])

                min_price = None
                max_price = None
                for variant in variants:
                    prices_to_check = []

                    regular_price = variant.get("price")
                    if regular_price is not None:
                        prices_to_check.append(regular_price)

                    promotion = variant.get("promotion") or {}
                    promotion_price = (promotion.get("price") or {}).get("price")
                    
                    if promotion_price is not None:
                        prices_to_check.append(promotion_price)

                    for price in prices_to_check:
                        if min_price is None or price < min_price:
                            min_price = price

                        if max_price is None or price > max_price:
                            max_price = price

                service_dict: ServiceDict = {
                    "name": (service.get("treatment") or {}).get("name"),
                    "min_price": min_price,
                    "max_price": max_price,
                }

                services.append(service_dict)

        salonItem = SalonItem(
            booksy_business_id=int(business.get("id")),
            name=business.get("name"),
            description=business.get("description"),
            address=business.get("location", {}).get("address"),
            district=district,
            phone=business.get("phone"),
            email=business.get("public_email"),
            facebook_link=business.get("facebook_link"),
            instagram_link=business.get("instagram_link"),
            services=services,
            rating=business.get("reviews_rank"),
            reviews_count=business.get("reviews_count"),
        )
        
        yield salonItem
