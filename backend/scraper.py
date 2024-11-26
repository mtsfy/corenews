import json
from newsapi import NewsApiClient
import datetime
import os

from models import Document
from database import db
from app import queue, app

from newsapi.newsapi_exception import NewsAPIException

newsapi = NewsApiClient(api_key=os.getenv("NEWSAPI_API_KEY"))

def main(source, month, day):
    start_date = datetime.date(2024, month, day)
    end_date = datetime.date(2024, month, day)

    try:
        articles = newsapi.get_everything(
                                        sources=source,
                                        language='en',
                                        from_param=start_date.isoformat(),
                                        to=end_date.isoformat(),
                                        sort_by='publishedAt',
                                        page_size=100)
        articles = articles["articles"]
        
        for article in articles:
            process_article(article)

        save_articles(source, articles, day, month)

        print(f"({month}/{day}): Retrieved {len(articles)} articles")

    except NewsAPIException as e:
        print(f"API Error: {e}")


def process_article(article):
    with app.app_context():
        title = article["title"]
        author = article["author"]
        source = article["source"]["id"] 
        description = article["description"] 
        content = ""
        url = article["url"]
        topics = []
        image = article["urlToImage"]
        published_at = article["publishedAt"]

        existing_document = Document.query.filter_by(url=url).first()

        if not existing_document:
            new_document = Document(
                title=title,
                author=author,
                source=source,
                description=description,
                content=content,
                url=url,
                image=image,
                published_at=published_at,
                topics=topics
            )
            
            db.session.add(new_document)
            db.session.commit()

            job = queue.enqueue("tasks.fetch_document", new_document.id)


def save_articles(source, articles, day, month):
    os.makedirs(f'./misc/{source}', exist_ok=True)
    file_path = f'./misc/{source}/{month}_{str(day).zfill(2)}.json'
    with open(file_path, 'w') as f:
        json.dump(articles, f, indent=4)
    


if __name__ == "__main__":
    source = "cnn"
    month = 11
    day = 2
    
    main(source, month, day)
