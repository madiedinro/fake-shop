<?php

namespace Phug\Util;

use InvalidArgumentException;
use SplObjectStorage;

class AssociativeStorage extends SplObjectStorage
{
    /**
     * Throw exception on duplicate.
     *
     * @const int
     */
    const STRICT = 0;

    /**
     * Replace/override on duplicate.
     *
     * @const int
     */
    const REPLACE = 1;

    /**
     * Keep first/ignore on duplicate.
     *
     * @const int
     */
    const IGNORE = 2;

    /**
     * Keep all.
     *
     * @const int
     */
    const ALL = 3;

    /**
     * Entity name stored.
     *
     * @var string
     */
    private $name;

    /**
     * Duplicate mode.
     *
     * @var int
     */
    private $mode;

    /**
     * Available modes.
     *
     * @var array
     */
    private $modes;

    /**
     * Identity callback to name an entity.
     *
     * @var string
     */
    private $identify;

    public function __construct($name = 'entity', $mode = self::STRICT, $identify = 'getName')
    {
        $this->name = $name;
        $this->identify = $identify;
        $this->modes = [
            self::STRICT  => [$this, 'attachStrictMode'],
            self::REPLACE => [$this, 'attachReplaceMode'],
            self::IGNORE  => [$this, 'attachIgnoreMode'],
            self::ALL     => [$this, 'attachAllMode'],
        ];

        $this->setMode($mode);
    }

    public function setMode($mode)
    {
        if (!isset($this->modes[$mode])) {
            throw new InvalidArgumentException(
                'Unknown mode: '.$mode
            );
        }

        $this->mode = $mode;

        return $this;
    }

    public function addMode($mode, $handler)
    {
        $this->modes[$mode] = $handler;

        return $this;
    }

    private function attachStrictMode(AssociativeStorage $storage, $entity)
    {
        if ($storage->isDuplicateEntity($entity)) {
            throw new InvalidArgumentException(
                'Duplicate '.$this->name.' for the name '.
                $storage->identifyEntity($entity)
            );
        }

        return true;
    }

    private function attachReplaceMode(AssociativeStorage $storage, $entity)
    {
        foreach ($storage->findAllByName($storage->identifyEntity($entity)) as $duplicate) {
            $storage->detach($duplicate);
        }

        return true;
    }

    private function attachIgnoreMode(AssociativeStorage $storage, $entity)
    {
        return !$storage->isDuplicateEntity($entity);
    }

    private function attachAllMode()
    {
        return true;
    }

    public function identifyEntity($entity)
    {
        return $entity->{$this->identify}();
    }

    public function isDuplicateEntity($entity)
    {
        return count($this->findAllByName($this->identifyEntity($entity))) !== 0;
    }

    public function attach($object, $data = null)
    {
        $handler = $this->modes[$this->mode];

        if ($handler($this, $object, $data)) {
            parent::attach($object, $data);
        }
    }

    public function findAllByName($name)
    {
        $assignments = iterator_to_array($this);

        return array_values(array_filter($assignments, function ($entity) use ($name) {
            return $this->identifyEntity($entity) === $name;
        }));
    }

    public function findFirstByName($name)
    {
        $entities = $this->findAllByName($name);

        return count($entities) ? $entities[0] : null;
    }
}
