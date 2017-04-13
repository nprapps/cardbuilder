import app_config 

from django.shortcuts import render
from .models import Card, Category

# Create your views here.
def index(request):
    context = build_context()
    context['grouped_cards'] = {}
    categories = Category.objects.all()

    for category in categories:
        cards = Card.objects.filter(category=category)
        context['grouped_cards'][category] = cards

    return render(request, 'index.html', context)


def build_context():
    config = {}

    # Only all-caps [constant] vars get included
    for k, v in app_config.__dict__.items():
        if k.upper() == k:
            config[k] = v

    return config