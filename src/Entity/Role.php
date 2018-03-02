<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="roles")
 * @ORM\Entity
 */
class Role extends AbstractKinetxxEntity
{
    const NAME = 'App:Role';
    const ADMIN = 'ROLE_ADMIN';
    const PROVIDER = 'ROLE_PROVIDER';
    const PROVIDER_ADMIN = 'ROLE_PROVIDER_ADMIN';
    const PATIENT = 'ROLE_PATIENT';

    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=50, nullable=false)
     */
    private $name;

    /**
     * @ORM\ManyToMany(targetEntity="User", mappedBy="roles")
     */
    private $users;

    /**
     * Role constructor.
     */
    public function __construct()
    {
        $this->users = new ArrayCollection();
    }

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
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName(string $name)
    {
        $this->name = $name;
    }

    /**
     * @return ArrayCollection|User[]
     */
    public function getUsers()
    {
        return $this->users;
    }

    /**
     * @param array|User[] $users
     */
    public function setUsers($users)
    {
        $this->users = $users;
    }
}