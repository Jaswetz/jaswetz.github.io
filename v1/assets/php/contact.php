<?php

if($_POST){

	$name = $_POST['visitors-name'];
	$email = $_POST['visitors-email'];
	$message  = $_POST['visitors-message'];
	$email_body = "";

	$email_body = $email_body . "Name: " . $name . "\n";
	$email_body = $email_body . "email: " . $email . "\n";
	$email_body = $email_body . "Message: " . $message . "\n";

	//send email
	if (mail("swetzoff@gmail.com", "Shapes Like Water contact form", $email_body)) {
	    	echo '{"result": true}';
	} else {
		echo '{"result": false}';
	}
}

?>