from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Cours, Compte
from .serializers import CoursSerializer, CompteSerializer, MyTokenObtainPairSerializer,ExplicationCoursSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from rest_framework.exceptions import PermissionDenied
from rest_framework import generics, permissions
from .models import Favori,ExplicationCours
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .serializers import FavoriSerializer
from rest_framework.exceptions import PermissionDenied
from django.http import FileResponse, Http404
import os
from rest_framework.permissions import IsAuthenticated
import json
import re
from rest_framework import viewsets
from .models import Exercice
from .serializers import ExerciceSerializer
from rest_framework.permissions import IsAuthenticated
#groq pour IA quiz
from groq import Groq
from rest_framework import status
from .models import ConversationSession
from .models import Mention, Niveau, Professeur, Cours
from .serializers import MentionSerializer, NiveauSerializer, ProfesseurSerializer, CoursSerializer
from .models import MessageAI, ConversationSession
import uuid
from django.core.exceptions import PermissionDenied
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Notification, Etudiant
from .serializers import NotificationSerializer
# 🔹 Création de compte
class CreerCompter(generics.CreateAPIView):
    queryset = Compte.objects.all()
    serializer_class = CompteSerializer

# 🔹 Login JWT
class CompteTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# 🔹 Liste des cours
class MesCoursView(generics.ListAPIView):
    serializer_class = CoursSerializer
    #permission_classes = [permissions.IsAuthenticated]

# 🔹 Liste Mentions
class MentionListView(generics.ListAPIView):
    queryset = Mention.objects.all()
    serializer_class = MentionSerializer
    permission_classes = [permissions.IsAuthenticated]

# 🔹 Liste Niveaux
class NiveauListView(generics.ListAPIView):
    queryset = Niveau.objects.select_related('mention').all()
    serializer_class = NiveauSerializer
    permission_classes = [permissions.IsAuthenticated]

# 🔹 Liste Professeurs
class ProfesseurListView(generics.ListAPIView):
    queryset = Professeur.objects.select_related('compte').all()
    serializer_class = ProfesseurSerializer
    permission_classes = [permissions.IsAuthenticated]
# 🔹 Liste et création de cours (professeurs voient leurs cours, étudiants voient les cours de leur mention/niveau  )
class CoursListCreateView(generics.ListCreateAPIView):
    serializer_class = CoursSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # ✅ Si l'utilisateur est un professeur connecté
        if hasattr(user, 'professeur'):
            return Cours.objects.filter(professeur=user.professeur).select_related('mention', 'niveau', 'professeur')
        if hasattr(user, 'etudiant'):
            etu = user.etudiant
            return Cours.objects.filter(mention=etu.mention,niveau=etu.niveau).select_related('mention', 'niveau', 'professeur')
        return Cours.objects.none()

    def perform_create(self, serializer):
     user = self.request.user
     if hasattr(user, 'professeur'):
        cours = serializer.save(professeur=user.professeur)
        
        # ⚡ Notification temps réel via WebSocket
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "cours",
            {
                "type": "cours.nouveau",
                "cours": CoursSerializer(cours).data
            }
        )
     else:
        raise PermissionDenied("Seuls les professeurs peuvent créer un cours.")

#suppression d'un cours
class CoursDeleteView(generics.RetrieveDestroyAPIView):
    queryset = Cours.objects.all()
    serializer_class = CoursSerializer
    permission_classes = [permissions.IsAuthenticated]
class CoursDeleteView(generics.RetrieveDestroyAPIView):
    queryset = Cours.objects.all()
    serializer_class = CoursSerializer
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        cours = self.get_object()
        cours_id = cours.id

        # Sécurité (professeur)
        if hasattr(request.user, "professeur"):
            if cours.professeur != request.user.professeur:
                raise PermissionDenied("Vous ne pouvez supprimer que vos propres cours.")

        channel_layer = get_channel_layer()

        # 🔥 1. Notifier les étudiants que le cours est supprimé (coursConsumer)
        async_to_sync(channel_layer.group_send)(
            "cours",
            {
                "type": "delete_cours",
                "cours_id": cours_id,
            }
        )

        # 🔥 2. Supprimer toutes les notifications liées à ce cours
        etudiants = Etudiant.objects.filter(
            mention=cours.mention,
            niveau=cours.niveau
        )

        for etu in etudiants:
            Notification.objects.filter(etudiant=etu, cours=cours).delete()

            # 🔥 3. Envoyer le compteur mis à jour
            unread_count = Notification.objects.filter(
                etudiant=etu, lu=False
            ).count()

            async_to_sync(channel_layer.group_send)(
                f"notifications_{etu.compte.id}",
                {
                    "type": "send_notification",
                    "content": None,  # Pas de nouvelle notification, juste update du compteur
                    "unread_count": unread_count
                }
            )

        return super().delete(request, *args, **kwargs)
# 🔹 CRUD Exercices liés à un cours
class ExerciceViewSet(viewsets.ModelViewSet):
    queryset = Exercice.objects.all()
    serializer_class = ExerciceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        cours_id = self.request.query_params.get("cours_id")
        if cours_id:
            return Exercice.objects.filter(cours_id=cours_id)
        return Exercice.objects.all()
    # 🔹 CRUD Explications liées à un cours
