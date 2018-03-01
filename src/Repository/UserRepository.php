<?php

/**
 * Created by PhpStorm.
 * User: dhananjay
 * Date: 1/3/18
 * Time: 11:44 AM
 */
namespace App\Repository;

use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\NonUniqueResultException;

/**
 * Class    UserRepository
 */
class UserRepository extends EntityRepository
{
    /**
     * @param string $name
     *
     * @return array
     */
    public function getUsersByName(string $name)
    {
        $query = $this->createQueryBuilder('u')
                      ->select('u.id, u.firstName, u.lastName')
                      ->where('u.firstName like :name or u.lastName like :name')
                      ->setParameter('name', '%'.$name.'%');

        return $query->getQuery()->getResult();
    }
}
