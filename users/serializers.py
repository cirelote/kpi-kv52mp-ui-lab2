from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'name', 'gender', 'date_of_birth')
        read_only_fields = ('id', 'email')

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('id', 'email', 'name', 'gender', 'date_of_birth', 'password')
        extra_kwargs = {
            'email': {'required': True},
            'name': {'required': True},
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data['name'],
            gender=validated_data.get('gender', ''),
            date_of_birth=validated_data.get('date_of_birth', None)
        )
        return user
