-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: artgame.ckbon43yq26g.us-east-2.rds.amazonaws.com:3307
-- Generation Time: Nov 19, 2017 at 08:52 PM
-- Server version: 5.7.17-log
-- PHP Version: 7.0.22-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ArtGame`
--

-- --------------------------------------------------------

--
-- Table structure for table `Admin`
--

CREATE TABLE `Admin` (
  `player_id` int(11) NOT NULL PRIMARY KEY,
  `role_description` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Admin`
--

INSERT INTO `Admin` (`player_id`, `role_description`) VALUES
(1, 'Admin of all things');

-- --------------------------------------------------------

--
-- Table structure for table `Board`
--

CREATE TABLE `Board` (
  `board_id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `creator_id` int(11) NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Board`
--

INSERT INTO `Board` (`board_id`, `name`, `creator_id`, `is_deleted`) VALUES
(1, 'lame board', 1, 0),
(2, 'TheCoolBoard', 2, 0),
(3, 'deleteTest', 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `History`
--

CREATE TABLE `History` (
  `history_id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `date_time` timestamp NOT NULL,
  `tile_id` int(11) NOT NULL,
  `player_id` int(11) NOT NULL,
  `color` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `History`
--

INSERT INTO `History` (`history_id`, `date_time`, `tile_id`, `player_id`, `color`) VALUES
(1, '2017-11-17 01:16:39', 1, 1, 'blue'),
(2, '2017-11-17 01:17:14', 5, 2, 'Yellow'),
(3, '2017-11-17 02:17:32', 2, 2, 'red');

-- --------------------------------------------------------

--
-- Table structure for table `HistoryTileType`
--

CREATE TABLE `HistoryTileType` (
  `history_id` int(11) NOT NULL,
  `type_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `HistoryTileType`
--

INSERT INTO `HistoryTileType` (`history_id`, `type_id`) VALUES
(1, 1),
(2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `PlayerLocation`
--

CREATE TABLE `PlayerLocation` (
  `player_id` int(11) NOT NULL,
  `board_id` int(11) NOT NULL,
  `location_x` int(11) NOT NULL,
  `location_y` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `PlayerLocation`
--

INSERT INTO `PlayerLocation` (`player_id`, `board_id`, `location_x`, `location_y`) VALUES
(1, 1, 5, 0),
(2, 1, 5, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Players`
--

CREATE TABLE `Players` (
  `player_id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `display_name` varchar(64) NOT NULL,
  `username` varchar(64) NOT NULL,
  `encrypted_password` varchar(64) NOT NULL,
  `sprite_id` int(11) NOT NULL,
  `email` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Players`
--

INSERT INTO `Players` (`player_id`, `display_name`, `username`, `encrypted_password`, `sprite_id`, `email`) VALUES
(0, 'test3', 'test2', 'test1', 1, 'test2'),
(1, 'Slaggathor', 'StevenMer', 'test', 1, NULL),
(2, 'dsmiles', 'dsmiles', 'test', 2, NULL),
(3, 'test', 'test', 'test', 1, NULL),
(4, 'bob', 'bob', 'test', 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `Sprites`
--

CREATE TABLE `Sprites` (
  `sprite_id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `image_url` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Sprites`
--

INSERT INTO `Sprites` (`sprite_id`, `image_url`) VALUES
(1, 'Sprite1'),
(2, 'HULK'),
(3, 'IRONMAN');

-- --------------------------------------------------------

--
-- Table structure for table `Tile`
--

CREATE TABLE `Tile` (
  `tile_id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `board_id` int(11) NOT NULL,
  `x` int(11) NOT NULL,
  `y` int(11) NOT NULL,
  `color` varchar(64) NOT NULL,
  `creator_id` int(11) NOT NULL,
  `last_modified_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Tile`
--

INSERT INTO `Tile` (`tile_id`, `board_id`, `x`, `y`, `color`, `creator_id`, `last_modified_id`) VALUES
(1, 1, 5, 6, 'Red', 1, 1),
(2, 1, 1, 1, 'Grey', 1, 1),
(3, 1, -1, -1, 'Yellow', 2, 1),
(4, 1, -100, -100, 'Pink', 2, 2),
(5, 1, 100, 100, 'Blue', 4, 1);

-- --------------------------------------------------------

--
-- Table structure for table `TileType`
--

CREATE TABLE `TileType` (
  `tile_id` int(11) NOT NULL,
  `type_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `TileType`
--

INSERT INTO `TileType` (`tile_id`, `type_id`) VALUES
(1, 1),
(2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `TypesOfTiles`
--

CREATE TABLE `TypesOfTiles` (
  `type_id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `type_name` varchar(64) NOT NULL,
  `description` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `TypesOfTiles`
--

INSERT INTO `TypesOfTiles` (`type_id`, `type_name`, `description`) VALUES
(1, 'bouncy', 'its bouncy'),
(2, 'slidy', 'slide around a lot');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Board`
--
ALTER TABLE `Board`
  ADD KEY `creator_id` (`creator_id`);

--
-- Indexes for table `History`
--
ALTER TABLE `History`
  ADD KEY `tile_id` (`tile_id`),
  ADD KEY `player_id` (`player_id`);

--
-- Indexes for table `HistoryTileType`
--
ALTER TABLE `HistoryTileType`
  ADD PRIMARY KEY (`history_id`,`type_id`),
  ADD KEY `type_id` (`type_id`);

--
-- Indexes for table `PlayerLocation`
--
ALTER TABLE `PlayerLocation`
  ADD PRIMARY KEY (`player_id`),
  ADD KEY `board_id` (`board_id`);

--
-- Indexes for table `Players`
--
ALTER TABLE `Players`
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `sprite_id` (`sprite_id`);

--
-- Indexes for table `Tile`
--
ALTER TABLE `Tile`
  ADD UNIQUE KEY `board_id` (`board_id`,`x`,`y`),
  ADD KEY `creator_id` (`creator_id`),
  ADD KEY `last_modified_id` (`last_modified_id`);

--
-- Indexes for table `TileType`
--
ALTER TABLE `TileType`
  ADD UNIQUE KEY (`tile_id`,`type_id`),
  ADD KEY `type_id` (`type_id`);

--
-- Indexes for table `TypesOfTiles`
--
ALTER TABLE `TypesOfTiles`
  ADD UNIQUE KEY `type_name` (`type_name`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Admin`
--
ALTER TABLE `Admin`
  ADD CONSTRAINT `Admin_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `Players` (`player_id`);

--
-- Constraints for table `Board`
--
ALTER TABLE `Board`
  ADD CONSTRAINT `Board_ibfk_1` FOREIGN KEY (`creator_id`) REFERENCES `Players` (`player_id`);

--
-- Constraints for table `History`
--
ALTER TABLE `History`
  ADD CONSTRAINT `History_ibfk_1` FOREIGN KEY (`tile_id`) REFERENCES `Tile` (`tile_id`),
  ADD CONSTRAINT `History_ibfk_2` FOREIGN KEY (`player_id`) REFERENCES `Players` (`player_id`);

--
-- Constraints for table `HistoryTileType`
--
ALTER TABLE `HistoryTileType`
  ADD CONSTRAINT `HistoryTileType_ibfk_1` FOREIGN KEY (`history_id`) REFERENCES `History` (`history_id`),
  ADD CONSTRAINT `HistoryTileType_ibfk_2` FOREIGN KEY (`type_id`) REFERENCES `TypesOfTiles` (`type_id`);

--
-- Constraints for table `PlayerLocation`
--
ALTER TABLE `PlayerLocation`
  ADD CONSTRAINT `PlayerLocation_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `Players` (`player_id`),
  ADD CONSTRAINT `PlayerLocation_ibfk_2` FOREIGN KEY (`board_id`) REFERENCES `Board` (`board_id`);

--
-- Constraints for table `Players`
--
ALTER TABLE `Players`
  ADD CONSTRAINT `Players_ibfk_1` FOREIGN KEY (`sprite_id`) REFERENCES `Sprites` (`sprite_id`);

--
-- Constraints for table `Tile`
--
ALTER TABLE `Tile`
  ADD CONSTRAINT `Tile_ibfk_1` FOREIGN KEY (`board_id`) REFERENCES `Board` (`board_id`),
  ADD CONSTRAINT `Tile_ibfk_2` FOREIGN KEY (`creator_id`) REFERENCES `Players` (`player_id`),
  ADD CONSTRAINT `Tile_ibfk_3` FOREIGN KEY (`last_modified_id`) REFERENCES `Players` (`player_id`);

--
-- Constraints for table `TileType`
--
ALTER TABLE `TileType`
  ADD CONSTRAINT `TileType_ibfk_1` FOREIGN KEY (`tile_id`) REFERENCES `Tile` (`tile_id`),
  ADD CONSTRAINT `TileType_ibfk_2` FOREIGN KEY (`type_id`) REFERENCES `TypesOfTiles` (`type_id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
