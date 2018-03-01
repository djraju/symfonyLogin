<?php

/*
 * (c) Kinetxx Inc <admin@kinetxx.com>
 */
namespace App\Controller;

use App\Annotations\LogRequest;
use App\Services\Utilities\PersistenceService;
use App\Services\Utilities\UserService;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Exception\RouteNotFoundException;
use Symfony\Component\Security\Core\Authentication\RememberMe\PersistentToken;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Class UserController
 */
class UserController extends Controller
{
    const ACCOUNT = 'account';
    const HELP = 'help';

    /**
     * @Route("/user/accountInfo", name="_user_account")
     *
     *
     * @return Response
     */
    public function userAccountAction()
    {
        /** @var User $objUser */
        $objUser = $this->getUser();
        //dump($objUser);exit;
        $a['username'] = $objUser->getUsername();
        return $this->render('User/info.html.twig', $a);
    }
}
