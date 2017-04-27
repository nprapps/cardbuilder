from .models import Card, Category
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
        fields = ['published', 'copyedited', 'title', 'subtitle', 'image', 'image_credit', 'category', 'body', 'production_notes']
        widgets = {
            'body': RedactorEditor()
        }

class CardAdmin(admin.ModelAdmin):
    form = CardAdminForm

    list_display = ('title', 'category', 'copyedited', 'published')

admin.site.register(Card, CardAdmin)
admin.site.register(Category, CategoryAdmin)