from django.db import models

class Ticket(models.Model):
    title = models.CharField(max_length=255)
    metadata = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return self.title


class Message(models.Model):
    ticket = models.ForeignKey(
        Ticket,
        related_name='messages',
        on_delete=models.CASCADE
    )
    text = models.TextField()
    sender = models.CharField(max_length=50)  # e.g., "user" or "support"
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message #{self.id} ({self.sender})"
