from rest_framework import serializers
from .models import Compte, Etudiant, Professeur, Mention, Niveau, Cours, Notification
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import IsAuthenticated
from .models import ExplicationCours
from rest_framework import serializers
from .models import Mention, Niveau, Professeur, Cours
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import serializers
from .models import Favori
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CompteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Compte
        fields = ['id', 'username', 'email', 'password', 'role','photo']
        extra_kwargs = {'password': {'write_only': True},
                        'photo':{'required':False,'allow_null':True}
                        }

    def create(self, validated_data):
        validated_data['password']=make_password(validated_data['password'])
        return super().create(validated_data)
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['username'] = user.username
        token['email'] = user.email
        # Ajouter photo dans le token si besoin (optionnel)
        if user.photo:
            token['photo'] = user.photo.url
        return token

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        user = Compte.objects.filter(email=email).first()
        if user and user.check_password(password):
            attrs["username"] = user.username
            data = super().validate(attrs)
            # Ajouter les infos dans la réponse envoyée à React
            data['role'] = user.role
            data['username'] = user.username
            data['email'] = user.email
            # 🔹 Ajouter la photo
            if user.photo:
                data['photo'] = user.photo.url
            else:
                data['photo'] = None
            return data
        raise serializers.ValidationError("Email ou mot de passe incorrect.")



class MentionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mention
        fields = ['id', 'nom']


class NiveauSerializer(serializers.ModelSerializer):
    mention = MentionSerializer(read_only=True)

    class Meta:
        model = Niveau
        fields = ['id', 'nom', 'mention']


class ProfesseurSerializer(serializers.ModelSerializer):
    compte = CompteSerializer()  # affichera "Prénom Nom"

    class Meta:
        model = Professeur
        fields = ['id', 'compte', 'specialite']


class CoursSerializer(serializers.ModelSerializer):
    mention = MentionSerializer(read_only=True)
    niveau = NiveauSerializer(read_only=True)
    professeur = ProfesseurSerializer(read_only=True)

    mention_id = serializers.PrimaryKeyRelatedField(
        queryset=Mention.objects.all(), source='mention', write_only=True
    )
    niveau_id = serializers.PrimaryKeyRelatedField(
        queryset=Niveau.objects.all(), source='niveau', write_only=True
    )

    class Meta:
        model = Cours
        fields = [
            'id', 'titre', 'description',
            'mention', 'niveau', 'professeur',
            'mention_id', 'niveau_id',
            'date_debut', 'date_fin', 'fichier'
        ]
from .models import Exercice

class ExerciceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercice
        fields = "__all__"



class FavoriSerializer(serializers.ModelSerializer):
    cours = CoursSerializer()  # inclure les infos détaillées du cours
    class Meta:
        model = Favori
        fields = ['id', 'etudiant', 'cours', 'date_ajout']
from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    # Optionnel : afficher des infos du cours ou de l'étudiant
    cours_titre = serializers.CharField(source='cours.titre', read_only=True)
    etudiant_username = serializers.CharField(source='etudiant.compte.username', read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id',
            'etudiant',         # id de l'étudiant
            'etudiant_username',# nom utilisateur pour affichage
            'cours',            # id du cours
            'cours_titre',      # titre du cours pour affichage
            'message',
            'lu',
            'date',
        ]
        read_only_fields = ['id', 'date', 'etudiant_username', 'cours_titre']

class ExplicationCoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExplicationCours
        fields = "__all__"
