<?php

/*
 * (c) Kinetxx Inc <admin@kinetxx.com>
 */
namespace App\Security;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\UsernameNotFoundException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Guard\Authenticator\AbstractFormLoginAuthenticator;

/**
 * Class LoginFormAuthenticator
 */
class LoginFormAuthenticator extends AbstractFormLoginAuthenticator
{
    /**
     * Get the authentication credentials from the request and return them
     * as an associate array. If you return null, authentication
     * will be skipped.
     *
     * Whatever value you return here will be passed to getUser() and checkCredentials()
     *
     * @param Request $request
     *
     * @throws AuthenticationException
     *
     * @return array
     */
    public function getCredentials(Request $request)
    {
        return [
            'username' => 'ktx_support',
            'password' => 'password',
        ];
    }

    /**
     * Return a UserInterface object based on the credentials.
     *
     * The *credentials* are the return value from getCredentials()
     *
     * You may throw an AuthenticationException if you wish. If you return
     * null, then a UsernameNotFoundException is thrown for you.
     *
     * @param mixed                 $credentials
     * @param UserProviderInterface $userProvider
     *
     * @return UserInterface|null
     *
     * @throws AuthenticationException
     */
    public function getUser($credentials, UserProviderInterface $userProvider)
    {
        $username = $credentials['username'];

        try {
            $user = $userProvider->loadUserByUsername($username);
        } catch (UsernameNotFoundException $e) {
            throw new AuthenticationException('Unknown User');
        }

        return $user;
    }

    /**
     * Returns true if the credentials are valid.
     *
     * If any value other than true is returned, authentication will
     * fail. You may also throw an AuthenticationException if you wish
     * to cause authentication to fail.
     *
     * The *credentials* are the return value from getCredentials()
     *
     * @param mixed         $credentials
     * @param UserInterface $user
     *
     * @return bool
     *
     * @throws AuthenticationException
     */
    public function checkCredentials($credentials, UserInterface $user)
    {
        return true;
    }

    /**
     * Controls what happens after a bad username/password is submitted.
     *
     * @param Request                 $request
     * @param AuthenticationException $exception
     *
     * @return RedirectResponse
     */
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        return new RedirectResponse($this->getLoginUrl());
    }

    /**
     * Override to change what happens after successful authentication.
     *
     * @param Request        $request
     * @param TokenInterface $token
     * @param string         $providerKey
     *
     * @return RedirectResponse
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, $providerKey)
    {
        return new RedirectResponse('/user/account');
    }

    /**
     * @param Request $request
     *
     * @return bool
     */
    public function supports(Request $request)
    {
        if ($request->getPathInfo() !== '/login_check' || !$request->isMethod('POST')) {
            // Skip Authentication
            return false;
        }

        return true;
    }

    /**
     * @return bool
     */
    public function supportsRememberMe()
    {
        return true;
    }

    /**
     * Return the URL to the login page.
     *
     * @return string
     */
    protected function getLoginUrl()
    {
        return  '/signin';
    }
}
