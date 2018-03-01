# symfonyLogin
This is a small application built in symfony 4.0.4 to create custom Authentication system using Guard. This app stores the sessions in Database table "sessions". Password in "users" table is encrypted.

There are only 2 Entity's
1. users
2. sessions

Doctrine console commands to create DB, create tables and to load fixtures
1. php bin/console doctrine:database:create
2. php bin/console doctrine:schema:update --force
3. php bin/console doctrine:fixtures:load

Fixtures class file : App\DataFixtures\AppFixtures.php
Below are the credentials to login. You can update these in AppFixtures.php
username1 / password
username2 / password
