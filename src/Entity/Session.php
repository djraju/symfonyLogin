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
class Session
{
    const NAME = 'App:Session';

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
     * @ORM\Column(type="blob", name="sess_data", nullable=true)
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

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getSessionId()
    {
        return $this->sessionId;
    }

    /**
     * @param string $sessionId
     */
    public function setSessionId(string $sessionId)
    {
        $this->userId = $sessionId;
    }

    /**
     * @return blob
     */
    public function getSessionData()
    {
        return $this->sessionData;
    }

    /**
     * @param blob $sessionData
     */
    public function setSessionData(string $sessionData)
    {
        $this->sessionData = $sessionData;
    }

    /**
     * @return int
     */
    public function getSessionTime()
    {
        return $this->sessionTime;
    }

    /**
     * @param int $sessionTime
     */
    public function setSessionTime(int $sessionTime)
    {
        $this->sessionTime = $sessionTime;
    }

    /**
     * @return int
     */
    public function getSessionLifetime()
    {
        return $this->sessionLifetime;
    }

    /**
     * @param int $sessionLifetime
     */
    public function setSessionLifetime(int $sessionLifetime)
    {
        $this->sessionLifetime = $sessionLifetime;
    }
}
