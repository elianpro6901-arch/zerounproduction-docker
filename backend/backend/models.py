from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

# Event Models
class EventBase(BaseModel):
    title: str
    date: str
    location: str
    description: str
    imageUrl: str
    featured: bool = False

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str] = None
    date: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    imageUrl: Optional[str] = None
    featured: Optional[bool] = None

class Event(EventBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "title": "Battle des Élèves",
                "date": "12 Déc 2025",
                "location": "Salle de l'Alagnier",
                "description": "Breaking 3vs3 Junior & All Style 1vs1",
                "imageUrl": "https://...",
                "featured": True,
                "createdAt": "2025-01-10T10:00:00"
            }
        }

# Site Content Models
class Feature(BaseModel):
    title: str
    description: str
    icon: str

class SiteContent(BaseModel):
    id: str = "site_content_singleton"
    heroTitle: str
    heroSubtitle: str
    heroPrimaryCTA: str
    heroSecondaryCTA: str
    communityTitle: str
    communityDescription: str
    communityCTA: str
    features: List[Feature]

class SiteContentUpdate(BaseModel):
    heroTitle: Optional[str] = None
    heroSubtitle: Optional[str] = None
    heroPrimaryCTA: Optional[str] = None
    heroSecondaryCTA: Optional[str] = None
    communityTitle: Optional[str] = None
    communityDescription: Optional[str] = None
    communityCTA: Optional[str] = None
    features: Optional[List[Feature]] = None
    aboutTitle: Optional[str] = None
    aboutDescription: Optional[str] = None
    contactEmail: Optional[str] = None
    contactPhone: Optional[str] = None
    contactAddress: Optional[str] = None
    footerTagline: Optional[str] = None

# Admin Models
class AdminUser(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    hashed_password: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)

class AdminLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    username: str | None = None

# Team Member Models
class TeamMemberBase(BaseModel):
    name: str
    role: str
    bio: Optional[str] = None
    imageUrl: str

class TeamMemberCreate(TeamMemberBase):
    pass

class TeamMemberUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    bio: Optional[str] = None
    imageUrl: Optional[str] = None

class TeamMember(TeamMemberBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=datetime.utcnow)

# Gallery Models
class GalleryItemBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    imageUrl: str

class GalleryItemCreate(GalleryItemBase):
    pass

class GalleryItemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    imageUrl: Optional[str] = None

class GalleryItem(GalleryItemBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=datetime.utcnow)

# Video Models
class VideoBase(BaseModel):
    title: str
    description: Optional[str] = None
    videoUrl: str
    thumbnailUrl: Optional[str] = None

class VideoCreate(VideoBase):
    pass

class VideoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    videoUrl: Optional[str] = None
    thumbnailUrl: Optional[str] = None

class Video(VideoBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=datetime.utcnow)

# Admin Update Models
class AdminUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None

class PasswordChange(BaseModel):
    old_password: str
    new_password: str
