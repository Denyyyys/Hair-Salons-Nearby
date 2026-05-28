import os

from pymongo import MongoClient
from dotenv import load_dotenv
from pathlib import Path
from pymongo.errors import ServerSelectionTimeoutError

load_dotenv(
    Path(__file__).resolve().parents[3] / ".env"
)

class MongoPipeline:
    def __init__(self):
        mongo_user = os.getenv("MONGO_INITDB_ROOT_USERNAME")
        mongo_password = os.getenv("MONGO_INITDB_ROOT_PASSWORD")
        mongo_port = os.getenv("MONGO_PORT", "27017")
        mongo_uri = (f"mongodb://{mongo_user}:{mongo_password}@localhost:{mongo_port}")

        try:
            self.client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
            self.client.admin.command("ping")
        except ServerSelectionTimeoutError as e:
            raise RuntimeError(f"Could not connect to MongoDB: {e}")

        self.db = self.client["salons"]
        self.collection = self.db["salons"]
        self.collection.create_index("booksy_business_id", unique=True)


    def process_item(self, item, spider):
        print("ITEM IS BEING PROCESSED")
        item_dict = dict(item)

        self.collection.update_one(
            {
                "booksy_business_id":
                    item_dict[
                        "booksy_business_id"
                    ]
            },
            {
                "$set": item_dict
            },
            upsert=True
        )

        return item

    def close_spider(self, spider):
        self.client.close()

