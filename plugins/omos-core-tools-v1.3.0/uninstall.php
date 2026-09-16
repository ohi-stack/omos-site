<?php
if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

delete_option('omos_core_tools_node_url');

global $wpdb;
$wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_omos_bridge_%' OR option_name LIKE '_transient_timeout_omos_bridge_%'");
