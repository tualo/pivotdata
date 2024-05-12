<?php
namespace Tualo\Office\Pivotdata\Commandline;
use Tualo\Office\Basic\ICommandline;
use Tualo\Office\Basic\CommandLineInstallSQL;

class Install extends CommandLineInstallSQL  implements ICommandline{
    public static function getDir():string {   return dirname(__DIR__,1); }
    public static $shortName  = 'pivotdata';
    public static $files = [
        'install/pivot_configuration' => 'setup pivot_configuration ',
    ];
    
}