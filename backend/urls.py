from django.contrib import admin
from django.urls import path, include
from django.views.generic.base import RedirectView
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView

urlpatterns = [
    path('favicon.ico', RedirectView.as_view(url='/static/favicon/favicon.ico', permanent=True)),
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/tasks/', include('todo.urls')),
    path('api/about/', include('about.urls')),
    
    # ReDoc docs
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
