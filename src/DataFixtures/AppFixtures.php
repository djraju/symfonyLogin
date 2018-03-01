<?php
/**
 * Created by PhpStorm.
 * User: dhananjay
 * Date: 1/3/18
 * Time: 11:44 AM
 */

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;


class AppFixtures extends Fixture
{
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    public function load(ObjectManager $manager)
    {
        //Create 2 users
        for($i=1; $i<=2; $i++) {
            $user = new User();
            $user->setEmail('user'.$i.'@test.com');
            $user->setUsername('username'.$i);
            $password = $this->encoder->encodePassword($user, "password");
            $user->setPassword($password);
            $manager->persist($user);
        }

        $manager->flush();
    }
}