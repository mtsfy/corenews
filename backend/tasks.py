import time
from models import Document, Summary
from app import app, db, queue

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support import expected_conditions as EC


def fetch_document(document_id):
    with app.app_context():
        document = Document.query.filter_by(id=document_id).first()

        url = document.url

        firefox_options = Options()
        firefox_options.add_argument("--headless") 

        service = Service('/opt/homebrew/bin/geckodriver')
        driver = webdriver.Firefox(service=service, options=firefox_options)

        try:
            if not url:
                print("No url provided.")
                return
            

            if "live-news" in url:
                print(f"Skipping live news article: {url}")
                db.session.delete(document) 
                db.session.commit()  
                return  

            print(f"Fetching URL: {url}")

            driver.get(url)

            wait = WebDriverWait(driver, 20)

            for _ in range(3):
                try:
                    main_article = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "article__main")))
                    break
                except TimeoutException:
                    print("Retrying...")
                    time.sleep(5)
            else:
                print("Failed to fetch article content after retries.")
                return

            article_content = main_article.get_attribute('innerText')  
            paragraph = ' '.join(article_content.split())

            if not paragraph.strip():  # If the content is empty or only whitespace
                print(f"Unable to fetch content from URL: {url}. Content is empty.")
                return  # Skip processing

            print(paragraph)
            
            document.content = paragraph
            db.session.commit()

            job = queue.enqueue("tasks.summarize_document", document.id)

        except Exception as e:
            print(f"An error occurred: {e}")
        finally:
            driver.quit()


def summarize_document(document_id):
    with app.app_context(): 
        document = Document.query.get(document_id)

        if document:
            summary_content = f"This is a summary for document ID {document_id}"
            summary = Summary(content=summary_content, document_id=document.id)

            db.session.add(summary)
            db.session.commit()
            print(f"Document {document_id} summarized.")

            return summary_content
        else:
            print(f"Document {document_id} not found.")
            return None