from .models import Author, Card, Category
from django import forms
from django.contrib import admin
from django.utils.html import escape
from redactor.widgets import RedactorEditor

class CategoryAdmin(admin.ModelAdmin):
    ordering = ('category_name',)

class AuthorAdmin(admin.ModelAdmin):
    ordering = ('first_name',)

class CardAdminForm(forms.ModelForm):
    class Meta:
        model = Card
        fields = ['published', 'authors', 'title', 'subtitle', 'image', 'category', 'body']
        widgets = {
            'body': RedactorEditor()
        }

class CardAdmin(admin.ModelAdmin):
    form = CardAdminForm

    list_display = ('title', 'get_authors', 'category', 'published')

    def get_authors(self, obj):
        return ", ".join(['{0} {1}'.format(a.first_name, a.last_name) for a in obj.authors.all()])
    get_authors.short_description = 'Authors'

admin.site.register(Card, CardAdmin)
admin.site.register(Author, AuthorAdmin)
admin.site.register(Category, CategoryAdmin)