from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, WebSocket
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from pathlib import Path
import logging
from typing import List
from datetime import timedelta
import json
import zipfile
import io
import os

from models import (
    Event, EventCreate, EventUpdate,
    SiteContent, SiteContentUpdate,
    TeamMember, TeamMemberCreate, TeamMemberUpdate,
    GalleryItem, GalleryItemCreate, GalleryItemUpdate,
    Video, VideoCreate, VideoUpdate,
    AdminLogin, Token, AdminUpdate, PasswordChange
)
from auth import (
    verify_password, create_access_token, verify_token,
    ACCESS_TOKEN_EXPIRE_HOURS, get_password_hash
)
from email_service import send_reset_email
import secrets
from database import (
    events_collection, site_content_collection, admin_users_collection,
    team_members_collection, gallery_items_collection, videos_collection,
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
    await broadcast_update("events")
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
    await broadcast_update("events")
    return Event(**{**updated, "id": str(updated["_id"])})

@api_router.delete("/events/{event_id}")
async def delete_event(event_id: str, token_data: dict = Depends(verify_token)):
    """Delete an event (Admin only)."""
    result = await events_collection.delete_one({"_id": event_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    await broadcast_update("events")
    return {"message": "Événement supprimé avec succès"}

# ==================== TEAM ROUTES ====================

@api_router.get("/team", response_model=List[TeamMember])
async def get_team():
    """Get all team members."""
    members = await team_members_collection.find().sort("createdAt", -1).to_list(1000)
    return [TeamMember(**{**member, "id": str(member["_id"])}) for member in members]

@api_router.post("/team", response_model=TeamMember)
async def create_team_member(member: TeamMemberCreate, token_data: dict = Depends(verify_token)):
    """Create a new team member (Admin only)."""
    member_obj = TeamMember(**member.dict())
    member_dict = member_obj.dict()
    member_dict["_id"] = member_dict["id"]
    del member_dict["id"]
    
    await team_members_collection.insert_one(member_dict)
    await broadcast_update("team")
    return member_obj

@api_router.put("/team/{member_id}", response_model=TeamMember)
async def update_team_member(
    member_id: str,
    member: TeamMemberUpdate,
    token_data: dict = Depends(verify_token)
):
    """Update a team member (Admin only)."""
    existing = await team_members_collection.find_one({"_id": member_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Team member not found")
    
    update_data = member.dict(exclude_unset=True)
    await team_members_collection.update_one({"_id": member_id}, {"$set": update_data})
    await broadcast_update("team")
    
    updated = await team_members_collection.find_one({"_id": member_id})
    return TeamMember(**{**updated, "id": str(updated["_id"])})

@api_router.delete("/team/{member_id}")
async def delete_team_member(member_id: str, token_data: dict = Depends(verify_token)):
    """Delete a team member (Admin only)."""
    result = await team_members_collection.delete_one({"_id": member_id})
    await broadcast_update("team")
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Team member not found")
    return {"message": "Membre supprimé avec succès"}

# ==================== GALLERY ROUTES ====================

@api_router.get("/gallery", response_model=List[GalleryItem])
async def get_gallery():
    """Get all gallery items."""
    items = await gallery_items_collection.find().sort("createdAt", -1).to_list(1000)
    return [GalleryItem(**{**item, "id": str(item["_id"])}) for item in items]

@api_router.post("/gallery", response_model=GalleryItem)
async def create_gallery_item(item: GalleryItemCreate, token_data: dict = Depends(verify_token)):
    """Create a new gallery item (Admin only)."""
    item_obj = GalleryItem(**item.dict())
    item_dict = item_obj.dict()
    item_dict["_id"] = item_dict["id"]
    del item_dict["id"]
    
    await gallery_items_collection.insert_one(item_dict)
    await broadcast_update("gallery")
    return item_obj

@api_router.put("/gallery/{item_id}", response_model=GalleryItem)
async def update_gallery_item(
    item_id: str,
    item: GalleryItemUpdate,
    token_data: dict = Depends(verify_token)
):
    """Update a gallery item (Admin only)."""
    existing = await gallery_items_collection.find_one({"_id": item_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    
    update_data = item.dict(exclude_unset=True)
    await gallery_items_collection.update_one({"_id": item_id}, {"$set": update_data})
    await broadcast_update("gallery")
    
    updated = await gallery_items_collection.find_one({"_id": item_id})
    return GalleryItem(**{**updated, "id": str(updated["_id"])})

@api_router.delete("/gallery/{item_id}")
async def delete_gallery_item(item_id: str, token_data: dict = Depends(verify_token)):
    """Delete a gallery item (Admin only)."""
    result = await gallery_items_collection.delete_one({"_id": item_id})
    await broadcast_update("gallery")
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return {"message": "Image supprimée avec succès"}

# ==================== VIDEOS ROUTES ====================

@api_router.get("/videos", response_model=List[Video])
async def get_videos():
    """Get all videos."""
    videos = await videos_collection.find().sort("createdAt", -1).to_list(1000)
    return [Video(**{**video, "id": str(video["_id"])}) for video in videos]

@api_router.post("/videos", response_model=Video)
async def create_video(video: VideoCreate, token_data: dict = Depends(verify_token)):
    """Create a new video (Admin only)."""
    video_obj = Video(**video.dict())
    video_dict = video_obj.dict()
    video_dict["_id"] = video_dict["id"]
    del video_dict["id"]
    
    await videos_collection.insert_one(video_dict)
    await broadcast_update("videos")
    return video_obj

@api_router.put("/videos/{video_id}", response_model=Video)
async def update_video(
    video_id: str,
    video: VideoUpdate,
    token_data: dict = Depends(verify_token)
):
    """Update a video (Admin only)."""
    existing = await videos_collection.find_one({"_id": video_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Video not found")
    
    update_data = video.dict(exclude_unset=True)
    await videos_collection.update_one({"_id": video_id}, {"$set": update_data})
    await broadcast_update("videos")
    
    updated = await videos_collection.find_one({"_id": video_id})
    return Video(**{**updated, "id": str(updated["_id"])})

@api_router.delete("/videos/{video_id}")
async def delete_video(video_id: str, token_data: dict = Depends(verify_token)):
    """Delete a video (Admin only)."""
    result = await videos_collection.delete_one({"_id": video_id})
    await broadcast_update("videos")
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Video not found")
    return {"message": "Vidéo supprimée avec succès"}

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
    await broadcast_update("content")
    
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
    admin = await admin_users_collection.find_one({"username": token_data["username"]})
    if not admin:
        raise HTTPException(status_code=404, detail="Admin user not found")
    return {"username": token_data["username"], "email": admin.get("email", ""), "valid": True}

@api_router.put("/admin/update")
async def update_admin(data: AdminUpdate, token_data: dict = Depends(verify_token)):
    """Update admin username/email."""
    # Check if admin exists
    admin = await admin_users_collection.find_one({"username": token_data["username"]})
    if not admin:
        raise HTTPException(status_code=404, detail="Admin user not found")
    
    update_fields = {}
    if data.username: update_fields["username"] = data.username
    if data.email: update_fields["email"] = data.email
    
    result = await admin_users_collection.update_one({"username": token_data["username"]}, {"$set": update_fields})
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="No changes made")
    return {"message": "Mis à jour"}

@api_router.put("/admin/change-password")
async def change_password(data: PasswordChange, token_data: dict = Depends(verify_token)):
    """Change password while logged in."""
    admin = await admin_users_collection.find_one({"username": token_data["username"]})
    if not verify_password(data.old_password, admin["hashed_password"]):
        raise HTTPException(status_code=400, detail="Ancien mot de passe incorrect")
    
    await admin_users_collection.update_one(
        {"username": token_data["username"]},
        {"$set": {"hashed_password": get_password_hash(data.new_password)}}
    )
    return {"message": "Mot de passe changé"}

@api_router.post("/admin/forgot-password")
async def forgot_password(email: str):
    """Send password reset email."""
    admin = await admin_users_collection.find_one({"email": email})
    if not admin:
        return {"message": "Si l'email existe, un lien a été envoyé"}
    
    reset_token = secrets.token_urlsafe(32)
    await admin_users_collection.update_one(
        {"email": email},
        {"$set": {"reset_token": reset_token, "reset_expires": datetime.utcnow() + timedelta(hours=1)}}
    )
    
    try:
        await send_reset_email(email, reset_token)
    except:
        pass
    
    return {"message": "Si l'email existe, un lien a été envoyé"}

@api_router.get("/admin/download-website")
async def download_website(token_data: dict = Depends(verify_token)):
    """Download entire project as ZIP."""
    def zip_directory():
        memory_file = io.BytesIO()
        with zipfile.ZipFile(memory_file, 'w', zipfile.ZIP_DEFLATED) as zf:
            project_root = "/app"
            for root, dirs, files in os.walk(project_root):
                for file in files:
                    if '__pycache__' in root or 'node_modules' in root or '.git' in root:
                        continue
                    full_path = os.path.join(root, file)
                    arcname = os.path.relpath(full_path, project_root)
                    zf.write(full_path, arcname)
        memory_file.seek(0)
        return memory_file
    
    zip_file = zip_directory()
    return StreamingResponse(
        zip_file,
        media_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=website-full-export.zip"}
    )


@api_router.post("/admin/reset-password")
async def reset_password(token: str, new_password: str):
    """Reset password with token."""
    admin = await admin_users_collection.find_one({"reset_token": token})
    if not admin or admin.get("reset_expires", datetime.min) < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Token invalide ou expiré")
    
    await admin_users_collection.update_one(
        {"reset_token": token},
        {"$set": {"hashed_password": get_password_hash(new_password)}, "$unset": {"reset_token": "", "reset_expires": ""}}
    )
    
    return {"message": "Mot de passe réinitialisé"}

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

# WebSocket connections
active_connections: List[WebSocket] = []

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except:
        active_connections.remove(websocket)

async def broadcast_update(data_type: str):
    for connection in active_connections:
        try:
            await connection.send_text(json.dumps({"type": data_type, "action": "refresh"}))
        except:
            pass

# Health check
@api_router.get("/")
async def root():
    return {"message": "Breakdance Crew API is running"}
