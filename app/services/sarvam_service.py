import re
import threading
import time
from concurrent.futures import ThreadPoolExecutor

from sarvamai import SarvamAI

from app.config import SARVAM_API_KEY


client = SarvamAI(
    api_subscription_key=SARVAM_API_KEY
)


# -------------------------------------------------
# RATE LIMITING
#
# Sarvam returns 429 when too many requests run at
# once. A page can need hundreds of strings, so all
# calls share this limit and retry with backoff.
# -------------------------------------------------

MAX_CONCURRENT_REQUESTS = 3

MAX_RETRIES = 5

_request_slots = threading.BoundedSemaphore(
    MAX_CONCURRENT_REQUESTS
)


# Sarvam accepts up to 2000 characters per request.
MAX_CHUNK_CHARS = 900

# Short UI strings are sent together, one per line.
MAX_LINES_PER_BATCH = 25


# Indic, Arabic, Ol Chiki and Meetei Mayek letters, i.e. text
# written in one of the supported non-English languages.
TRANSLATED_SCRIPT_PATTERN = re.compile(
    "[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF"
    "\u0900-\u0DFF\u1C50-\u1C7F\uABC0-\uABFF]"
)


class SarvamService:

    # -------------------------------------------------
    # CENTRALIZED LANGUAGE CONFIGURATION
    # -------------------------------------------------

    supported_languages = {
        "en": {
            "code": "en-IN",
            "name": "English",
            "native_name": "English"
        },

        "hi": {
            "code": "hi-IN",
            "name": "Hindi",
            "native_name": "हिन्दी"
        },

        "bn": {
            "code": "bn-IN",
            "name": "Bengali",
            "native_name": "বাংলা"
        },

        "gu": {
            "code": "gu-IN",
            "name": "Gujarati",
            "native_name": "ગુજરાતી"
        },

        "kn": {
            "code": "kn-IN",
            "name": "Kannada",
            "native_name": "ಕನ್ನಡ"
        },

        "ml": {
            "code": "ml-IN",
            "name": "Malayalam",
            "native_name": "മലയാളം"
        },

        "mr": {
            "code": "mr-IN",
            "name": "Marathi",
            "native_name": "मराठी"
        },

        "od": {
            "code": "od-IN",
            "name": "Odia",
            "native_name": "ଓଡ଼ିଆ"
        },

        "pa": {
            "code": "pa-IN",
            "name": "Punjabi",
            "native_name": "ਪੰਜਾਬੀ"
        },

        "ta": {
            "code": "ta-IN",
            "name": "Tamil",
            "native_name": "தமிழ்"
        },

        "te": {
            "code": "te-IN",
            "name": "Telugu",
            "native_name": "తెలుగు"
        },

        "as": {
            "code": "as-IN",
            "name": "Assamese",
            "native_name": "অসমীয়া"
        },

        "brx": {
            "code": "brx-IN",
            "name": "Bodo",
            "native_name": "बड़ो"
        },

        "doi": {
            "code": "doi-IN",
            "name": "Dogri",
            "native_name": "डोगरी"
        },

        "kok": {
            "code": "kok-IN",
            "name": "Konkani",
            "native_name": "कोंकणी"
        },

        "ks": {
            "code": "ks-IN",
            "name": "Kashmiri",
            "native_name": "कॉशुर"
        },

        "mai": {
            "code": "mai-IN",
            "name": "Maithili",
            "native_name": "मैथिली"
        },

        "mni": {
            "code": "mni-IN",
            "name": "Manipuri",
            "native_name": "মৈতৈলোন্"
        },

        "ne": {
            "code": "ne-IN",
            "name": "Nepali",
            "native_name": "नेपाली"
        },

        "sa": {
            "code": "sa-IN",
            "name": "Sanskrit",
            "native_name": "संस्कृतम्"
        },

        "sat": {
            "code": "sat-IN",
            "name": "Santali",
            "native_name": "ᱥᱟᱱᱛᱟᱲᱤ"
        },

        # Sindhi (sd) was removed: Sarvam returns Sindhi in
        # Devanagari while the rest of the app uses the Arabic
        # script, so pages rendered in mixed scripts.

        "ur": {
            "code": "ur-IN",
            "name": "Urdu",
            "native_name": "اردو"
        }
    }

    # -------------------------------------------------
    # GET SUPPORTED LANGUAGES
    # -------------------------------------------------

    @classmethod
    def get_supported_languages(cls):

        languages = []

        for language_id, data in (
            cls.supported_languages.items()
        ):

            languages.append(
                {
                    "id": language_id,
                    "name": data["name"],
                    "native_name": data["native_name"]
                }
            )

        return languages

    # -------------------------------------------------
    # VALIDATE LANGUAGE
    # -------------------------------------------------

    @classmethod
    def is_supported(
        cls,
        language: str
    ) -> bool:

        return (
            language
            in cls.supported_languages
        )

    # -------------------------------------------------
    # GET SARVAM LANGUAGE CODE
    # -------------------------------------------------

    @classmethod
    def get_language_code(
        cls,
        language: str
    ) -> str:

        if not cls.is_supported(language):

            raise ValueError(
                f"Unsupported language: {language}"
            )

        return (
            cls.supported_languages
            [language]["code"]
        )

    # -------------------------------------------------
    # TRANSLATE TEXT
    # -------------------------------------------------

    @classmethod
    def translate(

        cls,

        text: str,

        target_language: str,

        source_language: str = "en"

    ) -> str:

        # English to English
        if (
            target_language
            == source_language
        ):

            return text

        source_code = (
            cls.get_language_code(
                source_language
            )
        )

        target_code = (
            cls.get_language_code(
                target_language
            )
        )

        # Long text (e.g. AI responses) is translated in
        # chunks so it stays under Sarvam's input limit.
        translated = ""

        for separator, chunk in cls._split_into_chunks(text):

            translated += separator + cls._call_sarvam(
                chunk,
                source_code,
                target_code
            )

        return translated

    # -------------------------------------------------
    # TRANSLATE MANY SHORT TEXTS
    #
    # Joins short texts into one request (one per line)
    # to avoid hundreds of separate API calls. If the
    # line count does not survive translation, that
    # batch is translated one text at a time instead.
    #
    # Returns {text: translation}. Texts that could not
    # be translated are left out.
    # -------------------------------------------------

    @classmethod
    def translate_many(

        cls,

        texts: list[str],

        target_language: str,

        source_language: str = "en"

    ) -> dict[str, str]:

        results = {}

        batchable = []

        for text in texts:

            if (
                "\n" in text
                or len(text) > MAX_CHUNK_CHARS
            ):

                cls._translate_into(
                    results,
                    text,
                    target_language,
                    source_language
                )

            else:

                batchable.append(text)

        def translate_lines(batch):

            batch_results = {}

            try:

                translated = cls.translate(
                    "\n".join(batch),
                    target_language,
                    source_language
                ).split("\n")

            except Exception as error:

                print(
                    f"Batch translation failed for "
                    f"'{target_language}': {error}"
                )

                translated = []

            if len(translated) == len(batch):

                for original, result in zip(
                    batch,
                    translated
                ):

                    # In a batch, Sarvam sometimes echoes a line
                    # back in English (e.g. "**Team Insights**").
                    # Every supported language uses a non-Latin
                    # script, so retry those lines on their own.
                    if TRANSLATED_SCRIPT_PATTERN.search(result):

                        batch_results[original] = (
                            result.strip()
                        )

                    else:

                        cls._translate_into(
                            batch_results,
                            original,
                            target_language,
                            source_language
                        )

            else:

                for text in batch:

                    cls._translate_into(
                        batch_results,
                        text,
                        target_language,
                        source_language
                    )

            return batch_results

        with ThreadPoolExecutor(
            MAX_CONCURRENT_REQUESTS
        ) as executor:

            for batch_results in executor.map(
                translate_lines,
                cls._group_lines(batchable)
            ):

                results.update(batch_results)

        return results

    @classmethod
    def _translate_into(
        cls,
        results: dict,
        text: str,
        target_language: str,
        source_language: str
    ):

        try:

            results[text] = cls.translate(
                text,
                target_language,
                source_language
            )

        except Exception as error:

            print(
                f"Translation failed for "
                f"'{target_language}': {error}"
            )

    # -------------------------------------------------
    # SARVAM API CALL WITH RETRY
    # -------------------------------------------------

    @staticmethod
    def _call_sarvam(
        text: str,
        source_code: str,
        target_code: str
    ) -> str:

        if not text.strip():
            return text

        for attempt in range(MAX_RETRIES):

            try:

                with _request_slots:

                    response = client.text.translate(

                        input=text,

                        source_language_code=source_code,

                        target_language_code=target_code,

                        model="sarvam-translate:v1"

                    )

                return response.translated_text

            except Exception as error:

                rate_limited = (
                    getattr(error, "status_code", None)
                    == 429
                )

                if (
                    not rate_limited
                    or attempt == MAX_RETRIES - 1
                ):
                    raise

                time.sleep(
                    0.5 * (2 ** attempt)
                )

    # -------------------------------------------------
    # CHUNKING HELPERS
    # -------------------------------------------------

    @staticmethod
    def _split_into_chunks(
        text: str
    ) -> list[tuple[str, str]]:

        # Returns (separator, chunk) pairs; joining them
        # in order rebuilds the original text.

        if len(text) <= MAX_CHUNK_CHARS:
            return [("", text)]

        pieces = []

        for line_index, line in enumerate(
            text.split("\n")
        ):

            # Very long lines are split on sentence ends.
            sentences = (
                re.split(r"(?<=[.!?])\s+", line)
                if len(line) > MAX_CHUNK_CHARS
                else [line]
            )

            for sentence_index, sentence in enumerate(
                sentences
            ):

                if sentence_index > 0:
                    separator = " "
                elif line_index > 0:
                    separator = "\n"
                else:
                    separator = ""

                pieces.append((separator, sentence))

        chunks = []

        for separator, piece in pieces:

            if (
                chunks
                and len(chunks[-1][1])
                + len(separator)
                + len(piece)
                <= MAX_CHUNK_CHARS
            ):

                chunk_separator, chunk = chunks[-1]

                chunks[-1] = (
                    chunk_separator,
                    chunk + separator + piece
                )

            else:

                chunks.append((separator, piece))

        return chunks

    @staticmethod
    def _group_lines(texts: list[str]) -> list[list[str]]:

        batches = []

        batch = []

        size = 0

        for text in texts:

            if batch and (
                len(batch) >= MAX_LINES_PER_BATCH
                or size + len(text) + 1 > MAX_CHUNK_CHARS
            ):

                batches.append(batch)

                batch = []

                size = 0

            batch.append(text)

            size += len(text) + 1

        if batch:
            batches.append(batch)

        return batches