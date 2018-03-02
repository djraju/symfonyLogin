<?php

namespace App\Form\Type\User;

use App\Entity\Form\User\ChangePassword;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ChangePasswordType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('currentPassword', PasswordType::class, array(
                'attr' => array(
                    'maxlength' => 30
                )
            ))
            ->add('newPassword', RepeatedType::class, array(
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
        return 'changePassword';
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        // Explicitly bind data class of form.
        $resolver->setDefaults([
            'data_class' => ChangePassword::class
        ]);
    }
}
?>
