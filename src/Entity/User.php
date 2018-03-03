<?php

/*
 * (c) Kinetxx Inc <admin@kinetxx.com>
 */
namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\EquatableInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Table(name="users", indexes={@ORM\Index(name="search_idx", columns={"first_name", "last_name"})})
 * @ORM\Entity
 */
class User extends AbstractKinetxxEntity implements UserInterface, EquatableInterface, \Serializable
{
    const NAME = 'App:User';
    const SALUTATION_MAX_LENGTH = 10;
    const FIRST_NAME_MAX_LENGTH = 30;
    const LAST_NAME_MAX_LENGTH = 30;
    const EMAIL_MAX_LENGTH = 150;

    /**
     * @ORM\ManyToMany(targetEntity="Role", inversedBy="users")
     * @ORM\JoinTable(name="users_roles")
     */
    private $roles;

    /**
     * @ORM\Column(type="guid")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="UUID")
     *
     * @var string
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=false)
     *
     * @Assert\NotBlank()
     *
     * @var string
     */
    private $username;

    /**
     * @ORM\Column(type="string", length=255, nullable=false)
     *
     * @var string
     */
    private $password;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     *
     * @var null|string
     */
    private $salutation;

    /**
     * @ORM\Column(type="string", length=255, nullable=false, name="first_name")
     *
     * @Assert\NotBlank()
     *
     * @var string
     */
    private $firstName;

    /**
     * @ORM\Column(type="string", length=255, nullable=false, name="last_name")
     *
     * @Assert\NotBlank()
     *
     * @var string
     */
    private $lastName;

    /**
     * @ORM\Column(type="string", length=511, nullable=false)
     *
     * @Assert\NotBlank()
     * @Assert\Email()
     *
     * @var string
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     *
     * @var null|string
     */
    private $phone;

    /**
     * @ORM\Column(type="string", length=511, name="st_address_1", nullable=true)
     *
     * @var null|string
     */
    private $stAddress1;

    /**
     * @ORM\Column(type="string", length=511, name="st_address_2", nullable=true)
     *
     * @var null|string
     */
    private $stAddress2;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     *
     * @var null|string
     */
    private $city;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     *
     * @var null|string
     */
    private $state;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     *
     * @var null|string
     */
    private $zip;

    /**
     * @ORM\Column(type="string", nullable=false)
     *
     * @var string
     */
    private $picture = 'https://s3.amazonaws.com/ktx-static/user-pictures/76px-Man_silhouette.png';

    /**
     * @ORM\Column(type="string", length=255, nullable=true, name="birth_date")
     *
     * @var null|string
     */
    private $birthDate;

    /**
     * @ORM\Column(type="boolean", nullable=false, name="new_user")
     *
     * @var bool
     */
    private $newUser = true;

    /**
     * @ORM\Column(type="datetime", nullable=false, name="date_joined")
     *
     * @var \DateTime
     */
    private $dateJoined = null;

    /**
     * @ORM\Column(type="datetime", nullable=true, name="last_login")
     *
     * @var null|\DateTime
     */
    private $lastLogin = null;

    /**
     * @ORM\Column(type="integer", nullable=false, name="failed_login_count")
     *
     * @var int
     */
    private $failedLoginCount = 0;

    /**
     * @ORM\Column(type="datetime", nullable=true, name="last_failed_login")
     *
     * @var null|\DateTime
     */
    private $lastFailedLogin = null;

    /**
     * @ORM\Column(type="boolean", nullable=false, name="reset_pass")
     *
     * @var bool
     */
    private $resetPass = false;

    /**
     * User constructor.
     */
    public function __construct()
    {
        $this->roles = new ArrayCollection();
    }

    /**
     * @return string
     */
    public function getId(): string
    {
        return $this->id;
    }

    /**
     * @param string $id
     */
    public function setId(string $id)
    {
        $this->id = $id;
    }

    /**
     * @return string
     */
    public function getUsername(): string
    {
        return $this->username;
    }

    /**
     * @param string $username
     */
    public function setUsername(string $username)
    {
        $this->username = strtolower($username);
    }

    /**
     * @return string
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    /**
     * @param string $password
     */
    public function setPassword(string $password)
    {
        $this->password = $password;
    }

    /**
     * @return null|string
     */
    public function getSalutation()
    {
        return $this->salutation;
    }

    /**
     * @param null|string $salutation
     */
    public function setSalutation($salutation)
    {
        $this->salutation = $salutation;
    }

    /**
     * @return string
     */
    public function getFirstName(): string
    {
        return $this->firstName;
    }

    /**
     * @param string $firstName
     */
    public function setFirstName(string $firstName)
    {
        $this->firstName = $firstName;
    }

    /**
     * @return string
     */
    public function getLastName(): string
    {
        return $this->lastName;
    }

    /**
     * @param string $lastName
     */
    public function setLastName(string $lastName)
    {
        $this->lastName = $lastName;
    }

    /**
     * @return string
     */
    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * @param string $email
     */
    public function setEmail(string $email)
    {
        $this->email = strtolower($email);
    }

    /**
     * @return null|string
     */
    public function getPhone()
    {
        return $this->phone;
    }

    /**
     * @param null|string $phone
     */
    public function setPhone($phone)
    {
        $this->phone = $phone;
    }

    /**
     * @return null|string
     */
    public function getStAddress1()
    {
        return $this->stAddress1;
    }

    /**
     * @param null|string $stAddress1
     */
    public function setStAddress1($stAddress1)
    {
        $this->stAddress1 = $stAddress1;
    }

    /**
     * @return null|string
     */
    public function getStAddress2()
    {
        return $this->stAddress2;
    }

