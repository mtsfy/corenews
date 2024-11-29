import uuid
from datetime import datetime, timezone
from database import db


saved = db.Table('saved',
    db.Column('user_id', db.UUID(as_uuid=True), db.ForeignKey('user.id'), primary_key=True),
    db.Column('document_id', db.Integer, db.ForeignKey('document.id'), primary_key=True)
)

class User(db.Model):
    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    username = db.Column(db.Text, unique=True, nullable=False)
    name = db.Column(db.Text)
    email = db.Column(db.Text, unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    saved_documents = db.relationship('Document', secondary=saved, back_populates='saved_by')
    frequency = db.Column(db.String, nullable=True)
    topics = db.Column(db.ARRAY(db.String), nullable=True)
    sources = db.Column(db.ARRAY(db.String), nullable=True)
    regions = db.Column(db.ARRAY(db.String), nullable=True)

    def __repr__(self):
        return f'<User {self.username}>'
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "username": self.username,
            "name": self.name,
            "email": self.email,
            "frequency": self.frequency,
            "topics": self.topics,
            "sources": self.sources,
            "regions": self.regions,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }
    

class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text) 
    author = db.Column(db.Text, nullable=True)
    source = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text)
    content = db.Column(db.Text)
    url = db.Column(db.Text, unique=True, nullable=False)
    image = db.Column(db.Text)
    published_at = db.Column(db.DateTime)
    topics = db.Column(db.ARRAY(db.String), default=[], nullable=True)

    summary = db.relationship("Summary", uselist=False, back_populates="document")
    saved_by = db.relationship('User', secondary=saved, back_populates='saved_documents')

    def __repr__(self):
        return f'<Document {self.title}>'
    
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "source": self.source,
            "description": self.description,
            "content": self.content,
            "url": self.url,
            "image": self.image,
            "published_at": self.published_at.isoformat() if self.published_at else None,
            "topics": self.topics,
        }
    
class Summary(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'), nullable=False)
    document = db.relationship('Document', back_populates='summary')

    def __repr__(self):
        return f'<Summary {self.id}>'

    def to_dict(self): 
        return {
            "id": self.id,
            "content": self.content,
            "documet_id": self.document_id
        }