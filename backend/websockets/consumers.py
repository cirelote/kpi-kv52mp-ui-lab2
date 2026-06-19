import json
import os
import redis
from channels.generic.websocket import AsyncWebsocketConsumer

# Connect to Redis to keep track of online users
redis_url = os.environ.get('REDIS_URL', 'redis://127.0.0.1:6379/0')
r = redis.Redis.from_url(redis_url, decode_responses=True)

class UserPresenceConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        if self.user.is_authenticated:
            self.room_group_name = 'admin_presence'
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()

            # Add user to Redis set of online users
            r.sadd('online_users', json.dumps({'id': self.user.id, 'email': self.user.email}))
            
            # Broadcast updated list
            await self.broadcast_online_users()
        else:
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name') and self.user.is_authenticated:
            # Remove user from Redis set
            r.srem('online_users', json.dumps({'id': self.user.id, 'email': self.user.email}))
            
            # Broadcast updated list
            await self.broadcast_online_users()

            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def broadcast_online_users(self):
        online_users_str = r.smembers('online_users')
        online_users = [json.loads(u) for u in online_users_str]
        
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'presence_update',
                'users': online_users
            }
        )

    async def presence_update(self, event):
        await self.send(text_data=json.dumps(event))

class SharedTasksConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        if self.user.is_authenticated:
            self.room_group_name = 'shared_tasks'
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def task_update(self, event):
        await self.send(text_data=json.dumps(event))