class ExplicationCoursViewSet(viewsets.ModelViewSet):
    queryset = ExplicationCours.objects.all()
    serializer_class = ExplicationCoursSerializer
    #permission_classes = [IsAuthenticated]
class CoursUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Cours.objects.all()
    serializer_class = CoursSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        cours = self.get_object()

        # 🔐 Sécurité : un professeur ne peut modifier que ses propres cours
        if hasattr(request.user, 'professeur'):
            if cours.professeur != request.user.professeur:
                raise PermissionDenied("Vous ne pouvez modifier que vos propres cours.")

        return super().update(request, *args, **kwargs)

# 🔹 Affichage d'un PDF lié à un cours
def media_pdf_view(request, pk):
    try:
        cours = Cours.objects.get(pk=pk)
        if not cours.fichier:
            raise Http404("Aucun fichier trouvé.")
        filepath = cours.fichier.path
        filename = os.path.basename(filepath)
        response = FileResponse(open(filepath, 'rb'), content_type='application/pdf')
        response['Content-Disposition'] = f'inline; filename="{filename}"' # ✅ affichage direct
        return response
    except Cours.DoesNotExist:
        raise Http404("Cours introuvable.")
    
# Ajouter un cours aux favoris
class FavoriCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        if not hasattr(user, 'etudiant'):
            return Response({"detail": "Seuls les étudiants peuvent ajouter des favoris."}, status=status.HTTP_403_FORBIDDEN)

        cours_id = request.data.get('cours')
        if not cours_id:
            return Response({"detail": "L'ID du cours est requis."}, status=status.HTTP_400_BAD_REQUEST)

        from .models import Cours
        try:
            cours = Cours.objects.get(pk=cours_id)
        except Cours.DoesNotExist:
            return Response({"detail": "Cours introuvable."}, status=status.HTTP_404_NOT_FOUND)

        favori, created = Favori.objects.get_or_create(etudiant=user.etudiant, cours=cours)
        if not created:
            return Response({"detail": "Le cours est déjà en favori."}, status=status.HTTP_200_OK)

        serializer = FavoriSerializer(favori)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
# Retirer un cours des favoris
class FavoriDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, cours_id, *args, **kwargs):
        user = request.user
        if not hasattr(user, 'etudiant'):
            return Response({"detail": "Seuls les étudiants peuvent retirer des favoris."}, status=status.HTTP_403_FORBIDDEN)

        try:
            favori = Favori.objects.get(etudiant=user.etudiant, cours_id=cours_id)
            favori.delete()
            return Response({"detail": "Favori supprimé."}, status=status.HTTP_200_OK)
        except Favori.DoesNotExist:
            return Response({"detail": "Ce cours n'est pas dans vos favoris."}, status=status.HTTP_404_NOT_FOUND)

# Lister les favoris d'un étudiant
class FavoriListView(generics.ListAPIView):
    serializer_class = FavoriSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'etudiant'):
            return Favori.objects.filter(etudiant=user.etudiant).select_related('cours')
        return Favori.objects.none()

client = Groq(api_key= os.getenv("GROQ_API_KEY"))
# 🔹 Génération de quiz IA à partir d'un cours
class GenerateQuizIAFree(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cours_id = request.data.get("cours_id")
        try:
            cours = Cours.objects.get(id=cours_id)
        except Cours.DoesNotExist:
            return Response({"error": "Cours introuvable"}, status=404)

        texte_base = f"{cours.titre}\n\n{cours.description or ''}"
        prompt = f""" Tu es un expert en création de quiz pédagogiques. Crée un quiz basé sur le texte suivant : {texte_base} ✅ Requis : - Minimum 3 questions, maximum 5. - Questions de type QCM, vrai/faux ou texte à trous. - Format JSON strict : {{ "qcm": [{{ "question": "...", "options": ["A","B","C","D"], "answer": "..." }}], "vrai_faux": [{{ "statement": "...", "answer": true }}], "textes_trous": [{{ "phrase": "...", "answer": "..." }}] }} Réponds uniquement en JSON, **sans aucun texte supplémentaire**. """

        try:
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2
            )
            raw_content = getattr(response.choices[0].message, "content", "").strip()
            print("Contenu brut IA :", raw_content) # 🔹 pour debug
            # Extraire JSON du texte brut
            match = re.search(r'(\{.*\})', raw_content, re.DOTALL)
            if not match:
                raise ValueError("Pas de JSON détecté dans la réponse IA")
            quiz_json = match.group(1)
            quiz = json.loads(quiz_json)
        except (json.JSONDecodeError, ValueError) as e:
            return Response({
                "error": "IA n'a pas généré de JSON valide",
                "raw": raw_content
            }, status=500)
        except Exception as e:
            return Response({"error": f"Erreur IA : {str(e)}"}, status=500)

        # Vérifier le nombre de questions
        total_questions = len(quiz.get("qcm", [])) + len(quiz.get("vrai_faux", [])) + len(quiz.get("textes_trous", []))
        if total_questions < 3:
            return Response({
                "error": "IA n'a pas généré assez de questions (minimum 3).",
                "quiz": quiz
            }, status=500)

        return Response({"quiz": quiz, "warning": False}, status=200)

