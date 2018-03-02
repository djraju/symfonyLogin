<?php

/*
 * (c) Kinetxx Inc <admin@kinetxx.com>
 */
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Class AbstractBaseController
 */
abstract class AbstractBaseController extends Controller
{
    /**
     * MAS TODO: How are these elements used? Are they all required?
     * Returns an array of the "default" parameters
     *      Array elements:
     *          numMessages
     *          activePage          $page passed in or null
     *          isPracticeAdmin     true/false if user is a Practice Admin
     *          logo                logo of "Practice" or default logo if user is ktx_support
     *
     *      [patient data]
     *          patient             patient id
     *          practice            practice id
     *          programStartDate    programStatus
     *          today
     *
     * @param string|null $page
     *
     * @return array
     */
    protected function createDefaultParameters($page = null)
    {
        $ktxLogo = $logo = 'https://s3.amazonaws.com/ktx-static/site-images/logos/kinetxx-logo.png';

        $a = array(
            'numMessages' => 0,
            'activePage' => $page,
            'isPracticeAdmin' => false,
            'ktx_logo' => $ktxLogo,
            'logo' => $logo,
            'container' => '',
            'switchPractice' => 0,
            );

        return $a;
    }
}
