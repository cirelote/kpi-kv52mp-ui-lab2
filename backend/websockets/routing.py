from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/presence/', consumers.UserPresenceConsumer.as_asgi()),
    path('ws/shared_tasks/', consumers.SharedTasksConsumer.as_asgi()),
]
