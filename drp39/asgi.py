"""
ASGI config for drp39 project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'drp39.settings')

django_asi_app = get_asgi_application()

from patientoncall_api.routing import *

application = ProtocolTypeRouter({
    "http": django_asi_app,
    "websocket":
      AuthMiddlewareStack(URLRouter(websocket_urlpatterns))
})
