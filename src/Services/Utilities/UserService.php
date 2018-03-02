<?php

/*
 * (c) Kinetxx Inc <admin@kinetxx.com>
 */
namespace App\Services\Utilities;

use Doctrine\DBAL\DBALException;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\DailyWorkout;
use App\Entity\Form\User\UserFormData;
use App\Entity\Message;
use App\Entity\Practice;
use App\Entity\Role;
use App\Entity\UsaTimezone;
use App\Entity\User;
use App\Entity\WeblogAction;
use App\Entity\UserVerificationUrl;
use App\Services\AWS\AwsS3;
use App\Services\EncryptionServiceInterface;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * Class UserService
 */
class UserService extends BaseService
{
    /**
     * Return a User given username
     *
     * @param string $login
     *
     * @return null|object|User
     */
    public function getUserByUsername(string $login)
    {
        // lowercase for test
        $username = strtolower($login);

        return $this->getUserRepo()->findOneBy(array('username' => $username));
    }

    /**
     * @return string
     */
    public function getClassName()
    {
        return $this->getUserRepo()->getClassName();
    }

    /**
     * @param string $id
     *
     * @return null|object|User
     */
    public function getUserById(string $id)
    {
        return $this->getUserRepo()->find($id);
    }
}
