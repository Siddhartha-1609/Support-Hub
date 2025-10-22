import os
import django
import time

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.contrib.auth.models import User
from apps.tickets.models import Ticket
from apps.chat.models import Message
from apps.ai.tasks import generate_suggested_replies

user = User.objects.first()
if not user:
    user = User.objects.create(username="testuser", password="testpass")

ticket = Ticket.objects.create(title="Test Ticket")

msg = Message.objects.create(
    user=user,
    ticket=ticket,
    content="Hello, this is a test message"
)

print(f"Created message ID: {msg.id}")
print(f"Ticket metadata before task: {msg.ticket.metadata}")

generate_suggested_replies.delay(msg.id)
print("Task triggered... waiting for results (Celery worker must be running).")

time.sleep(5)

msg.refresh_from_db()
print(f"Ticket metadata after task: {msg.ticket.metadata}")
