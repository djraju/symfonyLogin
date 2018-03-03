<?php

/*
 * (c) Kinetxx Inc <admin@kinetxx.com>
 */
namespace App\Controller;

use App\Entity\Form\User\ChangePassword;
use App\Entity\Form\User\Image;
use App\Entity\User;
use App\Form\Type\User\ChangePasswordType;
use App\Form\Type\User\EditContactInfoType;
use App\Form\Type\User\EditPictureType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class UserController
 */
class UserController extends Controller
{
    const ACCOUNT = 'account';
    const HELP = 'help';

    /**
     * @Route("/user/account", name="_account")
     *
     * @param Request $request
     *
     * @return Response
     */
    public function accountAction(Request $request)
    {
        $a = $this->createDefaultParameters(self::ACCOUNT);

        /** @var User $user */
        $user = $this->getUser();

        $a['user'] = clone $user;
        $a['canDeleteProfilePicture'] = false;
        $a['profilePicture'] = $user->getPicture();

        $form = $this->createForm(EditContactInfoType::class, $user);
        $form->handleRequest($request);

        $editPicture = new Image();
        $editPictureForm = $this->createForm(EditPictureType::class, $editPicture);
        $editPictureForm->handleRequest($request);

        $changePassword = new ChangePassword();
        $changePasswordForm = $this->createForm(ChangePasswordType::class, $changePassword);
        $changePasswordForm->handleRequest($request);

        $a['form'] = $form->createView();
        $a['editPictureForm'] = $editPictureForm->createView();
        $a['changePasswordForm'] = $changePasswordForm->createView();

        return $this->render('User/account.html.twig', $a);
    }

    /**
     * @Route("/user/help", name="_help")
     *
     * @return Response
     */
    public function helpAction()
    {
        return new Response("helpAction");
    }

    /**
     * @Route("/user/removeProfilePicture", name="_remove_profile_picture")
     *
     * @return Response
     */
    public function removeProfilePicture()
    {
        return new Response("removeProfilePicture");
    }

    /**
     * @Route("/admin/exercise/list", name="_admin_exercise_list")
     *
     * @return Response
     */
    public function exerciseListAction()
    {
        return new Response("exerciseListAction");
    }

    /**
     * @Route("/admin/practices", name="_admin_practices")
     *
     * @return Response
     */
    public function adminPracticesAction()
    {
        return new Response("adminPracticesAction");
    }

    /**
     * @Route("/admin/workoutTemplate/list", name="_admin_list_workout_template")
     *
     * @return Response
     */
    public function listWorkoutTemplatesAction()
    {
        return new Response("listWorkoutTemplatesAction");
    }

    /**
     * @Route("/user/messages", name="_messages")
     *
     * @return Response
     */
    public function messagesAction()
    {
        return new Response("messagesAction");
    }

    /**
     * @Route("/admin/reporting", name="_admin_reporting")
     *
     * @return Response
     */
    public function adminReportingAction()
    {
        return new Response("adminReportingAction");
    }

    /**
     * @Route("/admin/appMaintenance", name="_maintenance")
     *
     * @return Response
     */
    public function appMaintenanceAction()
    {
        return new Response("appMaintenanceAction");
    }

    /**
     * Ajax call to get message count
     *
     * @Route("/user/countMessage", name="_user_count_message")
     *
     * @return Response
     */
    public function countMessageAction()
    {
        $response = array('totalUnread' => 0, 'latestSender' => null);

        return new Response(json_encode($response));
    }

    private function createDefaultParameters($page = null)
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
