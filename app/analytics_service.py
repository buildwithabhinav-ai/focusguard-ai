from urllib.parse import urlparse

from sqlalchemy.orm import Session

from app.models import WebsiteCategory


def get_website_information(

    db: Session,

    url: str

):

    try:

        domain = urlparse(url).netloc.lower()

        domain = domain.replace("www.", "")

        website = db.query(

            WebsiteCategory

        ).filter(

            WebsiteCategory.domain == domain

        ).first()

        if website:

            return {

                "website_name": website.website_name,

                "category": website.category,

                "productivity": website.productivity

            }

        return {

            "website_name": domain,

            "category": "Other",

            "productivity": "Unknown"

        }

    except Exception:

        return {

            "website_name": "Unknown",

            "category": "Other",

            "productivity": "Unknown"

        }