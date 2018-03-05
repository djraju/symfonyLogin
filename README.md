# symfonyLogin
This is a small application built in symfony 4.0.5 to create custom Authentication system using Guard.
This app stores the sessions in Database table "sessions". Password in "users" table is encrypted.

There are only 3 Entity's
1. Users
2. Roles
3. Sessions

Doctrine console commands to create DB, create tables and to load fixtures
1. php bin/console doctrine:database:create
2. php bin/console doctrine:schema:update --force
3. php bin/console hautelook:fixtures:load

Below are the credentials to login they are hardcoded so it does not matter what you add. 
ktx_support / password

Toggle session parameters in framework.yaml to see working/non-working behaviour

    session:
        #handler_id: ~
        handler_id: Symfony\Component\HttpFoundation\Session\Storage\Handler\PdoSessionHandler
