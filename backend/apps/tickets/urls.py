from django.urls import path
from .views import latest_ticket, ticket_messages, ticket_suggestions

urlpatterns = [
    path('tickets/latest/', latest_ticket, name='latest_ticket'),
    path('tickets/<int:ticket_id>/messages/', ticket_messages, name='ticket_messages'),
    path('tickets/<int:ticket_id>/suggestions/', ticket_suggestions, name='ticket_suggestions'),
]
