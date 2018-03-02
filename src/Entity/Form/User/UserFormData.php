<?php

namespace App\Entity\Form\User;

use Symfony\Component\Validator\Constraints as Assert;

/**
 * Class UserFormData
 */
class UserFormData
{
    /**
     * @Assert\NotBlank()
     * @var string $firstName
     */
    private $firstName;

    /**
     * @Assert\NotBlank()
     * @var string $lastName
     */
    private $lastName;

    /**
     * @Assert\Email()
     * @var string $email
     */
    private $email;

    /**
     * @return null|string
     */
    public function getFirstName(): ?string
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
     * @return null|string
     */
    public function getLastName(): ?string
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
     * @return null|string
     */
    public function getEmail(): ?string
    {
        return $this->email;
    }

    /**
     * @param string $email
     */
    public function setEmail(string $email)
    {
        $this->email = $email;
    }
}
