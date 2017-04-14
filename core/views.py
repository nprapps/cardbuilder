import app_config 
import json

from django.core import serializers
from django.shortcuts import render
from .models import Card, Category

# Create your views here.
def index(request):
    JSONSerializer = serializers.get_serializer('json')
    json_serializer = JSONSerializer()

    context = build_context()
    context['grouped_cards'] = {}
    categories = Category.objects.all()

    for category in categories:
        cards = Card.objects.filter(category=category)
        cards_list = []
        for card in cards:
            card_obj = {}
            card_obj['id'] = card.id
            card_obj['title'] = card.title

            cards_list.append(card_obj)

        context['grouped_cards'][category.category_name] = cards_list

    return render(request, 'index.html', context)


def build_context():
    config = {}

    # Only all-caps [constant] vars get included
    for k, v in app_config.__dict__.items():
        if k.upper() == k:
            config[k] = v

    return config