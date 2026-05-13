from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Cours, Notification, Etudiant
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
@receiver(post_save, sender=Cours)
def create_notifications_for_students(sender, instance, created, **kwargs):
    if not created:
        return

    etudiants = Etudiant.objects.filter(
        mention=instance.mention,
        niveau=instance.niveau
    )
    
    print("⚡ Signal déclenché, étudiants concernés:", list(etudiants))

    channel_layer = get_channel_layer()

    for etu in etudiants:
        # Vérifier si une notification existe déjà pour ce cours et cet étudiant
        notif_exists = Notification.objects.filter(etudiant=etu, cours=instance).exists()
        if notif_exists:
            continue

        notif = Notification.objects.create(
            etudiant=etu,
            cours=instance,
            message=f"Nouveau cours ajouté : {instance.titre} par {instance.professeur.compte.username}"
        )
        print("✅ Notification créée:", notif)

        unread_count = Notification.objects.filter(etudiant=etu, lu=False).count()

        async_to_sync(channel_layer.group_send)(
            f"notifications_{etu.compte.id}",
            {
                "type": "send_notification",
                "content": {
                    "id": notif.id,
                    "message": notif.message,
                    "cours_titre": instance.titre,
                    "date": str(notif.date),
                    "lu": notif.lu
                },
                "unread_count": unread_count
            }
        )
        print(f"🚀 Notification envoyée au groupe notifications_{etu.compte.id}")