
from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^screenshots/', views.screenshots, name='screenshots'),
    url(r'^deep-links/', views.deep_links, name='deep-links')

]