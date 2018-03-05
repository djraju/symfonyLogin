<?php

namespace App\Form\Type\User;

use App\Entity\Form\User\Image;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class EditPictureType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('file', FileType::class, array('label' => false))
            ->add('submit', SubmitType::class);
    }

    public function getBlockPrefix()
    {
        return 'editPicture';
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        // Explicitly bind data class of form.
        $resolver->setDefaults([
            'data_class' => Image::class
        ]);
    }
}
?>
