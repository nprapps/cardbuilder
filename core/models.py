from django.db import models

class Category(models.Model):
    category_name = models.CharField(max_length=40)

    class Meta:
        verbose_name_plural = 'categories'

    def __str__(self):
        return self.category_name


class Card(models.Model):
    published = models.BooleanField(default=False)
    copyedited = models.BooleanField(default=False)
    title = models.CharField(max_length=75)
    slug = models.SlugField(max_length=75, null=True, blank=True)
    subtitle = models.CharField(max_length=75, null=True, blank=True)
    lede = models.CharField(max_length=100, null=True)
    body = models.TextField()
    image = models.ImageField(null=True, blank=True, upload_to='img/')
    image_credit = models.CharField(max_length=140, null=True, blank=True)
    production_notes = models.TextField(null=True, blank=True)
    category = models.ForeignKey(Category)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

