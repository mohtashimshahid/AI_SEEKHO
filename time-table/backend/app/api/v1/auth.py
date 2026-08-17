from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.database import get_db
from app.core.security import create_access_token, create_refresh_token, decode_token
from app.schemas.user import UserRegister, UserLogin, UserResponse, TokenResponse
from app.services.auth_service import AuthService, get_current_user
from app.models.user import User

limiter = Limiter(key_func=get_remote_address)
router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
@limiter.limit("5/minute")
async def register(
    request: Request,
    user_in: UserRegister,
    db: AsyncSession = Depends(get_db)
):
    user = await AuthService.register_user(db, user_in)
    role_str = user.role.value if hasattr(user.role, 'value') else str(user.role)
    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=role_str
    )

@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/minute") # Brute-force protection (§11.6)
async def login(
    request: Request,
    user_in: UserLogin,
    response: Response,
    db: AsyncSession = Depends(get_db)
):
    user = await AuthService.authenticate_user(db, user_in.email, user_in.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    role_str = user.role.value if hasattr(user.role, 'value') else str(user.role)
    access_token = create_access_token(data={"sub": user.id, "role": role_str})
    refresh_token = create_refresh_token(data={"sub": user.id})

    # Set HttpOnly, Secure, SameSite=Lax cookies (§11.1)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="lax",
        secure=False
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite="lax",
        secure=False
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            role=role_str
        )
    )

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token_rotation(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db)
):
    # Short-lived JWT + Refresh Token Rotation (§11.3)
    raw_refresh = request.cookies.get("refresh_token")
    if not raw_refresh:
        raise HTTPException(status_code=401, detail="Refresh token missing.")

    payload = decode_token(raw_refresh)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token.")

    user_id = payload.get("sub")
    stmt = select(User).where(User.id == user_id)
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="User not found.")

    role_str = user.role.value if hasattr(user.role, 'value') else str(user.role)
    new_access = create_access_token(data={"sub": user.id, "role": role_str})
    new_refresh = create_refresh_token(data={"sub": user.id})

    response.set_cookie(key="access_token", value=new_access, httponly=True, samesite="lax", secure=False)
    response.set_cookie(key="refresh_token", value=new_refresh, httponly=True, samesite="lax", secure=False)

    return TokenResponse(
        access_token=new_access,
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            role=role_str
        )
    )

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token")
    response.delete_cookie(key="refresh_token")
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    role_str = current_user.role.value if hasattr(current_user.role, 'value') else str(current_user.role)
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        role=role_str
    )
