from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Ticket, Message

# Latest ticket
@api_view(['GET'])
def latest_ticket(request):
    latest = Ticket.objects.order_by('-id').first()
    if latest:
        return Response({
            'id': latest.id,
            'title': latest.title,
            'metadata': latest.metadata,
        })
    return Response({'id': None, 'title': None, 'metadata': None})

# Messages endpoint
@api_view(['GET', 'POST'])
def ticket_messages(request, ticket_id):
    if request.method == 'GET':
        messages = Message.objects.filter(ticket_id=ticket_id).order_by('created_at')
        data = [{"text": m.text, "sender": m.sender} for m in messages]
        return Response(data)

    if request.method == 'POST':
        text = request.data.get('text')
        if not text:
            return Response({"error": "Text required"}, status=400)
        Message.objects.create(ticket_id=ticket_id, text=text, sender="user")
        return Response({"status": "ok"})

# AI suggestions endpoint
@api_view(['GET'])
def ticket_suggestions(request, ticket_id):
    # Replace with real AI logic
    suggestions = [
        "Have you tried restarting the system?",
        "Please check your network connection.",
        "Can you provide more details about the issue?"
    ]
    return Response(suggestions)
