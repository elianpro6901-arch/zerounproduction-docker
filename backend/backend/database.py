from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'breakdance_crew')]

# Collections
events_collection = db.events
site_content_collection = db.site_content
admin_users_collection = db.admin_users
team_members_collection = db.team_members
gallery_items_collection = db.gallery_items
videos_collection = db.videos

async def init_db():
    """Initialize database with default data."""
    from datetime import datetime
    
    # Check if site content exists
    existing_content = await site_content_collection.find_one({"_id": "site_content_singleton"})
    if not existing_content:
        default_content = {
            "_id": "site_content_singleton",
            "heroTitle": "ZERO UN PRODUCTION",
            "heroSubtitle": "Cultures Urbaines – Événements – Expositions",
            "heroPrimaryCTA": "Découvrir nos événements",
            "heroSecondaryCTA": "Voir les vidéos",
            "communityTitle": "Rejoignez Le Mouvement",
            "communityDescription": "Basés dans l'Ain (01), nous intervenons dans toute la région Auvergne-Rhône-Alpes. Ateliers, battles, spectacles et expositions pour tous les âges et tous les niveaux. Rejoignez la communauté Zero Un Production !",
            "communityCTA": "Contactez-nous",
            "aboutTitle": "À Propos de Nous",
            "aboutDescription": "Fondé avec la passion des cultures urbaines, Zero Un Production rassemble des artistes de tous horizons unis par l'amour du mouvement et de l'expression artistique.",
            "contactEmail": "zeroundprod@gmail.com",
            "contactPhone": "",
            "contactAddress": "Ain, France",
            "footerTagline": "Cultures Urbaines – Événements – Expositions",
            "features": [
                {
                    "title": "Danse Urbaine & Breakdance",
                    "description": "Hip-hop, breakdance, freestyle. Plus de 120 ateliers organisés pour les jeunes de 7 à 18 ans",
                    "icon": "users"
                },
                {
                    "title": "Événements & Spectacles",
                    "description": "Plus de 30 représentations artistiques par an. Battles, expositions et créations originales",
                    "icon": "calendar"
                },
                {
                    "title": "Cultures Urbaines",
                    "description": "Slam, rap, graffiti, beatmaking, DJing et freestyle football. Toutes les disciplines urbaines réunies",
                    "icon": "image"
                }
            ]
        }
        await site_content_collection.insert_one(default_content)
    
    # Check if admin user exists
    existing_admin = await admin_users_collection.find_one({"username": "admin"})
    if not existing_admin:
        from auth import get_password_hash
        admin_user = {
            "username": "admin",
            "email": "zeroundprod@gmail.com",
            "hashed_password": get_password_hash("admin123"),
            "createdAt": datetime.utcnow()
        }
        await admin_users_collection.insert_one(admin_user)
        print("Default admin created: username='admin', password='admin123'")
    
    # Check if events exist
    existing_events = await events_collection.count_documents({})
    if existing_events == 0:
        default_events = [
            {
                "_id": "event-1",
                "title": "Exposition Vibrations Urbaines 2025",
                "date": "10 Déc 2025 - 20 Jan 2026",
                "location": "Bourg-en-Bresse, Ain (01)",
                "description": "Une exposition retraçant le processus créatif du projet Vibrations Urbaines, ainsi que les ateliers proposés aux habitants de Bourg-en-Bresse. Découvrez l'univers des cultures urbaines à travers photos, vidéos et installations.",
                "imageUrl": "https://customer-assets.emergentagent.com/job_6e5a3b07-0a07-4f17-b18b-4bfb1d182dba/artifacts/dj4bztd5_IMG_6797.jpeg",
                "featured": True,
                "createdAt": datetime.utcnow()
            },
            {
                "_id": "event-2",
                "title": "Battle des Élèves",
                "date": "12 Déc 2025",
                "location": "Salle de l'Alagnier, Bourg-en-Bresse",
                "description": "Breaking 3vs3 Junior & All Style 1vs1. Un événement gratuit organisé par Zero Un Production pour les jeunes talents. Venez encourager les futurs champions ! Horaires: 18h30 - 20h30",
                "imageUrl": "https://customer-assets.emergentagent.com/job_6e5a3b07-0a07-4f17-b18b-4bfb1d182dba/artifacts/zp4uk3x1_IMG_6800.jpeg",
                "featured": True,
                "createdAt": datetime.utcnow()
            },
            {
                "_id": "event-3",
                "title": "Ateliers Cultures Urbaines",
                "date": "En continu - 2025/2026",
                "location": "Département de l'Ain (01)",
                "description": "Ateliers hebdomadaires de danse urbaine, breakdance, slam, graffiti et beatmaking pour jeunes de 7 à 18 ans. Plus de 120 ateliers organisés dans tout le département.",
                "imageUrl": "https://customer-assets.emergentagent.com/job_vibes-urbaines/artifacts/53e7osdn_IMG_6798.jpeg",
                "featured": False,
                "createdAt": datetime.utcnow()
            }
        ]
        await events_collection.insert_many(default_events)
        print("Default events created")
    
    # Check if team members exist
    existing_team = await team_members_collection.count_documents({})
    if existing_team == 0:
        default_team = [
            {
                "_id": "team-1",
                "name": "B-Boy Master",
                "role": "Danseur Principal / Instructeur",
                "bio": "Passionné de breakdance depuis plus de 10 ans",
                "imageUrl": "https://customer-assets.emergentagent.com/job_6e5a3b07-0a07-4f17-b18b-4bfb1d182dba/artifacts/j5qd8qyk_IMG_6801.jpeg",
                "createdAt": datetime.utcnow()
            },
            {
                "_id": "team-2",
                "name": "B-Boy Artist",
                "role": "Chorégraphe / Performer",
                "bio": "Expert en freestyle et battles",
                "imageUrl": "https://customer-assets.emergentagent.com/job_vibes-urbaines/artifacts/53e7osdn_IMG_6798.jpeg",
                "createdAt": datetime.utcnow()
            }
        ]
        await team_members_collection.insert_many(default_team)
        print("Default team members created")
    
    # Check if gallery items exist
    existing_gallery = await gallery_items_collection.count_documents({})
    if existing_gallery == 0:
        default_gallery = [
            {
                "_id": "gallery-1",
                "title": "Session Training",
                "description": "Entraînement intensif du crew",
                "imageUrl": "https://customer-assets.emergentagent.com/job_6e5a3b07-0a07-4f17-b18b-4bfb1d182dba/artifacts/j5qd8qyk_IMG_6801.jpeg",
                "createdAt": datetime.utcnow()
            },
            {
                "_id": "gallery-2",
                "title": "Performance Urbaine",
                "description": "Show dans les rues",
                "imageUrl": "https://customer-assets.emergentagent.com/job_vibes-urbaines/artifacts/53e7osdn_IMG_6798.jpeg",
                "createdAt": datetime.utcnow()
            },
            {
                "_id": "gallery-3",
                "title": "Vibrations Urbaines",
                "description": "Exposition culturelle",
                "imageUrl": "https://customer-assets.emergentagent.com/job_6e5a3b07-0a07-4f17-b18b-4bfb1d182dba/artifacts/dj4bztd5_IMG_6797.jpeg",
                "createdAt": datetime.utcnow()
            }
        ]
        await gallery_items_collection.insert_many(default_gallery)
        print("Default gallery items created")
    
    # Check if videos exist
    existing_videos = await videos_collection.count_documents({})
    if existing_videos == 0:
        default_videos = [
            {
                "_id": "video-1",
                "title": "Breakdance Crew - Session d'Accueil",
                "description": "Découvrez notre crew en action lors d'une session d'entraînement",
                "videoUrl": "https://customer-assets.emergentagent.com/job_6e5a3b07-0a07-4f17-b18b-4bfb1d182dba/artifacts/08xvldk7_break%20dance%20video%20acceuil.mp4",
                "thumbnailUrl": "https://customer-assets.emergentagent.com/job_6e5a3b07-0a07-4f17-b18b-4bfb1d182dba/artifacts/j5qd8qyk_IMG_6801.jpeg",
                "createdAt": datetime.utcnow()
            },
            {
                "_id": "video-2",
                "title": "Démonstration Battle",
                "description": "Nos meilleurs moves en compétition",
                "videoUrl": "https://customer-assets.emergentagent.com/job_6e5a3b07-0a07-4f17-b18b-4bfb1d182dba/artifacts/562abih8_screenrecording%20video.mp4",
                "thumbnailUrl": "https://customer-assets.emergentagent.com/job_vibes-urbaines/artifacts/53e7osdn_IMG_6798.jpeg",
                "createdAt": datetime.utcnow()
            }
        ]
        await videos_collection.insert_many(default_videos)
        print("Default videos created")

async def close_db():
    """Close database connection."""
    client.close()