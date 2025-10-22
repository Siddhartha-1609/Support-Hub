from django.urls import path
from .views import get_suggestions

urlpatterns = [
    path('suggestions/<int:ticket_id>/', get_suggestions, name='get_suggestions'),
]
