<?php
/**
 * Created by PhpStorm.
 * User: dhananjay
 * Date: 1/3/18
 * Time: 11:44 AM
 */
namespace App\Services;

use App\Entity\User;
use App\Entity\Weblog;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Guard\Token\PostAuthenticationGuardToken;

/**
 * Class PersistenceService
 */
class PersistenceService
{
    const PERSIST = 'PERSIST';
    const REMOVE = 'REMOVE';

    /**
     * @var EntityManagerInterface $em
     */
    private $em;

    /**
     * @var SessionInterface $session
     */
    private $session;

    /**
     * @var TokenStorageInterface $tokenStorage
     */
    private $tokenStorage;

    /**
     * PersistenceService constructor.
     * @param EntityManagerInterface $em
     * @param SessionInterface       $session
     * @param TokenStorageInterface  $tokenStorage
     */
    public function __construct(EntityManagerInterface $em, SessionInterface $session, TokenStorageInterface $tokenStorage)
    {
        $this->em = $em;
        $this->session = $session;
        $this->tokenStorage = $tokenStorage;
    }

    /**
     * Audit
     */
    public function auditRequest()
    {
        $this->audit("", "");
    }

    /**
     * Persist a single object
     *
     * @param AbstractKinetxxEntity $obj    - the object to persist
     * @param string                $action - the Weblog action involved
     */
    public function persistEntity(AbstractKinetxxEntity $obj, string $action)
    {
        $this->persistEntities(array($obj), $action);
    }

    /**
     * Persist an array of objects
     *
     * @param array  $objArray
     * @param string $action
     */
    public function persistEntities(array $objArray, string $action)
    {
        $this->doPersist($objArray, self::PERSIST, $action);
    }

    /**
     * @param AbstractKinetxxEntity $obj
     * @param string                $action
     */
    public function removeEntity(AbstractKinetxxEntity $obj, string $action)
    {
        $this->removeEntities(array($obj), $action);
    }

    /**
     * @param array  $objArray
     * @param string $action
     */
    public function removeEntities(array $objArray, string $action)
    {
        $this->doPersist($objArray, self::REMOVE, $action);
    }


    /**
     * MAS: TODO No Audit, Log Error?
     * Remove an array of $objects
     *
     * @param array  $objects - array of entities to remove
     * @param string $action  - the Weblog action involved
     *
     * @return bool
     */
    public function transactionalDelete(array $objects, string $action)
    {
        $connection = $this->em->getConnection();

        try {
            //... do some work
            $connection->executeUpdate("SET FOREIGN_KEY_CHECKS = 0;");
            $connection->beginTransaction();

            $this->removeEntities($objects, $action);

            $connection->commit();
            $connection->executeUpdate("SET FOREIGN_KEY_CHECKS = 1;");
        } catch (\Exception $e) {
            $connection->rollBack();
            $connection->executeUpdate("SET FOREIGN_KEY_CHECKS = 1;");

            return false;
        }

        return true;
    }

    /**
     * Persist an array of $objects
     *
     * @param array|AbstractKinetxxEntity[] $objects - array of entities to persist
     * @param string                        $type    - PERSIST or REMOVE
     * @param string                        $action  - Weblog action involved
     */
    private function doPersist(array $objects, string $type, string $action)
    {
        foreach ($objects as $obj) :
            switch ($type) {
                case self::PERSIST:
                    $this->em->persist($obj);
                    break;
                case self::REMOVE:
                    $this->em->remove($obj);
                    break;
            }
        endforeach;

        $this->em->flush();

        foreach ($objects as $obj) :
            $this->auditObject($obj, $action);
        endforeach;
    }

    /**
     * @param AbstractKinetxxEntity $obj
     * @param string                $action
     */
    private function auditObject(AbstractKinetxxEntity $obj, string $action)
    {
        $this->audit($obj->toString(), $action);
    }

    /**
     * @param string $args
     * @param string $action
     */
    private function audit(string $args, string $action)
    {
        $request = Request::createFromGlobals();
        $weblog = new Weblog();

        $id = '-1';
        $role = '-1';
        $authToken = $this->tokenStorage->getToken();
        if ($authToken instanceof PostAuthenticationGuardToken) {
            $user = $authToken->getUser();
            if ($user instanceof User) {
                $id = $user->getId();
                $role = implode($user->getRoles());
            }
        }

        $weblog->setUserId($id);
        $weblog->setRole($role);

        $ips = $request->getClientIps();
        $weblog->setIp($ips[count($ips) - 1]);

        $weblog->setSessionId($this->session->getId());
        $weblog->setPage($request->getRequestUri());
        $weblog->setPostString($args);
        $weblog->setAction($action);

        $this->em->persist($weblog);
        $this->em->flush();
    }
}
