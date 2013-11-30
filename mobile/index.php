<?php
require_once '../configs/config.php'; //Load configs first

function __autoload($class_name) {
    include $class_name.'.php';
}

set_include_path(implode(PATH_SEPARATOR, array(
    get_include_path(),
    realpath(APPLICATION_PATH.'/lib'),
    realpath(APPLICATION_PATH.'/lib/ZendLite-1.3')
)));

require_once('WebsiteApplication.php');
$application = new WebsiteApplication();
$application->run();
$VIEW = $application->getViewObject();

require_once $application->getHeaderPath();

require_once $application->getViewPath();

require_once $application->getFooterPath();
