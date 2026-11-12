import hashlib
import hmac
import os
import secrets
import sqlite3
from datetime import datetime, timezone
from fastapi import HTTPException

from config import BASE_DIR

AUTH_DB_PATH = BASE_DIR / "users.db"


def _get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(AUTH_DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_auth_db() -> None:
    """Initialize users and sessions tables if they do not exist."""
    with _get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS sessions (
                token TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
            """
        )


def _hash_password(password: str, salt: bytes | None = None) -> str:
    if salt is None:
        salt = os.urandom(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100_000)
    return f"{salt.hex()}:{digest.hex()}"


def _verify_password(password: str, stored_hash: str) -> bool:
    try:
        salt_hex, digest_hex = stored_hash.split(":", 1)
        salt = bytes.fromhex(salt_hex)
        expected = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100_000).hex()
        return hmac.compare_digest(expected, digest_hex)
    except ValueError:
        return False


def _create_session(conn: sqlite3.Connection, user_id: int) -> str:
    token = secrets.token_urlsafe(32)
    now = datetime.now(timezone.utc).isoformat()
    conn.execute(
        "INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)",
        (token, user_id, now),
    )
    return token


def register_user(name: str, email: str, password: str) -> dict:
    """Create a new user account and return an active session token."""
    clean_name = name.strip()
    clean_email = email.strip().lower()

    if not clean_name:
        raise HTTPException(status_code=400, detail="Name is required")
    if not clean_email or "@" not in clean_email:
        raise HTTPException(status_code=400, detail="Valid email is required")
    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    password_hash = _hash_password(password)
    now = datetime.now(timezone.utc).isoformat()

    with _get_connection() as conn:
        existing = conn.execute("SELECT id FROM users WHERE email = ?", (clean_email,)).fetchone()
        if existing:
            raise HTTPException(status_code=409, detail="An account with this email already exists")

        cursor = conn.execute(
            "INSERT INTO users (name, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
            (clean_name, clean_email, password_hash, now),
        )
        user_id = cursor.lastrowid
        token = _create_session(conn, user_id)

    return {
        "token": token,
        "user": {"id": user_id, "name": clean_name, "email": clean_email},
    }


def login_user(email: str, password: str) -> dict:
    """Authenticate an existing user and return a new session token."""
    clean_email = email.strip().lower()
    if not clean_email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    with _get_connection() as conn:
        row = conn.execute(
            "SELECT id, name, email, password_hash FROM users WHERE email = ?",
            (clean_email,),
        ).fetchone()

        if not row or not _verify_password(password, row["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        token = _create_session(conn, row["id"])

    return {
        "token": token,
        "user": {"id": row["id"], "name": row["name"], "email": row["email"]},
    }


def get_user_by_token(token: str) -> dict | None:
    """Look up the user associated with a session token."""
    if not token:
        return None
    with _get_connection() as conn:
        row = conn.execute(
            """
            SELECT u.id, u.name, u.email
            FROM sessions s
            JOIN users u ON s.user_id = u.id
            WHERE s.token = ?
            """,
            (token,),
        ).fetchone()
    if not row:
        return None
    return {"id": row["id"], "name": row["name"], "email": row["email"]}


def logout_token(token: str) -> None:
    """Invalidate a session token."""
    if not token:
        return
    with _get_connection() as conn:
        conn.execute("DELETE FROM sessions WHERE token = ?", (token,))

