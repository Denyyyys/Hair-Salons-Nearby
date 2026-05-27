# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class SalonsScraperItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    pass


class SalonItem(scrapy.Item):
    booksy_business_id = scrapy.Field()
    name = scrapy.Field()
    description = scrapy.Field()
    address = scrapy.Field()
    district = scrapy.Field()
    phone = scrapy.Field()
    email = scrapy.Field()
    facebook_link = scrapy.Field()
    instagram_link = scrapy.Field()
    # array where each element is dictionary with keys: name, min_price, max_price
    services = scrapy.Field()
    # reviews_rank in API
    rating = scrapy.Field()
    reviews_count = scrapy.Field()