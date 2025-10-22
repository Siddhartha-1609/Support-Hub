from celery import shared_task
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from apps.chat.models import Message
from apps.ai.generator import suggest_replies

@shared_task
def generate_suggested_replies(message_id):
    msg = Message.objects.get(id=message_id)
    if not msg or msg.is_agent:
        return
    suggestions = suggest_replies(msg.content)
    msg.ticket.metadata = {"suggestions": suggestions}
    msg.ticket.save(update_fields=["metadata"])
    print("Message content:", msg.content)
    print("Suggestions:", suggestions)

    try:
        channel_layer = get_channel_layer()
        if channel_layer:
            async_to_sync(channel_layer.group_send)(
                f"ticket_{msg.ticket.id}",
                {
                    "type": "Chat_Message",
                    "message": {
                        "is_agent": True,
                        "message": f"Ai Suggestions: {', '.join(suggestions)}",
                        "ai_suggestions": suggestions,
                    }
                }
            )
    except Exception as e:
        print(f"Error sending to channel layer: {e}")
        # Continue execution even if channel layer fails
