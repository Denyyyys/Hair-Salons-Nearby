# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy
from typing import TypedDict

class ServiceDict(TypedDict):
    name: str
    min_price: float | None
    max_price: float | None

class SalonItem(scrapy.Item):
    booksy_business_id: int = scrapy.Field()
    name: str = scrapy.Field()
    description: str = scrapy.Field()
    address: str = scrapy.Field()
    district: str = scrapy.Field()
    phone: str = scrapy.Field()
    email: str = scrapy.Field()
    facebook_link: str = scrapy.Field()
    instagram_link: str = scrapy.Field()

    services: list[ServiceDict] = scrapy.Field()

    rating: float = scrapy.Field()
    reviews_count: int = scrapy.Field()