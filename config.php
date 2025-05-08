<?php

ini_set('session.gc_maxlifetime', 86400);
ini_set('session.cookie_lifetime', 86400);
ini_set('session.gc_probability', 1);
ini_set('session.gc_divisor', 100);

// Database connection
session_start();
$conn = mysqli_connect('localhost', 'root', 'P@ssword3309807', 'work_mode_tracker');

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
