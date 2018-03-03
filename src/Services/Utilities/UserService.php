<?php

/*
 * (c) Kinetxx Inc <admin@kinetxx.com>
 */
namespace App\Services\Utilities;

use App\Entity\User;
use Doctrine\Common\Persistence\ObjectRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;

/**
 * Class UserService
 */
class UserService
{
    protected $em;

    /**
     * @param EntityManagerInterface $em
     */
    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * @return EntityRepository|ObjectRepository
     */
    protected function getUserRepo()
    {
        return $this->em->getRepository(User::NAME);
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
     * @param string $id
     *
     * @return null|object|User
     */
    public function getUserById(string $id)
    {
        return $this->getUserRepo()->find($id);
    }
}
