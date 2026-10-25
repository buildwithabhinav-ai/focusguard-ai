from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models import Translation
from app.models import DynamicTranslation

from app.services.sarvam_service import (
    SarvamService,
    TRANSLATED_SCRIPT_PATTERN,
)


class TranslationService:

    # -------------------------------------------------
    # STATIC TRANSLATION
    #
    # ONLY READ FROM DATABASE.
    #
    # THIS DOES NOT CALL SARVAM API.
    # -------------------------------------------------

    @staticmethod
    def get_translation(
        db: Session,
        message_key: str,
        language: str = "en"
    ) -> str:

        translation = (
            db.query(Translation)
            .filter(
                Translation.message_key == message_key,
                Translation.language == language
            )
            .first()
        )

        if translation:
            return translation.translated_text

        # ---------------------------------------------
        # FALLBACK TO ENGLISH
        # ---------------------------------------------

        english = (
            db.query(Translation)
            .filter(
                Translation.message_key == message_key,
                Translation.language == "en"
            )
            .first()
        )

        if english:
            return english.translated_text

        # ---------------------------------------------
        # FINAL FALLBACK
        # ---------------------------------------------

        return message_key

    # -------------------------------------------------
    # DYNAMIC TRANSLATION
    #
    # DATABASE CACHE
    #        ↓
    # SARVAM API ONLY IF NOT CACHED
    #        ↓
    # SAVE RESULT
    #
    # IF SARVAM FAILS:
    #        ↓
    # RETURN ORIGINAL TEXT
    #
    # THIS PREVENTS A TRANSLATION FAILURE FROM
    # BREAKING THE FRONTEND.
    # -------------------------------------------------

    @staticmethod
    def translate_dynamic_message(
        db: Session,
        message: str,
        language: str = "en",
        source_language: str = "en"
    ) -> str:

        # ---------------------------------------------
        # EMPTY TEXT
        # ---------------------------------------------

        if not message:
            return message

        # ---------------------------------------------
        # SAME LANGUAGE
        # ---------------------------------------------

        if language == source_language:
            return message

        # ---------------------------------------------
        # CHECK CACHE FIRST
        # ---------------------------------------------

        cached = (
            db.query(DynamicTranslation)
            .filter(
                DynamicTranslation.original_text == message,
                DynamicTranslation.language == language
            )
            .first()
        )

        if cached:
            return cached.translated_text

        # ---------------------------------------------
        # CALL SARVAM
        # ---------------------------------------------

        try:

            translated = SarvamService.translate(
                text=message,
                target_language=language,
                source_language=source_language
            )

        except Exception as error:

            print(
                f"Dynamic translation failed for "
                f"language '{language}': {error}"
            )

            # -----------------------------------------
            # IMPORTANT:
            # DO NOT BREAK THE APPLICATION IF SARVAM
            # IS UNAVAILABLE / OUT OF CREDITS.
            # -----------------------------------------

            return message

        # ---------------------------------------------
        # SAVE TO DATABASE CACHE
        # ---------------------------------------------

        try:

            new_translation = DynamicTranslation(
                original_text=message,
                language=language,
                translated_text=translated
            )

            db.add(new_translation)
            db.commit()

            return translated

        except IntegrityError:

            # Another request may have saved
            # the same translation first.

            db.rollback()

            cached = (
                db.query(DynamicTranslation)
                .filter(
                    DynamicTranslation.original_text == message,
                    DynamicTranslation.language == language
                )
                .first()
            )

            if cached:
                return cached.translated_text

            # If the cache save failed for some other
            # reason, still don't break the application.

            return translated

    # -------------------------------------------------
    # BATCH TRANSLATION
    #
    # Resolves many UI texts in one request:
    #
    # STATIC TRANSLATION (message_key, this language)
    #        ↓
    # DATABASE CACHE
    #        ↓
    # SARVAM (batched) ONLY FOR WHAT IS LEFT
    #
    # Unlike get_translation, this never falls back to
    # English rows, so a missing static row is still
    # translated by Sarvam.
    #
    # Returns ({text: translation}, [untranslated texts]).
    # Untranslated texts map to the original text and
    # are not cached, so they are retried next time.
    # -------------------------------------------------

    @staticmethod
    def translate_batch(
        db: Session,
        items: list[dict],
        language: str
    ) -> tuple[dict[str, str], list[str]]:

        texts = list(dict.fromkeys(
            item["text"]
            for item in items
            if item["text"]
        ))

        if language == "en":
            return {text: text for text in texts}, []

        # Text already in a non-Latin script was translated
        # before; sending it to Sarvam as English returns
        # English, so it is passed through unchanged.
        results = {
            text: text
            for text in texts
            if TRANSLATED_SCRIPT_PATTERN.search(text)
        }

        # ---------------------------------------------
        # STATIC TRANSLATIONS
        # ---------------------------------------------

        keys = {
            item["text"]: item["key"]
            for item in items
            if item.get("key")
        }

        if keys:

            static_rows = (
                db.query(Translation)
                .filter(
                    Translation.message_key.in_(
                        set(keys.values())
                    ),
                    Translation.language == language
                )
                .all()
            )

            static = {
                row.message_key: row.translated_text
                for row in static_rows
            }

            for text, key in keys.items():

                if key in static:
                    results[text] = static[key]

        # ---------------------------------------------
        # DATABASE CACHE
        # ---------------------------------------------

        remaining = [
            text for text in texts
            if text not in results
        ]

        if remaining:

            cached_rows = (
                db.query(DynamicTranslation)
                .filter(
                    DynamicTranslation.original_text.in_(
                        remaining
                    ),
                    DynamicTranslation.language == language
                )
                .all()
            )

            for row in cached_rows:
                results[row.original_text] = (
                    row.translated_text
                )

        # ---------------------------------------------
        # SARVAM
        # ---------------------------------------------

        remaining = [
            text for text in texts
            if text not in results
        ]

        translated = (
            SarvamService.translate_many(
                remaining,
                language
            )
            if remaining
            else {}
        )

        for text, translated_text in translated.items():

            results[text] = translated_text

            try:

                with db.begin_nested():

                    db.add(
                        DynamicTranslation(
                            original_text=text,
                            language=language,
                            translated_text=translated_text
                        )
                    )

            except IntegrityError:

                # Another request cached it first.
                pass

        db.commit()

        failed = [
            text for text in texts
            if text not in results
        ]

        for text in failed:
            results[text] = text

        return results, failed