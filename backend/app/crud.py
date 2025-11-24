from sqlmodel import Session, select
from . import models
from .utils import hash_password

def create_user(session: Session, email: str, password: str, display_name: str = None):
    user = models.User(email=email, hashed_password=hash_password(password), display_name=display_name)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

def get_user_by_email(session: Session, email: str):
    stmt = select(models.User).where(models.User.email == email)
    return session.exec(stmt).first()

def create_dataset(session: Session, filename: str, uploader_id: int = None, rows: int = 0, original_name: str = None):
    ds = models.Dataset(filename=filename, uploader_id=uploader_id, rows=rows, original_name=original_name)
    session.add(ds)
    session.commit()
    session.refresh(ds)
    return ds

def list_datasets(session: Session, limit: int = 50):
    stmt = select(models.Dataset).order_by(models.Dataset.uploaded_at.desc()).limit(limit)
    return session.exec(stmt).all()