# 🔵 CHAT AI VIEW
class ChatAIView(APIView):
    def post(self, request):
        user = request.user

        if not hasattr(user, "etudiant"):
            return Response({"error": "Utilisateur non autorisé"}, status=403)

        etudiant = user.etudiant
        user_message = request.data.get("message")
        session_id = request.data.get("session_id")

        # Création session
        if not session_id:
            session_id = str(uuid.uuid4())
            session = ConversationSession.objects.create(
                session_id=session_id,
                owner=etudiant
            )
        else:
            session, _ = ConversationSession.objects.get_or_create(
                session_id=session_id,
                owner=etudiant
            )

        # Titre automatique
        if session.title == "Nouvelle discussion":
            session.title = user_message[:40]
            session.save()

        # Sauvegarder message utilisateur
        MessageAI.objects.create(
            session=session,
            sender="user",
            content=user_message
        )

        try:
            client = Groq(api_key=os.getenv("GROQ_API_KEY"))

            # Historique
            history = MessageAI.objects.filter(session=session).order_by("timestamp")

            messages = [
                {
                    "role": "user" if m.sender == "user" else "assistant",
                    "content": m.content
                }
                for m in history
            ]

            # Appel Groq
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {
                        "role": "system",
                        "content": "Tu es un assistant pédagogique utile pour les étudiants."
                    },
                    *messages
                ],
                temperature=0.7
            )

            bot_reply = response.choices[0].message.content

            # Sauvegarder réponse IA
            MessageAI.objects.create(
                session=session,
                sender="assistant",
                content=bot_reply
            )

            return Response({
                "reply": bot_reply,
                "session_id": session.session_id,
                "title": session.title,
            })

        except Exception as e:
            print("❌ ERREUR GROQ :", e)
            return Response({"error": str(e)}, status=500)
# 🔵 LISTE SESSIONS (historique)
class ChatSessionsView(APIView):
    def get(self, request):
        user = request.user
        if not hasattr(user, "etudiant"):
            return Response({"error": "Utilisateur non autorisé"}, status=403)
        etudiant = user.etudiant

        sessions = ConversationSession.objects.filter(owner=etudiant).order_by("-created_at")
        data = [
            {
                "session_id": s.session_id,
                "title": s.title,
                "messages": s.messages.count()
            } for s in sessions
        ]
        return Response(data)

# 🔵 LISTE DES MESSAGES d’une session
class ChatMessagesView(APIView):
    def get(self, request, session_id):
        user = request.user
        if not hasattr(user, "etudiant"):
            return Response({"error": "Utilisateur non autorisé"}, status=403)
        etudiant = user.etudiant

        try:
            session = ConversationSession.objects.get(session_id=session_id, owner=etudiant)
        except ConversationSession.DoesNotExist:
            return Response({"error": "Session introuvable"}, status=404)

        messages = session.messages.order_by("timestamp")
        return Response([
            {
                "id": m.id,
                "sender": m.sender,
                "content": m.content,
            } for m in messages
        ])
# 🔵 SUPPRIMER UNE SESSION
class ChatSessionDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, session_id, *args, **kwargs):
        user = request.user
        if not hasattr(user, "etudiant"):
            return Response({"error": "Utilisateur non autorisé"}, status=403)
        try:
            session = ConversationSession.objects.get(session_id=session_id, owner=user.etudiant)
            session.delete()
            return Response({"detail": "Session supprimée."}, status=status.HTTP_200_OK)
        except ConversationSession.DoesNotExist:
            return Response({"error": "Session introuvable"}, status=status.HTTP_404_NOT_FOUND)
# 🔹 Mise à jour du profil (étudiant ou professeur)
class UpdateProfileView(generics.UpdateAPIView):
    serializer_class = CompteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get_serializer(self, *args, **kwargs):
        kwargs['partial'] = True # <-- permet update partiel
        return super().get_serializer(*args, **kwargs)

# Endpoint pour récupérer les notifications d'un étudiant
@api_view(['GET'])
def get_notifications(request):
    user_id = request.user.id
    try:
        etudiant = Etudiant.objects.get(compte_id=user_id)
        notifications = Notification.objects.filter(etudiant=etudiant).order_by('-date')
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)
    except Etudiant.DoesNotExist:
        return Response([])
    #detail d'un cours avec explications et exercices associés
class CoursDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            cours = Cours.objects.get(pk=pk)
        except Cours.DoesNotExist:
            return Response({"error": "Cours introuvable"}, status=404)

        # Récupération des explications du cours
        explications = ExplicationCours.objects.filter(cours=cours)

        # Récupération des exercices du cours
        exercices = Exercice.objects.filter(cours=cours)

        return Response({
            "cours": CoursSerializer(cours).data,
            "explications": ExplicationCoursSerializer(explications, many=True).data,
            "exercices": ExerciceSerializer(exercices, many=True).data,
        })

