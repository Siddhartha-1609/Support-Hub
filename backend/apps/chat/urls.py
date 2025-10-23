from django.urls import path
from .views import SendMessageView, MessagesListView

urlpatterns = [
    path("<int:ticket_id>/messages/", MessagesListView.as_view(), name="messages-list"),
    path("<int:ticket_id>/send/", SendMessageView.as_view(), name="send-message"),
]
