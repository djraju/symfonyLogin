<?php

/*
 * (c) Kinetxx Inc <admin@kinetxx.com>
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
     * @param string         $roleName
     * @param \DateTime|null $startTime
     * @param \DateTime|null $endTime
     *
     * @return int
     */
    public function getNumUsersByRole(string $roleName, ?\DateTime $startTime, ?\DateTime $endTime)
    {
        $query = $this->createQueryBuilder('u')
            ->select('count(u.id)')
            ->innerJoin('u.roles', 'r', 'WITH', 'r.name = :role')
            ->setParameter('role', $roleName);

        if ((!empty($startTime)) && (!empty($endTime))) {
            $query->where('u.dateJoined between :start and :end')
                ->setParameter('start', $startTime)
                ->setParameter('end', $endTime);
        }

        $finalQuery = $query->getQuery();

        try {
            $num = (int) $finalQuery->getSingleScalarResult();
        } catch (NonUniqueResultException $e) {
            $num = 0;
        }

        return $num;
    }

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
