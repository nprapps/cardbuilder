import app_config
import json
import os
import subprocess

from django.core import serializers
from django.db.models.signals import post_save, m2m_changed, post_delete
from django.dispatch import receiver
from .models import Card, Author, Category

@receiver(post_save, sender=Card)
@receiver(m2m_changed, sender=Card.authors.through)
def publish_json(sender, instance, **kwargs):
    if not instance.published:
        return

    DEPLOYMENT_TARGET = os.environ.get('DEPLOYMENT_TARGET', None)

    if DEPLOYMENT_TARGET == 'production':
        S3_BUCKET = 'apps.npr.org'
    else:
        S3_BUCKET = 'stage-apps.npr.org'

    DATA_FILE = 'data/{0}.json'.format(instance.id)

    JSONSerializer = serializers.get_serializer('json')
    json_serializer = JSONSerializer()

    json_instance = json_serializer.serialize([instance])
    dict_instance = json.loads(json_instance)

    fields = dict_instance[0]['fields']

    author_instances = []
    for author in fields['authors']:
        author_obj = Author.objects.get(pk=author)
        author_json = json_serializer.serialize([author_obj])
        author_dict = json.loads(author_json)
        author_instances.append(author_dict[0]['fields'])
    fields['authors'] = author_instances

    category_obj = Category.objects.get(pk=fields['category'])
    category_json = json_serializer.serialize([category_obj])
    category_dict = json.loads(category_json)
    fields['category'] = category_dict[0]['fields']['category_name']
    
    with open(DATA_FILE, 'w') as f:
        json.dump(fields, f)

    s3_args = [
        'aws', 
        's3', 
        'cp', 
        DATA_FILE,
        's3://{0}/{1}/data/'.format(
            S3_BUCKET, 
            app_config.PROJECT_FILENAME
        ), 
        '--cache-control', 
        'max-age=30'
    ]

    if DEPLOYMENT_TARGET == 'production':
        s3_args.extend(['--acl', 'public-read'])

    subprocess.run(s3_args)