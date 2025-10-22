from django.http import JsonResponse
from .models import Ticket  # Adjust model name if needed

def latest_ticket(request):
	latest = Ticket.objects.order_by('-id').first()
	if latest:
		return JsonResponse({
			'id': latest.id,
			'subject': getattr(latest, 'subject', None),
			'status': getattr(latest, 'status', None),
			'created_at': latest.created_at.isoformat() if hasattr(latest, 'created_at') else None
		})
	return JsonResponse({'id': None, 'subject': None, 'status': None, 'created_at': None})
from django.shortcuts import render

# Create your views here.
