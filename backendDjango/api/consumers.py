import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Notification, Etudiant
from .serializers import NotificationSerializer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        compte_id = self.scope['url_route']['kwargs'].get('compte_id')
        
        try:
            etu = await sync_to_async(Etudiant.objects.get)(compte_id=compte_id)
            self.etudiant_id = etu.id
        except Etudiant.DoesNotExist:
            await self.close()
            return

        self.room_group_name = f"notifications_{compte_id}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        # Envoyer les notifications existantes
        notifications = await sync_to_async(self.get_old_notifications)()
        await self.send(text_data=json.dumps({
            "type": "old_notifications",
            "data": notifications
        }))

        # Envoyer le nombre de notifications non lues
        unread_count = await sync_to_async(
            lambda: Notification.objects.filter(etudiant_id=self.etudiant_id, lu=False).count()
        )()
        await self.send(text_data=json.dumps({
            "type": "unread_count",
            "count": unread_count
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    def get_old_notifications(self):
        qs = Notification.objects.filter(etudiant_id=self.etudiant_id).order_by('-date')
        return NotificationSerializer(qs, many=True).data

    async def send_notification(self, event):
        # Recevoir la notification du signal
        await self.send(text_data=json.dumps({
            "type": "new_notification",
            "data": event.get("content")
        }))

        if "unread_count" in event:
            await self.send(text_data=json.dumps({
                "type": "unread_count",
                "count": event["unread_count"]
            }))


class CoursConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "cours"   # 🔥 NOM UNIQUE POUR TOUS

        # Ajout au groupe
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    # ------------------------------
    #   RÉCEPTION : NOUVEAU COURS
    # ------------------------------
    async def cours_nouveau(self, event):
        await self.send(text_data=json.dumps({
            "type": "new_cours",
            "data": event["cours"]
        }))

    # ------------------------------
    #   RÉCEPTION : SUPPRESSION COURS
    # ------------------------------
    async def delete_cours(self, event):
        await self.send(text_data=json.dumps({
            "type": "delete_cours",
            "cours_id": event["cours_id"]
        }))


