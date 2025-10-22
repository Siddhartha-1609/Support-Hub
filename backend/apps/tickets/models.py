from django.db import models

class Ticket(models.Model):
    title = models.CharField(max_length=255)
    metadata = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return self.title
