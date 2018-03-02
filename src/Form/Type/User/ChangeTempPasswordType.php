<?php

namespace App\Form\Type\User;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;

class ChangeTempPasswordType extends AbstractType
{

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('password', RepeatedType::class, array(
                'type' => PasswordType::class,
                'invalid_message' => 'The passwords do not match.',
                'error_mapping' => array(
                    '.' => 'second'
                ),
                'options' => array(
                    'attr' => array(
                        'maxlength' => 30
                    )
                ),
                'first_options' => array(
                    'label' => 'New Password'
                ),
                'second_options' => array(
                    'label' => 'Confirm New Password'
                )
            ))
            ->add('submit', SubmitType::class);
    }

    public function getBlockPrefix()
    {
        return 'changeTempPassword';
    }

}
?>
