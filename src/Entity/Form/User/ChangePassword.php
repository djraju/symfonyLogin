<?php

namespace App\Entity\Form\User;

use Symfony\Component\Security\Core\Validator\Constraints as SecurityAssert;

class ChangePassword
{
    /**
     * @SecurityAssert\UserPassword(
     *  message = "Incorrect current password. Please try again."
     * )
     */
    private $currentPassword;
    private $newPassword;

    public function getCurrentPassword()
    {
        return $this->currentPassword;
    }

    public function setCurrentPassword($currentPassword)
    {
        $this->currentPassword = $currentPassword;
    }

    public function getNewPassword()
    {
        return $this->newPassword;
    }

    public function setNewPassword($newPassword)
    {
        $this->newPassword = $newPassword;
    }

}
?>
