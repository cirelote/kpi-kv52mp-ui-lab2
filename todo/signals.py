from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Task
from .serializers import TaskSerializer

@receiver(post_save, sender=Task)
def task_saved(sender, instance, created, **kwargs):
    if instance.is_shared:
        channel_layer = get_channel_layer()
        # Ensure we don't try to serialize nested objects without a proper serializer
        # But we can just use the serializer here
        serializer = TaskSerializer(instance)
        async_to_sync(channel_layer.group_send)(
            'shared_tasks',
            {
                'type': 'task_update',
                'action': 'create' if created else 'update',
                'task': serializer.data
            }
        )

@receiver(post_delete, sender=Task)
def task_deleted(sender, instance, **kwargs):
    if instance.is_shared:
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'shared_tasks',
            {
                'type': 'task_update',
                'action': 'delete',
                'task_id': instance.id
            }
        )
