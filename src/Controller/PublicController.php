<?php

/*
 * (c) Kinetxx Inc <admin@kinetxx.com>
 */
namespace App\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class PublicController
 */
class PublicController extends Controller
{
    const INDEX = "index";
    const LOGIN = "login";

    private $ktxLogo = 'https://s3.amazonaws.com/ktx-static/site-images/logos/kinetxx-logo.png';

    /**
     * @Route("/", name="_public")
     *
     * @return Response
     */
    public function indexAction()
    {
        $a = $this->createPublicDefaultParameters(self::INDEX, "kintexx_the_container");

        $a['logo'] = $this->ktxLogo;
        $a['staySignedInValidity'] = $this->container->getParameter("stay_signed_in_validity");

        return $this->render('Public/index.html.twig', $a);
    }

    /**
     * @Route("/signin", name="_public_signin")
     *
     * @param Request $request
     *
     * @return Response
     */
    public function signinAction(Request $request)
    {
        $a = $this->createPublicDefaultParameters(self::LOGIN, "kintexx_the_container");

        if ($request->isMethod('POST')) {
            $a['username'] = 'ktx_support';

            return $this->render('Public/signin.html.twig', $a);
        }

        $a['logo'] = $this->ktxLogo;
        $a['authExceptionMessage'] = null;

        return $this->render('Public/signinUsername.html.twig', $a);
    }

    /**
     * @Route("/aboutus", name="_public_aboutus")
     *
     * @return Response
     */
    public function aboutusAction()
    {
        return new Response("aboutusAction");
    }

    /**
     * @Route("/contactus", name="_public_contact")
     *
     * @return Response
     */
    public function contactusAction()
    {
        return new Response("contactusAction");
    }

    /**
     * @param string $page
     * @param string $container
     *
     * @return array
     */
    private function createPublicDefaultParameters($page, $container = "")
    {
        return array("activePage" => $page, "container" => $container);
    }
}
