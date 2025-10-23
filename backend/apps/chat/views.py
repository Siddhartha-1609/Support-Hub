from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from apps.chat.models import Message, Suggestion
from apps.tickets.models import Ticket
from apps.ai.generator import suggest_replies

class MessagesListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, ticket_id):
        ticket = Ticket.objects.get(id=ticket_id)
        messages = Message.objects.filter(ticket=ticket).order_by("timestamp")
        suggestions = Suggestion.objects.filter(ticket=ticket).values_list("text", flat=True)

        data = {
            "messages": [
                {
                    "content": m.content,
                    "is_agent": m.is_agent,
                    "timestamp": m.timestamp,
                }
                for m in messages
            ],
            "suggestions": list(suggestions)
        }
        return Response(data)


class SendMessageView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, ticket_id):
        text = request.data.get("text")
        ticket = Ticket.objects.get(id=ticket_id)

        Message.objects.create(user=None, ticket=ticket, content=text, is_agent=False)

        ai_suggestions = suggest_replies(text)
        ai_reply = ai_suggestions[0]
        user_suggestions = ai_suggestions[1:]

        Message.objects.create(user=None, ticket=ticket, content=ai_reply, is_agent=True)

        Suggestion.objects.filter(ticket=ticket).delete()
        for s in user_suggestions:
            Suggestion.objects.create(ticket=ticket, text=s)

        return Response({
            "ai_reply": ai_reply,
            "suggestions": user_suggestions
        })
