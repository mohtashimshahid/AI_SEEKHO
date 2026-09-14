from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import Token, UserLoginRequest, UserRegisterRequest, UserResponse
from app.services.auth_service import (
    create_access_token,
    get_current_user,
    get_password_hash,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(req: UserRegisterRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == req.email))
    existing = result.scalars().first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=req.email,
        name=req.name or req.email.split("@")[0],
        hashed_password=get_password_hash(req.password),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    token = create_access_token({"sub": user.id, "email": user.email})
    return Token(access_token=token, token_type="bearer", user_id=user.id, email=user.email, name=user.name)


@router.post("/login", response_model=Token)
async def login(req: UserLoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == req.email))
    user = result.scalars().first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    token = create_access_token({"sub": user.id, "email": user.email})
    return Token(access_token=token, token_type="bearer", user_id=user.id, email=user.email, name=user.name)


@router.post("/guest", response_model=Token)
async def guest_login(db: AsyncSession = Depends(get_db)):
    import uuid
    guest_suffix = str(uuid.uuid4())[:8]
    guest_email = f"guest_{guest_suffix}@tripsage.ai"
    guest_user = User(
        email=guest_email,
        name=f"Guest Traveler {guest_suffix}",
        hashed_password=get_password_hash(str(uuid.uuid4())),
    )
    db.add(guest_user)
    await db.commit()
    await db.refresh(guest_user)

    token = create_access_token({"sub": guest_user.id, "email": guest_user.email})
    return Token(access_token=token, token_type="bearer", user_id=guest_user.id, email=guest_user.email, name=guest_user.name)


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

