
from sqlalchemy.exc import SQLAlchemyError

from app.database import SessionLocal
from app.models import WebsiteCategory


DEFAULT_WEBSITES = [
    {
        "domain": "chatgpt.com",
        "website_name": "ChatGPT",
        "category": "AI Tools",
        "productivity": "Productive",
    },
    {
        "domain": "openai.com",
        "website_name": "OpenAI",
        "category": "AI Tools",
        "productivity": "Productive",
    },
    {
        "domain": "github.com",
        "website_name": "GitHub",
        "category": "Development",
        "productivity": "Productive",
    },
    {
        "domain": "stackoverflow.com",
        "website_name": "Stack Overflow",
        "category": "Development",
        "productivity": "Productive",
    },
    {
        "domain": "docs.python.org",
        "website_name": "Python Docs",
        "category": "Documentation",
        "productivity": "Productive",
    },
    {
        "domain": "developer.mozilla.org",
        "website_name": "MDN Docs",
        "category": "Documentation",
        "productivity": "Productive",
    },
    {
        "domain": "colab.google.com",
        "website_name": "Google Colab",
        "category": "Development",
        "productivity": "Productive",
    },
    {
        "domain": "kaggle.com",
        "website_name": "Kaggle",
        "category": "Learning",
        "productivity": "Productive",
    },
    {
        "domain": "gmail.com",
        "website_name": "Gmail",
        "category": "Communication",
        "productivity": "Productive",
    },
    {
        "domain": "linkedin.com",
        "website_name": "LinkedIn",
        "category": "Professional Networking",
        "productivity": "Productive",
    },
    {
        "domain": "youtube.com",
        "website_name": "YouTube",
        "category": "Entertainment",
        "productivity": "Non Productive",
    },
    {
        "domain": "instagram.com",
        "website_name": "Instagram",
        "category": "Social Media",
        "productivity": "Non Productive",
    },
    {
        "domain": "facebook.com",
        "website_name": "Facebook",
        "category": "Social Media",
        "productivity": "Non Productive",
    },
    {
        "domain": "x.com",
        "website_name": "X",
        "category": "Social Media",
        "productivity": "Non Productive",
    },
]


def seed_website_categories():
    db = SessionLocal()

    try:
        existing_domains = {
            domain
            for (domain,) in db.query(
                WebsiteCategory.domain
            ).all()
        }

        missing_websites = [
            WebsiteCategory(**website)
            for website in DEFAULT_WEBSITES
            if website["domain"] not in existing_domains
        ]

        if missing_websites:
            db.add_all(missing_websites)
            db.commit()

        print(
            "Website category seeding complete. "
            f"Added {len(missing_websites)} missing records."
        )

    except SQLAlchemyError:
        db.rollback()
        raise

    finally:
        db.close()
