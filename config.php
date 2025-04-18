<?php
// Database connection
$conn = mysqli_connect('localhost', 'root', 'P@ssword3309807', 'work_mode_tracker');

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
} 