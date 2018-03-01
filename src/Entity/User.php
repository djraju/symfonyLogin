<?php
/*
 * Dhananjay <dhananjay@digit88.com>
 */
namespace App\Entity;

use Symfony\Component\Security\Core\User\UserInterface;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Security\Core\User\EquatableInterface;
/**
 * @ORM\Table(name="users")
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 */
class User implements UserInterface, EquatableInterface, \Serializable
{
    const NAME = 'App:User';
    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", unique=true)
     */
    private $username;

    /**
     * @ORM\Column(type="string", length=255, nullable=false)
     *
     * @var string
     */
    private $password;

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
    public function getPassword(): ?string
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

    public function getRoles()
    {
        return array('ROLE_USER');
    }

    public function getSalt()
    {
    }
    public function eraseCredentials()
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
}