<?php

/*
 * (c) Kinetxx Inc <admin@kinetxx.com>
 */
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="sessions")
 * @ORM\Entity
 */
class SessionTable
{
    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=128, name="sess_id", nullable=false)
     */
    private $sessionId;

    /**
     * @ORM\Column(type="blob", name="sess_data", nullable=false)
     */
    private $sessionData;

    /**
     * @ORM\Column(type="integer", name="sess_time", nullable=false)
     */
    private $sessionTime;

    /**
     * @ORM\Column(type="integer", name="sess_lifetime", nullable=false)
     */
    private $sessionLifetime;
}
