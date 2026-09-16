<?php

if (!defined('ABSPATH')) {
    exit;
}

final class OMOS_Runtime_Client {
    private $base_url;

    public function __construct($base_url) {
        $this->base_url = untrailingslashit(esc_url_raw($base_url));
    }

    public function base_url() {
        return $this->base_url;
    }

    public function health() {
        return $this->get_json('/api/health');
    }

    public function manifest() {
        return $this->get_json('/api/manifest');
    }

    public function providers() {
        return $this->get_json('/api/v1/providers');
    }

    public function persistence() {
        return $this->get_json('/api/v1/persistence');
    }

    public function request($method, $path, $body = null, $requires_auth = false) {
        if (!$this->base_url || strpos($this->base_url, 'https://') !== 0) {
            return new WP_Error('omos_invalid_runtime_url', 'OMOS runtime URL must use HTTPS.');
        }

        $headers = array(
            'Accept' => 'application/json',
            'User-Agent' => 'OMOS-Core-Tools/' . OMOS_CORE_TOOLS_VERSION . '; ' . home_url('/'),
        );

        if ($requires_auth) {
            $key = $this->runtime_key();
            if (!$key) {
                return new WP_Error('omos_runtime_key_missing', 'Authenticated OMOS request blocked because OMOS_RUNTIME_API_KEY is not configured server-side.');
            }
            $headers['x-omos-key'] = $key;
        }

        $args = array(
            'method' => strtoupper($method),
            'timeout' => 10,
            'redirection' => 2,
            'headers' => $headers,
            'sslverify' => true,
        );

        if ($body !== null) {
            $args['headers']['Content-Type'] = 'application/json';
            $args['body'] = wp_json_encode($body);
        }

        $response = wp_remote_request($this->base_url . '/' . ltrim($path, '/'), $args);
        if (is_wp_error($response)) {
            return $response;
        }

        $status = (int) wp_remote_retrieve_response_code($response);
        $raw = (string) wp_remote_retrieve_body($response);
        $json = json_decode($raw, true);

        if ($status < 200 || $status >= 300) {
            return new WP_Error('omos_runtime_http_error', 'OMOS runtime returned HTTP ' . $status . '.', array('status' => $status));
        }

        if (!is_array($json)) {
            return new WP_Error('omos_runtime_invalid_json', 'OMOS runtime returned an invalid JSON response.');
        }

        return $json;
    }

    public function safe_connection_status() {
        $health = $this->health();
        if (is_wp_error($health)) {
            return array(
                'connected' => false,
                'status' => 'UNAVAILABLE',
                'runtime_url' => $this->base_url,
                'error' => sanitize_text_field($health->get_error_message()),
            );
        }

        return array(
            'connected' => true,
            'status' => 'CONNECTED',
            'runtime_url' => $this->base_url,
            'runtime_status' => isset($health['status']) ? sanitize_text_field((string) $health['status']) : 'unknown',
            'runtime_version' => isset($health['version']) ? sanitize_text_field((string) $health['version']) : null,
            'authenticated_requests_configured' => (bool) $this->runtime_key(),
        );
    }

    private function get_json($path) {
        return $this->request('GET', $path, null, false);
    }

    private function runtime_key() {
        if (defined('OMOS_RUNTIME_API_KEY') && is_string(OMOS_RUNTIME_API_KEY)) {
            return trim(OMOS_RUNTIME_API_KEY);
        }
        return '';
    }
}
