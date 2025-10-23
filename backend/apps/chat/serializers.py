from rest_framework import serializers
from apps.chat.models import Message

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["id", "user", "ticket", "content", "is_agent", "timestamp"]
        read_only_fields = ["id", "user", "ticket", "is_agent", "timestamp"]
