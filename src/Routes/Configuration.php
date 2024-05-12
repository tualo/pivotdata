<?php
namespace Tualo\Office\Pivotdata\Routes;

use Tualo\Office\Basic\TualoApplication as App;
use Tualo\Office\Basic\Route as BasicRoute;
use Tualo\Office\Basic\IRoute;
use Tualo\Office\DS\DSTable;

class Configuration implements IRoute{
    public static function register(){
        
        BasicRoute::add('/pivotdata/configuration/(?P<id>[\w.\/\-]+)',function($matches){
            App::contenttype('application/json');
            $session = App::get('session');
            $db = $session->getDB();
            try {
                $id = $matches['id'];

                $pivot_configuration = DSTable::init($db)
                    ->t('pivot_configuration')
                    ->f('id','=',$id)
                    ->limit(1);

                $pivot_configuration_data = $pivot_configuration->get();

                if ($pivot_configuration->error()){
                    throw new \Exception($pivot_configuration->errorMessage());
                }

                $pivot_configuration_data = $pivot_configuration_data[0];

                $pivot_configuration_fields = DSTable::init($db)
                    ->t('pivot_configuration_fields')
                    ->f('pivot_configuration_id','=',$pivot_configuration_data['id'])
                ;

                $pivot_configuration_fields_data = $pivot_configuration_fields->get();

                if ($pivot_configuration_fields->error()){
                    throw new \Exception($pivot_configuration_fields->errorMessage());
                }

                $pivot_configuration_top = DSTable::init($db)
                    ->t('pivot_configuration_top')
                    ->f('pivot_configuration_id','=',$pivot_configuration_data['id'])
                ;
                $pivot_configuration_top_data = $pivot_configuration_top->get();
                if ($pivot_configuration_top->error()){
                    throw new \Exception($pivot_configuration_top->errorMessage());
                }
                $tops=[];
                foreach($pivot_configuration_top_data as $top){
                    $tops[] = [
                        'dataIndex'=>$top['column_name'],
                        'header'=>$top['name'],
                        'position'=>$top['position'],
                        'labelRenderer'=>$top['label_renderer']
                    ];
                }

                $pivot_configuration_left = DSTable::init($db)
                    ->t('pivot_configuration_left')
                    ->f('pivot_configuration_id','=',$pivot_configuration_data['id'])
                ;
                $pivot_configuration_left_data = $pivot_configuration_left->get();
                if ($pivot_configuration_left->error()){
                    throw new \Exception($pivot_configuration_left->errorMessage());
                }
                $lefts=[];
                foreach($pivot_configuration_left_data as $left){
                    $lefts[] = [
                        'dataIndex'=>$left['column_name'],
                        'header'=>$left['name'],
                        'position'=>$left['position'],
                        'labelRenderer'=>$left['label_renderer']
                    ];
                }

                $formaterMap = $db->direct('select id,formatter from pivot_formater',[],'id');
                $pivot_configuration_aggregators = DSTable::init($db)
                    ->t('pivot_configuration_aggregators')
                    ->f('pivot_configuration_id','=',$pivot_configuration_data['id'])
                ;
                $pivot_configuration_aggregators_data = $pivot_configuration_aggregators->get();
                if ($pivot_configuration_aggregators->error()){
                    throw new \Exception($pivot_configuration_aggregators->errorMessage());
                }
                $aggregates=[];
                foreach($pivot_configuration_aggregators_data as $aggregate){
                    $aggregates[] = [
                        'dataIndex'=>$aggregate['column_name'],
                        'header'=>$aggregate['name'],
                        'align'=>$aggregate['align'],
                        'aggregator'=>$aggregate['aggregator'],
                        'renderer'=>$aggregate['renderer'],
                        'formatter'=>isset($formaterMap[$aggregate['formatter']])?$formaterMap[$aggregate['formatter']]['formatter']:'null',
                    ];
                }

                $config = [];
                $config['title']=$pivot_configuration_data['name'];

                $config['header']=json_decode( file_get_contents(__DIR__.'/Exporter.json'),true);
                $config['listeners']=[];
                $config['listeners']['documentsave'] = 'onDocumentSave';
                $config['listeners']['beforedocumentsave'] = 'onBeforeDocumentSave';

                
                $config['matrix']=[
                    'type'=>'local',
                    'store'=>[
                        'type'=>$pivot_configuration_data['id'].'_store',
                        'autoLoad'=>true,
                    ],
                    'aggregate'=>$aggregates,
                    'leftAxis'=>$lefts,
                    'topAxis'=>$tops,
                ];
                $config['plugins']=[];
                $config['plugins']['pivotconfigurator'] = [
                    'id'=>'configurator',
                    'fields'=>[]
                ];
                $config['plugins']['pivotexporter']=[
                    'id'=>'exporter',
                    'type'=>'excel'
                ];
        
                $config['plugins']['pivotconfigurator']['fields']=[];
                foreach($pivot_configuration_fields_data as $field){
                    $c =  [
                        'dataIndex'=>$field['column_name'],
                        'header'=>$field['name'],
                        
                    ];
                    if ( $field['label_renderer'] != 'null' ){
                        $c['labelRenderer'] = $field['label_renderer'];
                    }
                    if ( $field['renderer'] != 'null' ){
                        $c['renderer'] = $field['renderer'];
                    }
                    if ( $field['formatter'] != 'null' ){
                        $c['formatter'] = $field['formatter'];
                    }
                    if ( $field['aggregator'] != 'null' ){
                        $c['aggregator'] = $field['aggregator'];
                    }

                    //$c['aggregator']=[];
                    
                    $c['settings']=[];
                    $c['settings']['formatters']=[];
                    $c['settings']['formatter'] = 'number("0")';
                    $c['settings']['formatters']['0'] = 'number("0")';
                    $c['settings']['formatters']['0.00'] = 'number("0.00")';
                    $c['settings']['formatters']['0,000.00'] = 'number("0,000.00")';
                    $c['settings']['formatters']['0%'] = 'number("0%")';
                    $c['settings']['formatters']['0.00%'] = 'number("0.00%")';
                    

                    $config['plugins']['pivotconfigurator']['fields'][] = $c;
                }
                
                /*
                echo json_encode($config,JSON_PRETTY_PRINT);
                exit();
                */
                App::result('config', $config);
                App::result('success', true);
            } catch (\Exception $e) {
                App::result('msg', $e->getMessage());
            }
        },['get'],true);

        BasicRoute::add('/pivotdata/configuration/(?P<id>[\w.\/\-]+)',function($matches){
            App::contenttype('application/json');
            $session = App::get('session');
            $db = $session->getDB();
            try {
                $id = $matches['id'];
                $input= json_decode(file_get_contents('php://input'),true);
                if (is_null($input)) throw new \Exception("Error Processing Request", 1);

                $pivot_configuration = DSTable::init($db)
                    ->t('pivot_configuration')
                    ->f('id','=',$id)
                    ->limit(1);

                $config = $pivot_configuration->read()->getSingle();
                if ($pivot_configuration->error()){
                    throw new \Exception($pivot_configuration->errorMessage());
                }
                // lesen und ggf. anlegen, view_readtable gibt die nötigen Daten zurück
                App::result('config',$config);
                $pivot_configuration->insert($config,['update'=>true]);
                if ($pivot_configuration->error()){
                    throw new \Exception($pivot_configuration->errorMessage());
                }


                $tops=[];
                foreach($input['topAxis'] as $top){
                    $tops[] = [
                        'id'=>$top['dataIndex'],
                        'pivot_configuration_id'=>$id,
                        'position'=>$top['position'],
                        'column_name'=>$top['dataIndex'],
                        'name'=>$top['header'],
                        'label_renderer'=>(isset($top['labelRenderer']))?$top['labelRenderer']:'null'
                    ];
                }
                $pivot_configuration_top = DSTable::init($db)
                    ->t('pivot_configuration_top');
                $pivot_configuration_top->insert($tops,['update'=>true]);
                if ($pivot_configuration_top->error()){
                    throw new \Exception($pivot_configuration_top->errorMessage());
                }

                $lefts=[];
                foreach($input['leftAxis'] as $left){
                    $lefts[] = [
                        'id'=>$left['dataIndex'],
                        'pivot_configuration_id'=>$id,
                        'position'=>$left['position'],
                        'column_name'=>$left['dataIndex'],
                        'name'=>$left['header'],
                        'label_renderer'=>(isset($left['labelRenderer']))?$left['labelRenderer']:'null'
                    ];
                }
                $pivot_configuration_left = DSTable::init($db)
                    ->t('pivot_configuration_left');
                $pivot_configuration_left->insert($lefts,['update'=>true]);
                if ($pivot_configuration_left->error()){
                    throw new \Exception($pivot_configuration_left->errorMessage());
                }

                $aggregates=[];
                $formaterMap = $db->direct('select id,formatter from pivot_formater',[],'formatter');

                foreach($input['aggregate'] as $aggregate){
                    if (!$formaterMap[(isset($aggregate['formatter']))?$aggregate['formatter']:'null'])
                    {
                        throw new \Exception('Formatter '.$aggregate['formatter'].' not found');
                    }
                    $frmt = $formaterMap[(isset($aggregate['formatter']))?$aggregate['formatter']:'null'];

                    $aggregates[] = [
                        'id'=>$aggregate['dataIndex'],
                        'pivot_configuration_id'=>$id,
                        'column_name'=>$aggregate['dataIndex'],
                        'name'=>$aggregate['header'],
                        'align'=>$aggregate['align'],
                        'aggregator'=>$aggregate['aggregator'],
                        'renderer'=>(isset($aggregate['renderer']))?$aggregate['renderer']:'null',
                        'label_renderer'=>(isset($aggregate['labelRenderer']))?$aggregate['labelRenderer']:'null',
                        'formatter'=>$frmt['id']
                    ];
                }
                $pivot_configuration_aggregators = DSTable::init($db)
                    ->t('pivot_configuration_aggregators');
                $pivot_configuration_aggregators->insert($aggregates,['update'=>true]);
                App::result('aggregates',$aggregates);
                if ($pivot_configuration_aggregators->error()){
                    throw new \Exception($pivot_configuration_aggregators->errorMessage());
                }


            }
            catch (\Exception $e) {
                App::result('msg', $e->getMessage());
            }
        },['post'],true);
    }
}