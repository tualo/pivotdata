<?php
namespace Tualo\Office\Pivotdata\Commandline;
use Tualo\Office\Basic\ICommandline;
use Tualo\Office\Basic\CommandLineInstallSQL;

class Install extends CommandLineInstallSQL  implements ICommandline{
    public static function getDir():string {   return dirname(__DIR__,1); }
    public static $shortName  = 'pivotdata';
    public static $files = [
        'install/pivot_configuration' => 'setup pivot_configuration ',

        'install/pivot_aggregators.ds' => 'setup pivot_aggregators.ds ',
        'install/pivot_formater.ds' => 'setup pivot_formater.ds ',
        'install/pivot_renderer.ds' => 'setup pivot_renderer.ds ',

        'install/pivot_configuration.ds' => 'setup pivot_configuration.ds ',
        'install/pivot_configuration_aggregators.ds' => 'setup pivot_configuration_aggregators.ds ',
        'install/pivot_configuration_fields.ds' => 'setup pivot_configuration_fields.ds ',
        'install/pivot_configuration_left.ds' => 'setup pivot_configuration_left.ds ',
        'install/pivot_configuration_top.ds' => 'setup pivot_configuration_top.ds ',

    ];
    
}