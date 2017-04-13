from .models import Author, Card
from django import forms
from django.contrib import admin
from django.utils.html import escape
from redactor.widgets import RedactorEditor

class AuthorAdmin(admin.ModelAdmin):
    ordering = ('first_name',)

class CardAdminForm(forms.ModelForm):
    class Meta:
        model = Card
        fields = ['published', 'authors', 'title', 'image', 'category', 'body']
        widgets = {
            'body': RedactorEditor()
        }

class CardAdmin(admin.ModelAdmin):
    form = CardAdminForm

    list_display = ('title', 'get_authors', 'category', 'published')

    def get_authors(self, obj):
        return "\n".join([a for a in obj.authors.all()])
    get_authors.short_description = 'Authors'

admin.site.register(Card, CardAdmin)
admin.site.register(Author, AuthorAdmin)