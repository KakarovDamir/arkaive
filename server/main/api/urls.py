from django.urls import path
from api import views

urlpatterns = [
    path("healthcheck", views.healthcheck),
    path("upload", views.upload),
    path("restore", views.restore),
    # path("to_pdf", views.to_pdf),
    path("to_docx", views.to_docx),


    path("swap_auto_enchance", views.swap_auto_enchance),
    path("swap_hsv_adjustment", views.swap_hsv_adjustment),
]