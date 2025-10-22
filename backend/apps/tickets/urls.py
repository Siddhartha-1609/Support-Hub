from django.urls import path
from .views import latest_ticket

urlpatterns = [
    path('api/tickets/latest', latest_ticket, name='latest_ticket'),
]
