import io
import os
import uuid
from pathlib import Path
from typing import Tuple
from PIL import Image
from fastapi import HTTPException, UploadFile, status

ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}

MAX_FILE_SIZE_BYTES = int(os.getenv("MAX_UPLOAD_SIZE_MB", "10")) * 1024 * 1024
MIN_DIMENSION = 32
MAX_DIMENSION = 10000


def validate_image_bytes(
    image_bytes: bytes,
    declared_content_type: str | None = None,
    max_size: int = MAX_FILE_SIZE_BYTES,
) -> Tuple[str, int, int]:
    """
    Validates uploaded image content:
    - Non-empty
    - Under maximum size limit
    - Valid image format via PIL (JPEG, PNG, WEBP)
    - Valid dimensions (>= 32px, <= 10000px)
    Returns: (normalized_extension, width, height)
    """
    if not image_bytes or len(image_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded image is empty.",
        )

    if len(image_bytes) > max_size:
        max_mb = max_size / (1024 * 1024)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Image size exceeds the maximum limit of {max_mb:.0f} MB.",
        )

    try:
        with Image.open(io.BytesIO(image_bytes)) as img:
            img_format = (img.format or "").upper()
            if img_format not in ("JPEG", "JPG", "PNG", "WEBP"):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Unsupported image format: {img_format}. Allowed: JPG, PNG, WEBP.",
                )
            width, height = img.size
            if width < MIN_DIMENSION or height < MIN_DIMENSION:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Image dimensions ({width}x{height}) are too small. Minimum is {MIN_DIMENSION}x{MIN_DIMENSION}px.",
                )
            if width > MAX_DIMENSION or height > MAX_DIMENSION:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Image dimensions ({width}x{height}) exceed maximum allowed {MAX_DIMENSION}x{MAX_DIMENSION}px.",
                )

            ext_map = {"JPEG": ".jpg", "JPG": ".jpg", "PNG": ".png", "WEBP": ".webp"}
            return ext_map[img_format], width, height
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid or corrupted image file: {str(exc)}",
        )


def save_image_bytes(
    image_bytes: bytes,
    target_dir: Path,
    filename_prefix: str,
    extension: str,
) -> Tuple[Path, str]:
    """
    Saves image bytes to disk with server-generated UUID filename.
    Returns (absolute_file_path, relative_posix_path).
    """
    target_dir.mkdir(parents=True, exist_ok=True)
    unique_suffix = uuid.uuid4().hex
    safe_filename = f"{filename_prefix}_{unique_suffix}{extension}"
    target_path = target_dir / safe_filename

    with open(target_path, "wb") as f:
        f.write(image_bytes)

    # Normalize relative path to forward slashes for cross-platform DB storage
    # Always normalize to uploads/...
    posix_path = str(target_path).replace("\\", "/")
    if "uploads/" in posix_path:
        rel_path = "uploads/" + posix_path.split("uploads/", 1)[1]
    else:
        rel_path = posix_path

    return target_path, rel_path


def delete_file_safely(file_path: Path | str | None):
    """Safely deletes a file from disk if it exists, ignoring missing files."""
    if not file_path:
        return
    try:
        p = Path(file_path)
        if p.exists() and p.is_file():
            p.unlink()
    except Exception:
        pass
