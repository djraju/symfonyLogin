<?php

namespace App\Entity\Form\User;

use Symfony\Component\Validator\Constraints as Assert;

class SendMessage
{
    private $id;

    /**
     * @Assert\Length(max = "1000")
     */
    private $text;
    private $file;

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getText()
    {
        return $this->text;
    }

    public function setText($text)
    {
        $this->text = $text;
    }

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
