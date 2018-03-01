<?php

/**
 * Created by PhpStorm.
 * User: dhananjay
 * Date: 1/3/18
 * Time: 11:44 AM
 */
namespace App\Controller;

use Psr\Log\LoggerInterface;
use App\Entity\User;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use function trim;

/**
 * Class PublicController
 */
class PublicController extends Controller
{
    const INDEX = "index";
    const ABOUT_US = "aboutus";
    const CONTACT_US = "contactus";
    const LOGIN = "login";

    private $ktxLogo = 'https://s3.amazonaws.com/ktx-static/site-images/logos/kinetxx-logo.png';

    /**
     * @Route("/", name="_public")
     *
     * @return Response
     */
    public function indexAction(LoggerInterface $logger)
    {
        $logger->info("Loading Signin Page");
        return $this->render('Public/signin.html.twig');
    }

}
