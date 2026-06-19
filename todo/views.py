from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # User sees their own tasks, but we can also filter by query params if needed
        return Task.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def shared(self, request):
        shared_tasks = Task.objects.filter(is_shared=True).order_by('-created_at')
        serializer = self.get_serializer(shared_tasks, many=True)
        return Response(serializer.data)
