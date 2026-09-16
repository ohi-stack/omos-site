<?php
if (!defined('ABSPATH')) {
    exit;
}

final class OMOS_Node_Client {
    const OPTION_NODE_URL = 'omos_core_tools_node_url';
    const CACHE_SECONDS = 300;

    private $allowed = array(
        'health' => '/api/health',
        'manifest' => '/api/manifest',
        'ecosystem' => '/api/ecosystem',
        'tools' => '/api/tools',
        'artifacts' => '/api/artifacts',
        'docs' => '/api/docs',
        'bridge_status' => '/api/bridge/status',
    );

    public function node_url() {
        $value = get_option(self::OPTION_NODE_URL, 'https://omos.onegodian.com');
        $value = esc_url_raw(trim((string) $value));
        return $value ?: 'https://omos.onegodian.com';
    }

    public function update_node_url($value) {
        $value = esc_url_raw(trim((string) $value));
        if (!$value) {
            return new WP_Error('omos_invalid_node_url', 'A valid OMOS Node URL is required.');
        }
        $parts = wp_parse_url($value);
        if (empty($parts['scheme']) || strtolower($parts['scheme']) !== 'https') {
            return new WP_Error('omos_node_https_required', 'The OMOS Node URL must use HTTPS.');
        }
        update_option(self::OPTION_NODE_URL, untrailingslashit($value), false);
        $this->clear_cache();
        return true;
    }

    public function endpoint($name) {
        if (!isset($this->allowed[$name])) {
            return new WP_Error('omos_endpoint_not_allowed', 'That OMOS endpoint is not allowlisted.');
        }
        return untrailingslashit($this->node_url()) . $this->allowed[$name];
    }

    public function get($name, $force = false) {
        $endpoint = $this->endpoint($name);
        if (is_wp_error($endpoint)) {
            return $endpoint;
        }

        $cache_key = 'omos_bridge_' . md5($endpoint);
        if (!$force) {
            $cached = get_transient($cache_key);
            if ($cached !== false) {
                return $cached;
            }
        }

        $started = microtime(true);
        $response = wp_remote_get($endpoint, array(
            'timeout' => 8,
            'redirection' => 3,
            'headers' => array(
                'Accept' => 'application/json',
                'User-Agent' => 'OMOS-Core-Tools/' . OMOS_CORE_TOOLS_VERSION . '; ' . home_url('/'),
            ),
        ));

        if (is_wp_error($response)) {
            return new WP_Error('omos_node_unreachable', $response->get_error_message());
        }

        $status = (int) wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);
        $decoded = json_decode($body, true);
        $latency_ms = (int) round((microtime(true) - $started) * 1000);

        if ($status < 200 || $status >= 300) {
            return new WP_Error('omos_node_http_error', 'OMOS Node returned HTTP ' . $status . '.', array('status' => $status));
        }
        if (!is_array($decoded)) {
            return new WP_Error('omos_node_invalid_json', 'OMOS Node did not return a JSON object.');
        }

        $result = array(
            'ok' => true,
            'endpoint' => $name,
            'node' => $this->node_url(),
            'latency_ms' => $latency_ms,
            'fetched_at_utc' => gmdate('c'),
            'data' => $decoded,
        );
        set_transient($cache_key, $result, self::CACHE_SECONDS);
        return $result;
    }

    public function clear_cache() {
        global $wpdb;
        $pattern = '_transient_omos_bridge_%';
        $timeout_pattern = '_transient_timeout_omos_bridge_%';
        $wpdb->query($wpdb->prepare("DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s", $pattern, $timeout_pattern));
    }

    public function safe_status() {
        $health = $this->get('health', true);
        $manifest = $this->get('manifest', true);
        return array(
            'plugin' => 'omos-core-tools',
            'plugin_version' => OMOS_CORE_TOOLS_VERSION,
            'site' => home_url('/'),
            'node' => $this->node_url(),
            'health' => is_wp_error($health) ? array('ok' => false, 'error' => $health->get_error_code()) : array('ok' => true, 'latency_ms' => $health['latency_ms']),
            'manifest' => is_wp_error($manifest) ? array('ok' => false, 'error' => $manifest->get_error_code()) : array('ok' => true, 'latency_ms' => $manifest['latency_ms']),
            'write_bridge_enabled' => false,
            'verified' => !is_wp_error($health) && !is_wp_error($manifest),
            'checked_at_utc' => gmdate('c'),
        );
    }
}
