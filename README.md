Copyright 2017 NPR.  All rights reserved.  No part of these materials may be reproduced, modified, stored in a retrieval system, or retransmitted, in any form or by any means, electronic, mechanical or otherwise, without prior written permission from NPR.

(Want to use this code? Send an email to nprapps@npr.org!)


cardbuilder
========================

* [What is this?](#what-is-this)
* [Assumptions](#assumptions)
* [What's in here?](#whats-in-here)
* [Bootstrap the project](#bootstrap-the-project)
* [Hide project secrets](#hide-project-secrets)
* [Run the project](#run-the-project)
* [Deploy to EC2](#deploy-to-ec2)
* [Install cron jobs](#install-cron-jobs)
* [Install web services](#install-web-services)
* [Run a remote fab command](#run-a-remote-fab-command)

What is this?
-------------

Cardbuilder is a Django-based application for authoring cards and creating embeddable stacks related to the Russia investigation for use on npr.org. 

Assumptions
-----------

The following things are assumed to be true in this documentation.

* You are running OSX.
* You are using Python 3.
* You have [virtualenv](https://pypi.python.org/pypi/virtualenv) and [virtualenvwrapper](https://pypi.python.org/pypi/virtualenvwrapper) installed and working.
* You have PostgreSQL installed and working.
* You have NPR's AWS credentials stored as environment variables locally.

For more details on the technology stack used with the app-template, see our [development environment blog post](http://blog.apps.npr.org/2013/06/06/how-to-setup-a-developers-environment.html).

What's in here?
---------------

The project contains the following folders and important files:

- `assets`: Front-end assets for the Django views. These are compiled through Webpack.
- `config`: Django project configuration
- `confs`: Server configuration files (nginx, uwsgi, etc)
- `core`: Django application
- `data`: Stub folder for output of JSON for cards locally
- `fabfile`: Fabric commands for server management
- `webpack`: Webpack configuration
- `.babelrc`: Configuration for Babel transpilation, used by Webpack
- `app_config.py`: General application configuration
- `crontab`: Default crontab, not in use for this app
- `manage.py`: Default Django management file
- `package.json`: Node requirements
- `README.md`: General documentation
- `requirements.txt`: Python requirements
- `run_on_server.sh`: Bash file used to run Fabric commands on the server, invoked by `fab servers.fabcast`.

Bootstrap the project
---------------------

```
cd cardbuilder
mkvirtualenv -p `which python3` cardbuilder
pip install -r requirements.txt
npm install
fab django.setup_django
```

You will need the project's secret key. If you're at NPR, hopefully the person who setup this project put it in our shared env!

Hide project secrets
--------------------

Project secrets should **never** be stored in ``app_config.py`` or anywhere else in the repository. They will be leaked to the client if you do. Instead, always store passwords, keys, etc. in environment variables and document that they are needed here in the README.

Any environment variable that starts with ``$PROJECT_SLUG_`` will be automatically loaded when ``app_config.get_secrets()`` is called.

Run the project
---------------

A flask app is used to run the project locally. It will automatically recompile templates and assets on demand.

```
workon $PROJECT_SLUG
fab app
```

Visit [localhost:8000](http://localhost:8000) in your browser.

Deploy to EC2
-------------

To deploy this project to EC2, first, make sure the IP addresses or hostnames are configured in `app_config.py` under the variables `PRODUCTION_SERVERS` and `STAGING_SERVERS`. Also ensure that, on the servers you are deploying to, you have installed Python 3, upstart, nginx, uWSGI, and PostgreSQL.

Then, run `fab staging master servers.setup` to deploy to staging. This will setup the clone the repo, setup the virtual environment, and do other miscellaneous housekeeping.

Once the server is correctly setup, you can run `fab staging master deploy_server` to checkout the latest from the repo and restart uWSGI. 

Install web services
---------------------

Web services are configured in the `confs/` folder.

To check that these files are being properly rendered, you can render them locally and see the results in the `confs/rendered/` directory.

```
fab servers.render_confs
```

Deploy the configuration files by running:

```
fab servers.deploy_confs
```

Run a remote fab command
-------------------------

Sometimes it makes sense to run a fabric command on the server, for instance, when you need to render using a production database. You can do this with the `fabcast` fabric command. For example:

```
fab staging master servers.fabcast:deploy
```

If any of the commands you run themselves require executing on the server, the server will SSH into itself to run them.

Models
------
The core app only has two models:

- Category: