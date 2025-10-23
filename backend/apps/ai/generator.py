import cohere
from django.conf import settings
import re

def suggest_replies(message: str):
    """
    Returns one AI reply and two user suggestions
    """
    try:
        api_key = settings.COHERE_API_KEY
        if not api_key:
            raise ValueError("Cohere API key not set.")

        co = cohere.Client(api_key)

        prompt = (
            f"Customer said: {message}\n"
            "Provide one concise AI reply, followed by two short helpful suggestions for the customer.\n"
            "Format exactly:\n"
            "Reply: ...\n"
            "Suggestion1: ...\n"
            "Suggestion2: ..."
        )

        response = co.chat(
            message=prompt,
            temperature=0.7,
            chat_history=[
                {"role": "CHATBOT", "message": "You are a helpful support assistant. Give one reply and two suggestions."}
            ]
        )

        text = response.text

        ai_reply = re.search(r"Reply:\s*(.*)", text)
        suggestion1 = re.search(r"Suggestion1:\s*(.*)", text)
        suggestion2 = re.search(r"Suggestion2:\s*(.*)", text)

        return [
            ai_reply.group(1).strip() if ai_reply else "Sorry, I cannot respond now.",
            suggestion1.group(1).strip() if suggestion1 else "Try asking something else.",
            suggestion2.group(1).strip() if suggestion2 else "Try asking something else.",
        ]

    except Exception as e:
        print("Error generating replies:", e)
        return [
            "Sorry, I cannot respond now.",
            "Try asking something else.",
            "Try asking something else."
        ]
