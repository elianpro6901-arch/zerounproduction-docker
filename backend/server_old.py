from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from pathlib import Path
import logging
from typing import List
from datetime import timedelta

from models import (
    Event, EventCreate, EventUpdate,
    SiteContent, SiteContentUpdate,
    AdminLogin, Token
)
from auth import (
    verify_password, create_access_token, verify_token,
    ACCESS_TOKEN_EXPIRE_HOURS
)
from database import (
    events_collection, site_content_collection, admin_users_collection,
    init_db, close_db
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app without a prefix
app = FastAPI(title="Breakdance Crew API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== EVENTS ROUTES ====================

@api_router.get("/events", response_model=List[Event])
async def get_events():
    """Get all events."""
    events = await events_collection.find().sort("createdAt", -1).to_list(1000)
    return [Event(**{**event, "id": str(event["_id"])}) for event in events]

@api_router.post("/events", response_model=Event)
async def create_event(event: EventCreate, token_data: dict = Depends(verify_token)):
    """Create a new event (Admin only)."""
    event_obj = Event(**event.dict())
    event_dict = event_obj.dict()
    event_dict["_id"] = event_dict["id"]
    del event_dict["id"]
    
    await events_collection.insert_one(event_dict)
    return event_obj

@api_router.put("/events/{event_id}", response_model=Event)
async def update_event(
    event_id: str,
    event: EventUpdate,
    token_data: dict = Depends(verify_token)
):
    """Update an event (Admin only)."""
    existing = await events_collection.find_one({"_id": event_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Event not found")
    
    update_data = event.dict(exclude_unset=True)
    await events_collection.update_one({"_id": event_id}, {"$set": update_data})
    
    updated = await events_collection.find_one({"_id": event_id})
    return Event(**{**updated, "id": str(updated["_id"])})

@api_router.delete("/events/{event_id}")
async def delete_event(event_id: str, token_data: dict = Depends(verify_token)):
    """Delete an event (Admin only)."""
    result = await events_collection.delete_one({"_id": event_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Événement supprimé avec succès"}

# ==================== SITE CONTENT ROUTES ====================

@api_router.get("/site-content", response_model=SiteContent)
async def get_site_content():
    """Get site content."""
    content = await site_content_collection.find_one({"_id": "site_content_singleton"})
    if not content:
        raise HTTPException(status_code=404, detail="Site content not found")
    return SiteContent(**{**content, "id": content["_id"]})

@api_router.put("/site-content", response_model=SiteContent)
async def update_site_content(
    content: SiteContentUpdate,
    token_data: dict = Depends(verify_token)
):
    """Update site content (Admin only)."""
    update_data = content.dict(exclude_unset=True)
    await site_content_collection.update_one(
        {"_id": "site_content_singleton"},
        {"$set": update_data}
    )
    
    updated = await site_content_collection.find_one({"_id": "site_content_singleton"})
    return SiteContent(**{**updated, "id": updated["_id"]})

# ==================== ADMIN AUTH ROUTES ====================

@api_router.post("/admin/login", response_model=Token)
async def admin_login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Admin login endpoint."""
    admin = await admin_users_collection.find_one({"username": form_data.username})
    if not admin or not verify_password(form_data.password, admin["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    access_token = create_access_token(
        data={"sub": admin["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.get("/admin/verify")
async def verify_admin(token_data: dict = Depends(verify_token)):
    """Verify admin token."""
    return token_data

# ==================== STARTUP/SHUTDOWN EVENTS ====================

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup."""
    await init_db()
    logger.info("Database initialized")

@app.on_event("shutdown")
async def shutdown_event():
    """Close database connection on shutdown."""
    await close_db()
    logger.info("Database connection closed")

# Include the router in the main app
app.include_router(api_router)

# Health check
@api_router.get("/")
async def root():
    return {"message": "Breakdance Crew API is running"}