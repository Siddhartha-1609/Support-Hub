from rest_framework.decorators import api_view
from rest_framework.response import Response
from apps.chat.models import Message
from apps.tickets.models import Ticket

@api_view(['GET'])
def get_suggestions(request, ticket_id):
    try:
        ticket = Ticket.objects.get(id=ticket_id)
        suggestions = ticket.metadata.get("suggestions", [])
        return Response({"suggestions": suggestions})
    except Ticket.DoesNotExist:
        return Response({"error": "Ticket not found"}, status=404)
