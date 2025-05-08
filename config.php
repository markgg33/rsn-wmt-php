<?php

session_name("WMT_SESSION");

ini_set('session.gc_maxlifetime', 43200);
ini_set('session.cookie_lifetime', 43200);
//ini_set('session.gc_probability', 1);
//ini_set('session.gc_divisor', 100);

// Database connection
session_start();
$conn = mysqli_connect('localhost', 'root', 'P@ssword3309807', 'work_mode_tracker');

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
