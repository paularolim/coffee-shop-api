DROP DATABASE IF EXISTS coffee_shop;
DROP DATABASE IF EXISTS coffee_shop_dev;
DROP DATABASE IF EXISTS coffee_shop_test;

CREATE DATABASE IF NOT EXISTS coffee_shop;
CREATE DATABASE IF NOT EXISTS coffee_shop_dev;
CREATE DATABASE IF NOT EXISTS coffee_shop_test;

DROP TABLE users;
DROP TABLE logs;

USE coffee_shop;
USE coffee_shop_dev;
USE coffee_shop_test;

CREATE TABLE IF NOT EXISTS users(
    id varchar(36) not null primary key,
    name varchar(255) not null,
    email varchar(255) not null unique,
    password varchar(255) not null,
    phone varchar(11) not null
);

CREATE TABLE IF NOT EXISTS logs(
    id varchar(36) not null primary key,
    stack text not null,
    date Date not null
);