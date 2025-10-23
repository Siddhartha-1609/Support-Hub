from django.db import models
from django.contrib.auth.models import User
from apps.tickets.models import Ticket

class Message(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
    content = models.TextField()
    is_agent = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username if self.user else 'Guest'}: {self.content[:20]}"


class Suggestion(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
    text = models.CharField(max_length=255)

    def __str__(self):
        return f"Ticket {self.ticket.id}: {self.text}"
