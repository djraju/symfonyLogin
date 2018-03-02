<?php

/*
 * (c) Kinetxx Inc <admin@kinetxx.com>
 */
namespace App\Entity;

/**
 * Adds functionality to entities for encryption/decryption and object toString().
 */
abstract class AbstractKinetxxEntity
{
    // Used when entering addresses
    const CITY_MAX_LENGTH = 30;
    const ST_ADDRESS_MAX_LENGTH = 60;
    const ZIP_MAX_LENGTH = 30;
}
