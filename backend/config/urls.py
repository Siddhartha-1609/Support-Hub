from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.tickets.urls')),
    path('api/chat/', include('apps.chat.urls')),
]
