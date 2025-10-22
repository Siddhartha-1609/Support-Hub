import cohere
from django.conf import settings

def suggest_replies(message):
    try:
        api_key = settings.COHERE_API_KEY
        print(f"[DEBUG] COHERE_API_KEY from settings: {api_key}")
        if not api_key:
            raise ValueError("Cohere API key is not configured. Please check your .env file and COHERE_API_KEY setting.")
        co = cohere.Client(api_key)
        response = co.chat(
            message=f"Customer said: {message}\nProvide exactly three short, helpful responses numbered 1, 2, 3.",
            temperature=0.7,
            chat_history=[
                {"role": "CHATBOT", "message": "I am a helpful support assistant. I will provide three concise, helpful responses numbered 1, 2, 3."}
            ]
        )
        text = response.text
        print("Raw Cohere response:", text)
        import re
        replies = re.findall(r'\d+\.\s*(.*?)(?=\d+\.|$)', text, re.DOTALL)
        replies = [reply.strip() for reply in replies if reply.strip()]
        print("Extracted replies:", replies)
        return replies[:3] if replies else ["Sorry, I couldn't generate suggestions right now."]
    except Exception as e:
        print("Error generating replies:", e)
        return ["Sorry, I couldn't generate suggestions right now."]
