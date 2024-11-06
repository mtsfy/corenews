
from datetime import datetime, timezone
from db import db


saved = db.Table('saved',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('document_id', db.Integer, db.ForeignKey('document.id'), primary_key=True)
)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text, unique=True, nullable=False)
    name = db.Column(db.Text)
    email = db.Column(db.Text, unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    saved_documents = db.relationship('Document', secondary=saved, back_populates='saved_by')


    def __repr__(self):
        return f'<User {self.username}>'
    

class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text) 
    source = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text)
    content = db.Column(db.Text)
    url = db.Column(db.Text, unique=True, nullable=False)
    image = db.Column(db.Text)
    published_at = db.Column(db.DateTime)
    summary = db.relationship("Summary", uselist=False, back_populates="document")
    saved_by = db.relationship('User', secondary=saved, back_populates='saved_documents')

    def __repr__(self):
        return f'<Document {self.title}>'
    
class Summary(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)

    document_id = db.Column(db.Integer, db.ForeignKey('document.id'), nullable=False)
    document = db.relationship('Document', back_populates='summary')

    def __repr__(self):
        return f'<Summary {self.id}>'