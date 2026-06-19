from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

class AboutView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        data = {
            "app_name": "To-Do",
            "description": "Це зручний додаток для керування вашими справами. Створений в рамках лабораторної роботи.",
            "logo_url": request.build_absolute_uri('/static/favicon/android-chrome-512x512.png')
        }
        return Response(data)
