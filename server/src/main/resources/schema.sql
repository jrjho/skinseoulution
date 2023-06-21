

create table IF NOT EXISTS users(
   hashedText varchar(45) not null,
   image mediumblob not null,
  constraint user_pk primary key (hashedText)
  );

  create table IF NOT EXISTS userprofile(

	userprofile_id	int not null auto_increment,
    hashedText		varchar(45) not null,
	pores			boolean not null,
    blackheads		boolean not null,
    acnes			boolean not null,
    darkcircles		boolean not null,
    wrinkles		boolean not null,
    spots			boolean not null,
    eyepouch		boolean not null,
    lefteyelids		boolean not null,
    righteyelids	boolean not null,
    mole			boolean not null,
	default_value	boolean not null,
    constraint		userprofile_pk primary key (userprofile_id ),
    constraint 		user_key_fk foreign key(hashedText) references users(hashedText)
);

create table IF NOT EXISTS procedures(
	procedure_id 	int not null auto_increment,
    location		varchar(100) not null,
    procedure_tag	varchar(100) not null,
    procedure_name  varchar(100) not null,
    partner_name	varchar(100) not null,
    image			varchar(100) not null,
    url				varchar(100) not null,
    current_price	varchar(100) not null,
    usual_price 	varchar(100) not null,
    average_price	varchar(100) not null,
    constraint procedure_pk primary key (procedure_id)
  );

  