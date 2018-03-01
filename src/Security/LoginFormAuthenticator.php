<?php

/**
 * Created by PhpStorm.
 * User: dhananjay
 * Date: 1/3/18
 * Time: 11:44 AM
 */
namespace App\Security;

use App\Entity\User;
use App\Services\UserService;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\UsernameNotFoundException;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\Security\Guard\Authenticator\AbstractFormLoginAuthenticator;

/**
 * Class LoginFormAuthenticator
 */
class LoginFormAuthenticator extends AbstractFormLoginAuthenticator
{
    /**
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    /**
     * @var UrlGeneratorInterface
     */
    private $urlGenerator;

    /**
     * @var CsrfTokenManagerInterface
     */
    private $tokenManager;

    /**
     * @var UserService $userService
     */
    private $userService;

    /**
     * @param UserPasswordEncoderInterface $encoder
     * @param UrlGeneratorInterface        $urlGenerator
     * @param MobileDetector               $mobileDetector
     * @param CsrfTokenManagerInterface    $tokenManager
     * @param UserService                  $userService
     */
    public function __construct(UserPasswordEncoderInterface $encoder, UrlGeneratorInterface $urlGenerator, CsrfTokenManagerInterface $tokenManager, UserService $userService)
    {
        $this->encoder        = $encoder;
        $this->urlGenerator   = $urlGenerator;
        $this->tokenManager   = $tokenManager;
        $this->userService    = $userService;
    }

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
        $username = $request->request->get('_username');
        $request->getSession()->set(Security::LAST_USERNAME, $username);
        $password = $request->request->get('_password');


        return [
            'username' => $username,
            'password' => $password,
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

        if (filter_var($username, FILTER_VALIDATE_EMAIL)) {
            throw new AuthenticationException('signin.invalid.email');
        }

        try {
            $user = $userProvider->loadUserByUsername($username);
        } catch (UsernameNotFoundException $e) {
            // Catch exception so we can hide username
            throw new AuthenticationException('Invalid Username/Password.');
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
        $plainPassword = $credentials['password'];
        if (!$this->userService->checkCredentials($user, $this->encoder, $plainPassword)) {
            throw new AuthenticationException('Invalid Username/Password.');
        }

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
        /** @var Session $session */
        $session = $request->getSession();
        $session->set(Security::AUTHENTICATION_ERROR, $exception);
        $session->getFlashBag()->add('error', $exception->getMessage());

        // MAS: TODO Add Audit probably in listener
//        if ($this->mobileDetector->isMobile()) {
//            return new RedirectResponse($this->getLoginUrl().'?error=1');
//        }

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
        /** @var User $user */
        $user = $token->getUser();

        $url = '_login_redirect';

        // MAS: TODO Add Audit probably in listener
        return new RedirectResponse($this->urlGenerator->generate($url));
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
        return  $this->urlGenerator->generate('_public');
    }
}
