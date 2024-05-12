DELIMITER;
SET FOREIGN_KEY_CHECKS=0;
INSERT INTO `ds` (`allowform`,`class_name`,`combined`,`default_pagesize`,`displayfield`,`existsreal`,`listselectionmodel`,`listviewbaseclass`,`modelbaseclass`,`phpexporter`,`phpexporterfilename`,`searchfield`,`showactionbtn`,`sortfield`,`table_name`,`title`) VALUES ('1','Pivot','0','1000','id','1','cellmodel','Tualo.DataSets.ListView','Tualo.DataSets.model.Basic','XlsxWriter','pivot_formater_{DATE}','id','1','id','pivot_formater','Pivot: Formatierer') ON DUPLICATE KEY UPDATE `allowform`=values(`allowform`),`class_name`=values(`class_name`),`combined`=values(`combined`),`default_pagesize`=values(`default_pagesize`),`displayfield`=values(`displayfield`),`existsreal`=values(`existsreal`),`listselectionmodel`=values(`listselectionmodel`),`listviewbaseclass`=values(`listviewbaseclass`),`modelbaseclass`=values(`modelbaseclass`),`phpexporter`=values(`phpexporter`),`phpexporterfilename`=values(`phpexporterfilename`),`searchfield`=values(`searchfield`),`showactionbtn`=values(`showactionbtn`),`sortfield`=values(`sortfield`),`table_name`=values(`table_name`),`title`=values(`title`); 
INSERT IGNORE INTO `ds_column` (`character_maximum_length`,`character_set_name`,`column_key`,`column_name`,`column_type`,`data_type`,`existsreal`,`fieldtype`,`is_nullable`,`privileges`,`table_name`,`writeable`) VALUES ('255','utf8mb4','','formatter','varchar(255)','varchar','1','','NO','select,insert,update,references','pivot_formater','1') ; 
INSERT IGNORE INTO `ds_column` (`character_maximum_length`,`character_set_name`,`column_key`,`column_name`,`column_type`,`data_type`,`existsreal`,`fieldtype`,`is_nullable`,`privileges`,`table_name`,`writeable`,`character_maximum_length`,`character_set_name`,`column_key`,`column_name`,`column_type`,`data_type`,`existsreal`,`fieldtype`,`is_nullable`,`is_primary`,`privileges`,`table_name`,`writeable`) VALUES ('255','utf8mb4','','formatter','varchar(255)','varchar','1','','NO','select,insert,update,references','pivot_formater','1','36','utf8mb4','PRI','id','varchar(36)','varchar','1','','NO','1','select,insert,update,references','pivot_formater','1') ; 
INSERT IGNORE INTO `ds_column_list_label` (`active`,`column_name`,`editor`,`filterstore`,`flex`,`grouped`,`hidden`,`label`,`language`,`listfiltertype`,`position`,`renderer`,`summaryrenderer`,`summarytype`,`table_name`,`xtype`) VALUES ('1','formatter','','','1.00','0','0','Formatierer','DE','','1','','','','pivot_formater','gridcolumn') ; 
INSERT IGNORE INTO `ds_column_list_label` (`active`,`column_name`,`editor`,`filterstore`,`flex`,`grouped`,`hidden`,`label`,`language`,`listfiltertype`,`position`,`renderer`,`summaryrenderer`,`summarytype`,`table_name`,`xtype`,`active`,`column_name`,`editor`,`filterstore`,`flex`,`grouped`,`hidden`,`label`,`language`,`listfiltertype`,`position`,`renderer`,`summaryrenderer`,`summarytype`,`table_name`,`xtype`) VALUES ('1','formatter','','','1.00','0','0','Formatierer','DE','','1','','','','pivot_formater','gridcolumn','1','id','','','1.00','0','0','ID','DE','','0','','','','pivot_formater','gridcolumn') ; 
INSERT IGNORE INTO `ds_column_form_label` (`active`,`allowempty`,`column_name`,`field_path`,`flex`,`hidden`,`label`,`language`,`position`,`table_name`,`xtype`) VALUES ('1','0','formatter','Allgemein/Angaben','1.00','0','Formatierer','DE','1','pivot_formater','textfield') ; 
INSERT IGNORE INTO `ds_column_form_label` (`active`,`allowempty`,`column_name`,`field_path`,`flex`,`hidden`,`label`,`language`,`position`,`table_name`,`xtype`,`active`,`allowempty`,`column_name`,`field_path`,`flex`,`hidden`,`label`,`language`,`position`,`table_name`,`xtype`) VALUES ('1','0','formatter','Allgemein/Angaben','1.00','0','Formatierer','DE','1','pivot_formater','textfield','1','0','id','Allgemein/Angaben','1.00','0','ID','DE','0','pivot_formater','textfield') ; 
INSERT IGNORE INTO `ds_dropdownfields` (`displayfield`,`filterconfig`,`idfield`,`name`,`table_name`) VALUES ('formatter','','id','id','pivot_formater') ; 
INSERT IGNORE INTO `ds_access` (`append`,`delete`,`read`,`role`,`table_name`,`write`) VALUES ('0','0','1','_default_','pivot_formater','0') ; 
INSERT IGNORE INTO `ds_access` (`append`,`delete`,`read`,`role`,`table_name`,`write`,`append`,`delete`,`read`,`role`,`table_name`,`write`) VALUES ('0','0','1','_default_','pivot_formater','0','1','1','0','administration','pivot_formater','1') ; 
SET FOREIGN_KEY_CHECKS=1;