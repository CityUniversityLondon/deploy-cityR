<?php

	$files = glob("*.png");

	foreach ($files as $v) {
		echo("<p><img width='30px' src='$v' alt='$v'/></p><p>https://s1.city.ac.uk/cityr/i/map-icons/$v</p>");
	}

?>
