import django
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from apps.tickets.models import Ticket
from apps.chat.models import Message
from django.contrib.auth.models import User

user = User.objects.first()
if not user:
    user = User.objects.create(username="testuser", password="testpass")

ticket = Ticket.objects.create(title="Test Ticket")

msg = Message.objects.create(
    user=user,
    ticket=ticket,
    content="Hello, this is a test message"
)

print(msg.ticket)
print(msg.ticket.metadata)
