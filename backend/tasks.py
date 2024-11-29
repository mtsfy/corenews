import json
import os
import time

from dotenv import load_dotenv
from models import Document, Summary
from app import app, db, queue

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support import expected_conditions as EC

from langchain_openai import ChatOpenAI
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.summarize import load_summarize_chain
from langchain_core.prompts import PromptTemplate
from langchain_core.documents import Document as LangDocument

load_dotenv()

os.environ['LANGCHAIN_TRACING_V2'] = 'true'

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
                    main_article = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "article__main"))) # currently only cnn
                    break
                except TimeoutException:
                    print("Retrying...")
                    time.sleep(5)
            else:
                print("Failed to fetch article content after retries.")
                return

            article_content = main_article.get_attribute('innerText')  
            paragraph = ' '.join(article_content.split())

            if not paragraph.strip():  
                print(f"Unable to fetch content from URL: {url}. Content is empty.")
                return 

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
        document = Document.query.filter_by(id=document_id).first()
        if document:
            content = document.content

            doc = LangDocument(page_content=content) # metadata={"title": document.title, "source": document.source}

            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=2000,
                chunk_overlap=200,
            )

            doc_splits = text_splitter.split_documents([doc])
            print(f"Summarizing: {document.title}")
            print("DOCS_SIZE: ", len(doc_splits))

            llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)

            map_template = """
            Summarize the following section of the document by capturing its main points and key details in 8 sentences or fewer. 
            Ensure the summary is concise, clear, and accurately reflects the content of the section without any extraneous information.

            Document Section: `{text}`

            Summary:
            """
            map_prompt = PromptTemplate.from_template(template=map_template)

            reduce_template = """
            Combine the section summaries into a single cohesive and informative summary of the document. 
            The final summary must include an introduction, main points, and a conclusion that captures the essence of the entire document. 
            Provide a generic title related to the document's topic at the start.

            Summaries: `{text}`
            """
            reduce_prompt = PromptTemplate.from_template(template=reduce_template)

            summary_chain = load_summarize_chain(
                llm=llm,
                chain_type="map_reduce",
                map_prompt=map_prompt,
                combine_prompt=reduce_prompt,
                output_key="summary"
            )

            response = summary_chain.invoke(doc_splits)
            summary = response["summary"]


            summary_obj = Summary(content=summary, document_id=document.id)
            db.session.add(summary_obj)

            topics_template = """
            Based on the following categories, identify the specific topics this summary belongs to. If the summary is relevant to multiple categories, include all applicable topics in the response:

            1. Business
            2. Entertainment
            3. General
            4. Health
            5. Science
            6. Sports
            7. Technology
            8. Politics
            9. Environment

            Summary: `{summary}`

            Return the result in JSON format as follows:
            - "topics": [List of relevant topics]
            """
            
            topics_prompt = PromptTemplate.from_template(template=topics_template)
            topics_chain = topics_prompt | llm

            response = topics_chain.invoke({"summary": summary})
            response = json.loads(response.content)

            document.topics = response["topics"]
            db.session.commit()

            print(response["topics"])
            print(f"Document {document_id} summarized.")

            return
        else:
            print(f"Document {document_id} not found.")
            return