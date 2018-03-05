<?php

namespace App\Services;

use App\Entity\User;
use App\Services\Utilities\UserService;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\Exception\UsernameNotFoundException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;

/**
 * Class UserProvider
 */
class UserProvider implements UserProviderInterface
{
    private $userService;

    /**
     * UserProvider constructor.
     * @param UserService $userService
     */
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Loads the user for the given login data (username).
     *
     * This method must throw UsernameNotFoundException if the user is not
     * found.
     *
     * @param string $login
     *
     * @return UserInterface
     *
     * @throws UsernameNotFoundException if the user is not found
     */
    public function loadUserByUsername($login)
    {
        $user = $this->userService->getUserByUsername($login);

        if (null === $user) {
            throw new UsernameNotFoundException();
        }

        return $user;
    }

    /**
     * Refreshes the user for the account interface.
     *
     * It is up to the implementation to decide if the user data should be
     * totally reloaded (e.g. from the database), or if the UserInterface
     * object can just be merged into some internal array of users / identity
     * map.
     *
     * @param UserInterface $user
     *
     * @return UserInterface
     *
     * @throws UnsupportedUserException if the account is not supported
     */
    public function refreshUser(UserInterface $user)
    {
        $class = get_class($user);
        if (!$this->supportsClass($class)) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', $class));
        }
        /** @var User $user */

        return $this->userService->getUserById($user->getId());
    }

    /**
     * Whether this provider supports the given user class.
     *
     * @param string $class
     *
     * @return bool
     */
    public function supportsClass($class)
    {
        return $this->userService->getClassName() === $class ||
            is_subclass_of($class, $this->userService->getClassName());
    }
}
