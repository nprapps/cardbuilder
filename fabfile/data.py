import app_config
import requests

from fabric.api import hide, local, settings, shell_env, task
from fabric.contrib import django
from fabric.state import env
from slugify import slugify
from time import sleep

# django setup
django.settings_module('config.settings')
import django
django.setup()
from core.models import Card

@task
def create_db():
    with settings(warn_only=True), hide('output', 'running'):
        if env.get('settings'):
            execute('servers.stop_service', 'uwsgi')

        with shell_env(**app_config.database):
            local('dropdb --if-exists %s' % app_config.database['PGDATABASE'])

        if not env.get('settings'):
            local('psql -c "DROP USER IF EXISTS %s;"' % app_config.database['PGUSER'])
            local('psql -c "CREATE USER %s WITH SUPERUSER PASSWORD \'%s\';"' % (app_config.database['PGUSER'], app_config.database['PGPASSWORD']))

        with shell_env(**app_config.database):
            local('createdb %s' % app_config.database['PGDATABASE'])

        if env.get('settings'):
            execute('servers.start_service', 'uwsgi')

@task
def screenshots():
    LAMBDA_URL = 'https://zy98z1okb0.execute-api.us-east-1.amazonaws.com/dev/chrome'

    for card in Card.objects.all():
        print('screenshoting {0}'.format(card.title))

        payload = {
            'id': card.id,
            'slug': slugify(card.title)
        }

        r = requests.get(LAMBDA_URL, params=payload)
        print(r.status_code)

        sleep(30)