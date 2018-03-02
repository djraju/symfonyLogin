<?php

namespace App\Services\Utilities;

use Doctrine\Common\Persistence\ObjectRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use App\Entity\User;
use App\Repository\UserRepository;

/**
 * Class BaseService
 */
abstract class BaseService
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
     * @return UserRepository|EntityRepository|ObjectRepository
     */
    protected function getUserRepo()
    {
        return $this->em->getRepository(User::NAME);
    }
}
