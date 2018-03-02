<?php

namespace App\Entity\Form\User;

use Symfony\Component\Validator\Constraints as Assert;

class Image
{
    /**
     * @Assert\Image()
     */
    private $file;

    public function getFile()
    {
        return $this->file;
    }

    public function setFile($file)
    {
        $this->file = $file;
    }

}
?>
