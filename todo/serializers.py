from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('id', 'title', 'description', 'is_completed', 'is_shared', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def create(self, validated_data):
        # Attach the user from request context
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)
