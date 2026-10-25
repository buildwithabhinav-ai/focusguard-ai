from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import User
from app.schemas import (
    UpdateLanguageRequest,
    DynamicTranslationRequest,
    BatchTranslationRequest
)

from app.dependencies import get_current_user

from app.services.sarvam_service import (
    SarvamService
)

from app.services.translation_service import (
    TranslationService
)


router = APIRouter(

    prefix="/translation",

    tags=["Translation"]

)


# -------------------------------------------------
# Database Dependency
# -------------------------------------------------

def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()


# -------------------------------------------------
# Get Supported Languages
# -------------------------------------------------

@router.get(
    "/languages"
)

def get_supported_languages():

    return {

        "languages":

            SarvamService
            .get_supported_languages()

    }


# -------------------------------------------------
# Get Static Translation
# -------------------------------------------------

@router.get(
    "/message/{message_key}"
)

def get_message_translation(

    message_key: str,

    language: str = "en",

    db: Session = Depends(get_db)

):

    if not SarvamService.is_supported(
        language
    ):

        raise HTTPException(

            status_code=400,

            detail="Unsupported language."

        )


    translated_text = (

        TranslationService
        .get_translation(

            db=db,

            message_key=message_key,

            language=language

        )

    )


    return {

        "message_key":
            message_key,

        "language":
            language,

        "translated_text":
            translated_text

    }


# -------------------------------------------------
# Translate Dynamic Text
# -------------------------------------------------

@router.post(
    "/dynamic"
)

def translate_dynamic_text(

    request: DynamicTranslationRequest,

    language: str = "en",

    db: Session = Depends(get_db)

):

    message = request.message

    print(
    f"DYNAMIC TRANSLATION REQUEST: "
    f"[{message}] -> [{language}]"
)


    if not SarvamService.is_supported(
        language
    ):

        raise HTTPException(

            status_code=400,

            detail="Unsupported language."

        )


    translated_text = (

        TranslationService
        .translate_dynamic_message(

            db=db,

            message=message,

            language=language

        )

    )


    return {

        "original_text":
            message,

        "language":
            language,

        "translated_text":
            translated_text

    }


# -------------------------------------------------
# Translate Many Texts
#
# The frontend collects every text a page needs and
# sends them together, instead of one request each.
# -------------------------------------------------

MAX_BATCH_ITEMS = 500


@router.post(
    "/batch"
)

def translate_batch(

    request: BatchTranslationRequest,

    language: str = "en",

    db: Session = Depends(get_db)

):

    if not SarvamService.is_supported(
        language
    ):

        raise HTTPException(

            status_code=400,

            detail="Unsupported language."

        )


    if len(request.items) > MAX_BATCH_ITEMS:

        raise HTTPException(

            status_code=400,

            detail=(
                f"At most {MAX_BATCH_ITEMS} "
                f"texts per request."
            )

        )


    translations, failed = (

        TranslationService
        .translate_batch(

            db=db,

            items=[
                item.model_dump()
                for item in request.items
            ],

            language=language

        )

    )


    return {

        "language":
            language,

        "translations":
            translations,

        "failed":
            failed

    }


# -------------------------------------------------
# Update User Preferred Language
# -------------------------------------------------

@router.put(
    "/language"
)

def update_user_language(

    request: UpdateLanguageRequest,

    db: Session = Depends(get_db),

    current_user=Depends(
        get_current_user
    )

):

    language = request.language


    # ---------------------------------------------
    # Validate Language
    # ---------------------------------------------

    if not SarvamService.is_supported(
        language
    ):

        raise HTTPException(

            status_code=400,

            detail="Unsupported language."

        )


    # ---------------------------------------------
    # Fetch User In Current Database Session
    # ---------------------------------------------

    db_user = (

        db.query(User)

        .filter(
            User.id
            == current_user.id
        )

        .first()

    )


    if db_user is None:

        raise HTTPException(

            status_code=404,

            detail="User not found."

        )


    # ---------------------------------------------
    # Update Preferred Language
    # ---------------------------------------------

    db_user.preferred_language = (
        language
    )


    db.commit()


    db.refresh(
        db_user
    )


    return {

        "message":
            "Language preference updated successfully.",

        "language":
            db_user.preferred_language

    }