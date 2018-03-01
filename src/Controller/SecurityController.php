<?php
/**
 * Created by PhpStorm.
 * User: dhananjay
 * Date: 1/3/18
 * Time: 11:44 AM
 */
namespace App\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Class SecurityController
 */
class SecurityController extends Controller
{
    /**
     * @Route("/logout", name="_logout")
     */
    public function logoutAction()
    {
        // The security layer will intercept this request
    }

    /**
     * @Route("/login_check", name="_security_check")
     */
    public function securityCheckAction()
    {
        // The security layer will intercept this request
    }

    /**
     * @Route("/login_redirect", name="_login_redirect")
     *
     * @param Request $request
     *
     * @return RedirectResponse
     */
    public function loginRedirectAction(Request $request)
    {
        $url = '_user_account';
        return $this->redirectToRoute($url);
    }
}