    /**
     * @param null| string $stAddress2
     */
    public function setStAddress2($stAddress2)
    {
        $this->stAddress2 = $stAddress2;
    }

    /**
     * @return null|string
     */
    public function getCity()
    {
        return $this->city;
    }

    /**
     * @param null|string $city
     */
    public function setCity($city)
    {
        $this->city = $city;
    }

    /**
     * @return null|string
     */
    public function getState()
    {
        return $this->state;
    }

    /**
     * @param null|string $state
     */
    public function setState(string $state)
    {
        $this->state = $state;
    }

    /**
     * @return null|string
     */
    public function getZip()
    {
        return $this->zip;
    }

    /**
     * @param null|string $zip
     */
    public function setZip($zip)
    {
        $this->zip = $zip;
    }

    /**
     * @return string
     */
    public function getPicture(): string
    {
        return $this->picture;
    }

    /**
     * @param string $picture
     */
    public function setPicture(string $picture)
    {
        $this->picture = $picture;
    }

    /**
     * @return null|string
     */
    public function getBirthDate()
    {
        return $this->birthDate;
    }

    /**
     * @param null|string $birthDate
     */
    public function setBirthDate($birthDate)
    {
        $this->birthDate = $birthDate;
    }

    /**
     * @return bool
     */
    public function getNewUser()
    {
        return $this->newUser;
    }

    /**
     * @param bool $newUser
     */
    public function setNewUser(bool $newUser)
    {
        $this->newUser = $newUser;
    }

    /**
     * @return \DateTime
     */
    public function getDateJoined(): \DateTime
    {
        return $this->dateJoined;
    }

    /**
     * @param \DateTime $dateJoined
     */
    public function setDateJoined(\DateTime $dateJoined)
    {
        $this->dateJoined = $dateJoined;
    }

    /**
     * @return null|\DateTime
     */
    public function getLastLogin()
    {
        return $this->lastLogin;
    }

    /**
     * @param null|\DateTime $lastLogin
     */
    public function setLastLogin($lastLogin)
    {
        $this->lastLogin = $lastLogin;
    }

    /**
     * @return int
     */
    public function getFailedLoginCount(): int
    {
        return $this->failedLoginCount;
    }

    /**
     * @param int $failedLoginCount
     */
    public function setFailedLoginCount(int $failedLoginCount)
    {
        $this->failedLoginCount = $failedLoginCount;
    }

    /**
     * @return null|\DateTime
     */
    public function getLastFailedLogin(): ?\DateTime
    {
        return $this->lastFailedLogin;
    }

    /**
     * @param null|\DateTime $lastFailedLogin
     */
    public function setLastFailedLogin(?\DateTime $lastFailedLogin)
    {
        $this->lastFailedLogin = $lastFailedLogin;
    }

    /**
     * @return bool
     */
    public function getResetPass(): bool
    {
        return $this->resetPass;
    }

    /**
     * @param bool $resetPass
     */
    public function setResetPass(bool $resetPass)
    {
        $this->resetPass = $resetPass;
    }

    /**
     * @param Role $roleToAdd
     */
    public function addUserRole(Role $roleToAdd)
    {
        $bInArray = false;
        foreach ($this->roles as $role) {
            if ($roleToAdd === $role) {
                $bInArray = true;
                break;
            }
        }

        if (!$bInArray) {
            $this->roles[] = $roleToAdd;
        }
    }

    /**
     * @param Role $roleToRemove
     */
    public function removeUserRole(Role $roleToRemove)
    {
        foreach ($this->roles as $key => $role) {
            if ($roleToRemove === $role) {
                unset($this->roles[$key]);
                break;
            }
        }
    }

    /**
     * @return array|string[]
     */
    public function getRoles()
    {
        $roles = array();

        foreach ($this->roles as $role) {
            $name = $role->getName();

            array_push($roles, $name);
        }

        return $roles;
    }

    /**
     * @param array|ArrayCollection|Role[] $roles
     */
    public function setRoles($roles)
    {
        $this->roles = $roles;
    }

    /**
     * @param string $roleName
     *
     * @return bool
     */
    public function hasRole(string $roleName): bool
    {
        foreach ($this->roles as $role) {
            if ($role->getName() === $roleName) {
                return true;
            }
        }

        return false;
    }

    /**
     * Called by Security
     */
    public function eraseCredentials()
    {
    }

    /**
     * Called by Security
     */
    public function getSalt()
    {
    }

    /**
     * @return string
     */
    public function serialize()
    {
        return serialize(array($this->id, ));
    }

    /**
     * @param string $serialized
     */
    public function unserialize($serialized)
    {
        list($this->id, ) = unserialize($serialized);
    }

    /**
     * The equality comparison should neither be done by referential equality
     * nor by comparing identities (i.e. getId() === getId()).
     *
     * However, you do not need to compare every attribute, but only those that
     * are relevant for assessing whether re-authentication is required.
     *
     * Also implementation should consider that $user instance may implement
     * the extended user interface `AdvancedUserInterface`.
     *
     * @param UserInterface $user
     *
     * @return bool
     */
    public function isEqualTo(UserInterface $user): bool
    {
        // Given we only serialize the id, see serialize() above, it is the only field we can compare.
        $bReturn = false;
        if ($user instanceof User) {
            if ($this->getId() === $user->getId()) {
                $bReturn = true;
            }
            // If we expand serialize we can add more checks here
        }

        return $bReturn;
    }

    /**
     * Represent the Entity as a string.
     *
     * @return string
     */
    public function toAuditString()
    {
        // Represent the Entity as a string $s
        $s = "User {";
        $s = $s."}";

        return $s;
    }
}
