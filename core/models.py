from django.db import models

class Author(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    author_title = models.CharField(max_length=100)
    author_image = models.URLField(null=True, blank=True)
    author_page = models.URLField(null=True, blank=True)

    def __str__(self):
        return '{0} {1}'.format(self.first_name, self.last_name)

class Category(models.Model):
    category_name = models.CharField(max_length=40)

    def __str__(self):
        return self.category_name


class Card(models.Model):
    published = models.BooleanField(default=False)
    title = models.CharField(max_length=100)
    body = models.TextField()
    image = models.URLField(null=True, blank=True)
    authors = models.ManyToManyField(Author)
    category = models.ForeignKey(Category)

    def __str__(self):
        return self.title

