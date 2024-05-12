delimiter;
insert ignore into ds_class (class_name) values ( 'Pivot');

create table if not exists pivot_configuration (
    id varchar(36) primary key,
    name varchar(255) not null,
    
    table_name varchar(255) not null,
    constraint fk_pivot_configuration_table_name foreign key (table_name) references ds (table_name)
        on delete cascade
        on update cascade
);

create or replace view view_readtable_pivot_configuration as
select 
    ifnull(pc.id,ds.table_name) as id,
    ifnull(pc.name, ds.title) as name,
    ds.table_name
from 
    ds
    left join pivot_configuration pc
        on ds.table_name = pc.table_name
        and ds.title<>'' 
        and ds.title is not null
;

create table if not exists pivot_formater (
    id varchar(36) primary key,
    formatter varchar(255) not null
);
insert ignore into pivot_formater (id, formatter) values 
    ('null', '----'),
    ('0', 'number("0")'),
    ('0%', 'number("0%")'),
    ( '0.00', 'number("0.00")'),
    ( '0.00%', 'number("0.00%")'),
    ('0,000.00', 'number("0,000.00")')
;

create table if not exists pivot_aggregators (
    id varchar(36) primary key,
    aggregator varchar(255) not null
);
insert ignore into pivot_aggregators (id, aggregator) values 
    ('null', 'null'),
    ('sum', 'sum'),
    ('avg', 'avg'),
    ('count', 'count'),
    ('min', 'min'),
    ('max', 'max')
;

create table if not exists pivot_renderer (
    id varchar(36) primary key,
    renderer varchar(255) not null
);
insert ignore into pivot_renderer (id, renderer) values 
    ('null', 'Nicht verwendet')
;


create table if not exists pivot_configuration_fields (
    id varchar(36) primary key,
    pivot_configuration_id varchar(36) not null,
    name varchar(255) not null,
    column_name varchar(255) not null,
    aggregator varchar(36) not null,
    formatter varchar(36) not null,

    label_renderer varchar(36) not null default 'null',
    constraint fk_pivot_configuration_fields_label_renderer foreign key (label_renderer) references pivot_renderer (id)
        on delete cascade
        on update cascade,

    renderer varchar(36) not null default 'null',
    constraint fk_pivot_configuration_fields_renderer foreign key (renderer) references pivot_renderer (id)
        on delete cascade
        on update cascade,


    constraint fk_pivot_configuration_fields_pivot_configuration_id foreign key (pivot_configuration_id) references pivot_configuration (id)
        on delete cascade
        on update cascade,

    constraint fk_pivot_configuration_fields_aggregator foreign key (aggregator) references pivot_aggregators (id)
        on delete cascade
        on update cascade,

    constraint fk_pivot_configuration_fields_formatter foreign key (formatter) references pivot_formater (id)
        on delete cascade
        on update cascade

) ;

create or replace view view_readtable_pivot_configuration_fields as
select 
    ifnull(pcf.id,dsc.column_name) as id,
    ifnull(pcf.pivot_configuration_id, pc.id) as pivot_configuration_id,
    ifnull(pcf.name, dsc.label) as name,
    pc.table_name,
    ifnull(pcf.column_name, dsc.column_name) as column_name,

    ifnull(pcf.aggregator, 'null') as aggregator,
    ifnull(pcf.formatter, 'null') as formatter,
    ifnull(pcf.label_renderer, 'null') as label_renderer,
    ifnull(pcf.renderer, 'null') as renderer
from
    ds
    join view_readtable_ds_column_list_label_all dsc
        on ds.table_name = dsc.table_name
    left join view_readtable_pivot_configuration pc
        on ds.table_name = pc.table_name
    left join pivot_configuration_fields pcf
        on pc.id = pcf.pivot_configuration_id
        and dsc.column_name = pcf.column_name
;


create table if not exists pivot_configuration_top (
    id varchar(36) not null,
    pivot_configuration_id varchar(36) not null,
    primary key (id, pivot_configuration_id),
    
    position integer not null,
    column_name varchar(255) not null,
    name varchar(255) not null,

    constraint fk_pivot_configuration_top_pivot_configuration_id foreign key (pivot_configuration_id) references pivot_configuration (id)
        on delete cascade
        on update cascade,
    
    label_renderer varchar(36) not null,
    constraint fk_pivot_configuration_top_label_renderer foreign key (label_renderer) references pivot_renderer (id)
        on delete cascade
        on update cascade
);

create table if not exists pivot_configuration_left (
    id varchar(36) not null,
    pivot_configuration_id varchar(36) not null,
    primary key (id, pivot_configuration_id),
    
    position integer not null,
    column_name varchar(255) not null,
    name varchar(255) not null,

    constraint fk_pivot_configuration_left_pivot_configuration_id foreign key (pivot_configuration_id) references pivot_configuration (id)
        on delete cascade
        on update cascade,
    
    label_renderer varchar(36) not null,
    constraint fk_pivot_configuration_left_label_renderer foreign key (label_renderer) references pivot_renderer (id)
        on delete cascade
        on update cascade
);



create table if not exists pivot_configuration_aggregators (

        id varchar(36) not null,
    pivot_configuration_id varchar(36) not null,
    primary key (id, pivot_configuration_id),

    position integer not null,
    column_name varchar(255) not null,
    name varchar(255) not null,
    align varchar(36) not null,
    

    constraint fk_pivot_configuration_aggregators_pivot_configuration_id foreign key (pivot_configuration_id) references pivot_configuration (id)
        on delete cascade
        on update cascade,
    
    aggregator varchar(36) not null,
    constraint fk_pivot_configuration_aggregators_aggregator foreign key (aggregator) references pivot_aggregators (id)
        on delete cascade
        on update cascade,
    
    formatter varchar(36) not null,
    constraint fk_pivot_configuration_aggregators_formatter foreign key (formatter) references pivot_formater (id)
        on delete cascade
        on update cascade,

    renderer varchar(36) not null,
    constraint fk_pivot_configuration_aggregators_renderer foreign key (renderer) references pivot_renderer (id)
        on delete cascade
        on update cascade

    
);