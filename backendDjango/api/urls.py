from django.urls import path,include
from .views import (
    CreerCompter,
    ChatAIView,
    ChatSessionsView,
    ChatMessagesView,
    ChatSessionDeleteView,
    CompteTokenObtainPairView,
    MesCoursView,
    CoursDeleteView,
    ExplicationCoursViewSet,
    CoursUpdateView,
    GenerateQuizIAFree,
    ExerciceViewSet,
    CoursDetailView,
    MentionListView,
    NiveauListView,
    ProfesseurListView,
    CoursListCreateView,
    media_pdf_view,
    FavoriCreateView,
    FavoriListView,
    FavoriDeleteView,
    UpdateProfileView,       # <-- import pour modification de compte
    get_notifications        # <-- import pour notifications
)
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
router = DefaultRouter()
router.register(r"exercices", ExerciceViewSet, basename="exercice")
router.register("explications", ExplicationCoursViewSet)


urlpatterns = [
    # 🔹 Chat AI
    path("ai/chat/", ChatAIView.as_view(), name="ai-chat"),
    path("ai/sessions/", ChatSessionsView.as_view()),
    path("ai/messages/<str:session_id>/", ChatMessagesView.as_view()),
    path("ai/sessions/<str:session_id>/delete/", ChatSessionDeleteView.as_view(), name="chat-session-delete"),

    # 🔹 Auth
    path('creercompte/', CreerCompter.as_view(), name='creer'),
    path('login/', CompteTokenObtainPairView.as_view(), name='login'),
    path('profile/update/', UpdateProfileView.as_view(), name='update-profile'),  # <-- modification de compte

    # 🔹 Cours et contenu
    path('mes-cours/', MesCoursView.as_view(), name='mes-cours'),
    path("delete/<int:pk>/", CoursDeleteView.as_view()),
    path('updated/<int:pk>/', CoursUpdateView.as_view(), name='cours-update'),  # <-- modification
    path('mentions/', MentionListView.as_view(), name='mentions-list'),
    path('niveaux/', NiveauListView.as_view(), name='niveaux-list'),
    path('professeurs/', ProfesseurListView.as_view(), name='professeurs-list'),
    path('cours/', CoursListCreateView.as_view(), name='cours-list-create'),
    path('pdf/<int:pk>/', media_pdf_view, name='media-pdf'),
    path("cours/<int:pk>/detail/", CoursDetailView.as_view()),


    # 🔹 Favoris
    path('favoris/', FavoriListView.as_view(), name='favoris-list'),
    path('favori/<int:cours_id>/', FavoriDeleteView.as_view(), name="favori-delete"),
    path('favori/', FavoriCreateView.as_view(), name='favori-create'),

    # 🔹 Quiz IA
    path("generate-quiz-ia-free/", GenerateQuizIAFree.as_view(), name="generate-quiz-ia-free"),

    # 🔹 Notifications
    path("notifications/", get_notifications, name="get-notifications"),  # <-- notifications
    path("", include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
