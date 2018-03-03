<?php

namespace App\Form\Type\User;

use App\Entity\User;
use App\Services\States;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

/**
 * Class EditContactInfoType
 */
class EditContactInfoType extends AbstractType
{
    /**
     * @param FormBuilderInterface $builder
     * @param array                $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add(
                'salutation',
                TextType::class,
                array(
                    'attr' => array(
                        'maxlength' => User::SALUTATION_MAX_LENGTH,
                    ),
                    'required' => false,
                )
            )
            ->add(
                'firstName',
                TextType::class,
                array(
                    'attr' => array(
                        'maxlength' => User::FIRST_NAME_MAX_LENGTH,
                    ),
                )
            )
            ->add(
                'lastName',
                TextType::class,
                array(
                    'attr' => array(
                        'maxlength' => User::LAST_NAME_MAX_LENGTH,
                    ),
                )
            )
            ->add(
                'email',
                EmailType::class,
                array(
                    'attr' => array(
                        'maxlength' => User::EMAIL_MAX_LENGTH,
                    ),
                )
            )
            ->add(
                'phone',
                TextType::class,
                array(
                    'label' => 'Phone Number',
                    'required' => false,
                )
            )
            ->add(
                'stAddress1',
                TextType::class,
                array(
                    'label' => 'Address Line 1',
                    'attr' => array(
                        'maxlength' => User::ST_ADDRESS_MAX_LENGTH,
                    ),
                    'required' => false,
                )
            )
            ->add(
                'stAddress2',
                TextType::class,
                array(
                    'label' => 'Address Line 2',
                    'attr' => array(
                        'maxlength' => User::ST_ADDRESS_MAX_LENGTH,
                    ),
                    'required' => false,
                )
            )
            ->add(
                'city',
                TextType::class,
                array(
                    'attr' => array(
                        'maxlength' => User::CITY_MAX_LENGTH,
                    ),
                    'required' => false,
                )
            )
            ->add(
                'state',
                ChoiceType::class,
                array(
                    'choices' => States::getStates(),
                    'required' => false,
                )
            )
            ->add(
                'zip',
                TextType::class,
                array(
                    'attr' => array(
                        'maxlength' => User::ZIP_MAX_LENGTH,
                    ),
                    'required' => false,
                )
            )
            ->add('submit', SubmitType::class);
    }

    /**
     * @param OptionsResolver $resolver
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        // Explicitly bind data class of form.
        $resolver->setDefaults(
            [
                'data_class' => User::class,
            ]
        );
    }

    /**
     * @return string
     */
    public function getBlockPrefix()
    {
        return 'editContactInfo';
    }
}
