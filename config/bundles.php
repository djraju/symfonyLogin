<?php

return [
    Symfony\Bundle\FrameworkBundle\FrameworkBundle::class => ['all' => true],
    Symfony\Bundle\WebServerBundle\WebServerBundle::class => ['dev' => true],
    Sensio\Bundle\FrameworkExtraBundle\SensioFrameworkExtraBundle::class => ['all' => true],
    Doctrine\Bundle\DoctrineCacheBundle\DoctrineCacheBundle::class => ['all' => true],
    Doctrine\Bundle\DoctrineBundle\DoctrineBundle::class => ['all' => true],
    Doctrine\Bundle\MigrationsBundle\DoctrineMigrationsBundle::class => ['all' => true],
    Symfony\Bundle\MonologBundle\MonologBundle::class => ['all' => true],
    Symfony\Bundle\TwigBundle\TwigBundle::class => ['all' => true],
    Symfony\Bundle\SecurityBundle\SecurityBundle::class => ['all' => true],
    Symfony\Bundle\WebProfilerBundle\WebProfilerBundle::class => ['dev' => true, 'test' => true],
    Symfony\Bundle\DebugBundle\DebugBundle::class => ['dev' => true, 'test' => true],
    Hautelook\AliceBundle\HautelookAliceBundle::class => ['dev' => true, 'perf' => true, 'sys' => true, 'test' => true],
    Nelmio\Alice\Bridge\Symfony\NelmioAliceBundle::class => ['dev' => true, 'perf' => true, 'sys' => true, 'test' => true],
    Fidry\AliceDataFixtures\Bridge\Symfony\FidryAliceDataFixturesBundle::class => ['dev' => true, 'perf' => true, 'sys' => true, 'test' => true],
];
