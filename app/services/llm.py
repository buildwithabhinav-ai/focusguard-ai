from groq import Groq
from google import genai
from google.genai import types

from app.config import (
    GROQ_API_KEY,
    GEMINI_API_KEY,
    OPENAI_API_KEY,
    DEFAULT_LLM,
)


class LLMService:

    def __init__(self):

        # ---------------------------------------
        # Groq Client
        # ---------------------------------------

        self.groq_client = (
            Groq(api_key=GROQ_API_KEY)
            if GROQ_API_KEY
            else None
        )

        # ---------------------------------------
        # Gemini Client
        # ---------------------------------------

        self.gemini_client = (
            genai.Client(api_key=GEMINI_API_KEY)
            if GEMINI_API_KEY
            else None
        )

    # =====================================================
    # GROQ
    # =====================================================

    def _ask_groq(self, prompt: str) -> str:

        if not self.groq_client:
            raise Exception(
                "Groq API key is not configured."
            )

        response = self.groq_client.chat.completions.create(

            # Current Groq model
            model="openai/gpt-oss-120b",

            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are FocusGuard AI, an intelligent "
                        "productivity assistant. "
                        "Provide concise, practical, and actionable "
                        "recommendations based only on the data "
                        "provided in the user's prompt. "
                        "Do not invent statistics, causes, trends, "
                        "or features. "
                        "When historical information is provided, "
                        "preserve its dates exactly. "
                        "Always finish the response with complete "
                        "sentences."
                    ),
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],

            temperature=0.4,

            # Increased from 500 so organization insights
            # are not cut off midway through the response.
            max_tokens=1000,
        )

        content = response.choices[0].message.content

        if not content:
            raise Exception(
                "Groq returned an empty response."
            )

        return content.strip()

    # =====================================================
    # GEMINI FALLBACK
    # =====================================================

    def _ask_gemini(self, prompt: str) -> str:

        if not self.gemini_client:
            raise Exception(
                "Gemini API key is not configured."
            )

        response = self.gemini_client.models.generate_content(

            model="gemini-3.6-flash",

            contents=prompt,

            config=types.GenerateContentConfig(

                system_instruction=(
                    "You are FocusGuard AI, an intelligent "
                    "productivity assistant. "
                    "Provide concise, practical, and actionable "
                    "recommendations based only on the data "
                    "provided in the user's prompt. "
                    "Do not invent statistics, causes, trends, "
                    "or features. "
                    "When historical information is provided, "
                    "preserve its dates exactly. "
                    "Always finish the response with complete "
                    "sentences."
                ),

                temperature=0.4,

                # Same output capacity as Groq.
                max_output_tokens=1000,
            ),
        )

        if not response.text:
            raise Exception(
                "Gemini returned an empty response."
            )

        return response.text.strip()

    # =====================================================
    # OPENAI
    # =====================================================

    def _ask_openai(self, prompt: str) -> str:

        raise NotImplementedError(
            "OpenAI integration is not implemented yet."
        )

    # =====================================================
    # MAIN LLM METHOD WITH FALLBACK
    # =====================================================

    def ask_llm(self, prompt: str) -> str:

        providers = []

        # ---------------------------------------
        # Preferred provider = Groq
        # ---------------------------------------

        if DEFAULT_LLM.lower() == "groq":

            providers = [
                self._ask_groq,
                self._ask_gemini,
                self._ask_openai,
            ]

        # ---------------------------------------
        # Preferred provider = Gemini
        # ---------------------------------------

        elif DEFAULT_LLM.lower() == "gemini":

            providers = [
                self._ask_gemini,
                self._ask_groq,
                self._ask_openai,
            ]

        # ---------------------------------------
        # Preferred provider = OpenAI
        # ---------------------------------------

        else:

            providers = [
                self._ask_openai,
                self._ask_groq,
                self._ask_gemini,
            ]

        # ---------------------------------------
        # Try providers one by one
        # ---------------------------------------

        for provider in providers:

            try:

                print(
                    f"\nTrying LLM provider: "
                    f"{provider.__name__}"
                )

                result = provider(prompt)

                print(
                    f"LLM provider succeeded: "
                    f"{provider.__name__}"
                )

                return result

            except Exception as e:

                print(
                    f"\nLLM Provider Failed: "
                    f"{provider.__name__}"
                )

                print(e)

        # ---------------------------------------
        # All providers failed
        # ---------------------------------------

        raise Exception(
            "All LLM providers failed."
        )


llm_service = LLMService()