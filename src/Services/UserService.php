<?php

/**
 * Created by PhpStorm.
 * User: dhananjay
 * Date: 1/3/18
 * Time: 11:44 AM
 */
namespace App\Services;

use Doctrine\DBAL\DBALException;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * Class UserService
 */
class UserService
{
    /** @var PersistenceService $persistenceService */
    private $persistenceService;

    /** @var EntityManagerInterface $em */
    protected $em;

    /**
     * MAS TODO: Should we pass Services as required or to constructor?
     * UserService constructor.
     * @param EntityManagerInterface       $em
     * @param PersistenceService           $persistenceService
     */
    public function __construct(EntityManagerInterface $em, PersistenceService $persistenceService)
    {
       $this->persistenceService = $persistenceService;
       $this->em = $em;
    }

    /**
     * @return UserRepository|EntityRepository|ObjectRepository
     */
    protected function getUserRepo()
    {
        return $this->em->getRepository(User::NAME);
    }

    /**
     * @param string $id
     *
     * @return null|object|User
     */
    public function getUserById(string $id)
    {
        return $this->getUserRepo()->find($id);
    }

    /**
     * Return false if a user exists with the given username
     *        true if no user exists
     * @param string $username
     *
     * @return bool
     */
    public function isUsernameAvailable(string $username)
    {
        return $this->getUserByUsername($username) === null ? true : false;
    }

    /**
     * Return a User given username
     *
     * @param string $login
     *
     * @return null|object|User
     */
    public function getUserByUsername(string $login)
    {
        // lowercase for test
        $username = strtolower($login);

        return $this->getUserRepo()->findOneBy(array('username' => $username));
    }

    /**
     * @return string
     */
    public function getClassName()
    {
        return $this->getUserRepo()->getClassName();
    }


    /**
     * @param UserInterface                $user
     * @param UserPasswordEncoderInterface $encoder
     * @param string                       $plainPassword
     *
     * @throws AuthenticationException
     *
     * @return bool
     */
    public function checkCredentials(UserInterface $user, UserPasswordEncoderInterface $encoder, string $plainPassword)
    {
        if ($user instanceof User) {
            if (!$encoder->isPasswordValid($user, $plainPassword)) {
                throw new AuthenticationException('Invalid Credentials!!!');
            }

            return true;
        }

        return false;
    }
}
