"""
URL configuration for techbuilder project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponseRedirect
from django.conf import settings
from django.conf.urls.static import static
from django.urls import re_path
from django.views.static import serve

urlpatterns = [
    # Redirect root to a useful API endpoint to avoid 404 confusion
    path('', lambda request: HttpResponseRedirect('/api/products/')),

    path('admin/', admin.site.urls),
    path('api/', include('product.urls')),
    path('api/', include('core.urls')),
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    # In production (e.g., on Render), explicitly serve media files from MEDIA_ROOT.
    # This is acceptable for small projects/demos; for large-scale apps, use a CDN or cloud storage.
    urlpatterns += [
        re_path(r'^media/(?P<path>.*)$', serve, { 'document_root': settings.MEDIA_ROOT }),
    ]
