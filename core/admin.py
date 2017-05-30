from .models import Card, Category
from django import forms
from django.contrib import admin
from django.utils.html import escape
from redactor.widgets import RedactorEditor

class CategoryAdmin(admin.ModelAdmin):
    ordering = ('category_name',)
    prepopulated_fields = { 'slug': ('category_name',) }

class AuthorAdmin(admin.ModelAdmin):
    ordering = ('first_name',)

class CardAdminForm(forms.ModelForm):
    class Meta:
        model = Card
        fields = ['published', 'copyedited', 'title', 'slug', 'subtitle', 'lede', 'image', 'image_credit', 'category', 'body', 'production_notes']
        widgets = {
            'body': RedactorEditor()
        }

    def clean(self):
        cleaned_data = super(CardAdminForm, self).clean()
        image = cleaned_data.get('image')
        image_credit = cleaned_data.get('image_credit')

        if image and not image_credit:
            raise forms.ValidationError(
                "Cards with images must include an image credit."
            )

class CardAdmin(admin.ModelAdmin):
    form = CardAdminForm
    prepopulated_fields = { 'slug': ('title',) }
    list_display = ('title', 'category', 'copyedited', 'published')

admin.site.register(Card, CardAdmin)
admin.site.register(Category, CategoryAdmin)