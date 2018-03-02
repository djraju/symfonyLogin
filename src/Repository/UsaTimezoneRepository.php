<?php

/*
 * (c) Kinetxx Inc <admin@kinetxx.com>
 */
namespace App\Repository;

use App\Entity\UsaTimezone;
use Doctrine\ORM\EntityRepository;

/**
 * Class UsaTimezoneRepository
 */
class UsaTimezoneRepository extends EntityRepository
{
    /**
     * @return \Doctrine\ORM\QueryBuilder
     */
    public function getUsaTimezones()
    {
        $qb = $this->getEntityManager()
                   ->createQueryBuilder()
                   ->select('tz')
                   ->from(UsaTimezone::NAME, 'tz')
                   ->orderBy('tz.id', 'ASC');

        return $qb;
    }
}
