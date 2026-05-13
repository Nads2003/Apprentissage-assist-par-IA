# api/routing.py
from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("ws/notifications/<int:compte_id>/", consumers.NotificationConsumer.as_asgi()),
    path("ws/cours/", consumers.CoursConsumer.as_asgi()),  # <-- corrige ici
]
