import app_config
import json
import os
import subprocess

from django.core import serializers
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Card, Category

@receiver(post_save, sender=Card)
def publish_json(sender, instance, **kwargs):
    if not instance.published or not instance.copyedited:
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