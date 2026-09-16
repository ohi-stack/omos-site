<?php
if (!defined('ABSPATH')) {
    exit;
}

final class OMOS_Runtime_Client {
    const SETTINGS_OPTION = 'omos_core_tools_settings';
    const CACHE_PREFIX = 'omos_core_tools_v150_';

    public function defaults() {
        return array(
            'runtime_url'   => 'https://omos.onegodian.com',
            'public_url'    => 'https://omos.onegodian.org',
            'cache_minutes' => 5,
            'node_name'     => get_bloginfo('name'),
            'node_role'     => 'wordpress-client',
            'api_key'       => '',
        );
    }

    public function settings() {
        return wp_parse_args(get_option(self::SETTINGS_OPTION, array()), $this->defaults());
    }

    public function sanitize_settings($value) {
        $defaults = $this->defaults();
        $current = $this->settings();
        $value = is_array($value) ? $value : array();

        return array(
            'runtime_url'   => $this->sanitize_https_url(isset($value['runtime_url']) ? $value['runtime_url'] : $current['runtime_url'], $defaults['runtime_url']),
            'public_url'    => $this->sanitize_https_url(isset($value['public_url']) ? $value['public_url'] : $current['public_url'], $defaults['public_url']),
            'cache_minutes' => max(1, min(60, absint(isset($value['cache_minutes']) ? $value['cache_minutes'] : $current['cache_minutes']))),
            'node_name'     => sanitize_text_field(isset($value['node_name']) ? $value['node_name'] : $current['node_name']),
            'node_role'     => sanitize_key(isset($value['node_role']) ? $value['node_role'] : $current['node_role']),
            'api_key'       => isset($value['api_key']) ? sanitize_text_field($value['api_key']) : (string) $current['api_key'],
        );
    }

    private function sanitize_https_url($value, $fallback) {
        $url = esc_url_raw($value, array('https'));
        if (!$url || 'https' !== wp_parse_url($url, PHP_URL_SCHEME)) {
            return $fallback;
        }
        return untrailingslashit($url);
    }

    public function runtime_url($path = '') {
        $settings = $this->settings();
        return untrailingslashit($settings['runtime_url']) . ($path ? '/' . ltrim($path, '/') : '');
    }

    public function public_url($path = '') {
        $settings = $this->settings();
        return untrailingslashit($settings['public_url']) . ($path ? '/' . ltrim($path, '/') : '');
    }

    public function bridge_key_source() {
        if (defined('OMOS_BRIDGE_API_KEY') && OMOS_BRIDGE_API_KEY) {
            return 'environment';
        }
        $settings = $this->settings();
        return !empty($settings['api_key']) ? 'wordpress-option-legacy' : 'not-configured';
    }

    private function bridge_key() {
        if (defined('OMOS_BRIDGE_API_KEY') && OMOS_BRIDGE_API_KEY) {
            return (string) OMOS_BRIDGE_API_KEY;
        }
        $settings = $this->settings();
        return isset($settings['api_key']) ? (string) $settings['api_key'] : '';
    }

    private function cache_key($path) {
        return self::CACHE_PREFIX . md5($path);
    }

    public function clear_cache() {
        foreach (array('api/health', 'health', 'api/manifest', 'manifest', 'api/v1/providers', 'api/v1/persistence') as $path) {
            delete_transient($this->cache_key($path));
        }
    }

    public function request($method, $path, $body = null, $authenticated = false, $cache = false) {
        $method = strtoupper((string) $method);
        $path = ltrim((string) $path, '/');
        $cache_key = $this->cache_key($path);

        if ($cache && 'GET' === $method) {
            $cached = get_transient($cache_key);
            if (false !== $cached) {
                return $cached;
            }
        }

        $headers = array(
            'Accept'       => 'application/json',
            'Content-Type' => 'application/json',
            'User-Agent'   => 'OMOS-Core-Tools/' . OMOS_CORE_TOOLS_VERSION . '; ' . home_url('/'),
        );

        if ($authenticated) {
            $key = $this->bridge_key();
            if (!$key) {
                return array('ok' => false, 'status' => 503, 'error' => 'bridge_key_not_configured', 'data' => null);
            }
            $headers['x-omos-key'] = $key;
        }

        $args = array(
            'method'      => $method,
            'headers'     => $headers,
            'timeout'     => 15,
            'redirection' => 2,
        );

        if (null !== $body) {
            $args['body'] = wp_json_encode($body);
        }

        $response = wp_safe_remote_request($this->runtime_url($path), $args);
        if (is_wp_error($response)) {
            return array('ok' => false, 'status' => 0, 'error' => $response->get_error_message(), 'data' => null);
        }

        $code = (int) wp_remote_retrieve_response_code($response);
        $raw = wp_remote_retrieve_body($response);
        $decoded = json_decode($raw, true);
        $result = array(
            'ok'     => $code >= 200 && $code < 300,
            'status' => $code,
            'error'  => ($code >= 200 && $code < 300) ? '' : 'runtime_http_' . $code,
            'data'   => (JSON_ERROR_NONE === json_last_error()) ? $decoded : $raw,
        );

        if ($cache && $result['ok'] && 'GET' === $method) {
            $settings = $this->settings();
            set_transient($cache_key, $result, max(1, (int) $settings['cache_minutes']) * MINUTE_IN_SECONDS);
        }

        return $result;
    }

    public function health($force = false) {
        $result = $this->request('GET', 'api/health', null, false, !$force);
        if (!$result['ok']) {
            $result = $this->request('GET', 'health', null, false, !$force);
        }
        return $result;
    }

    public function manifest($force = false) {
        $result = $this->request('GET', 'api/manifest', null, false, !$force);
        if (!$result['ok']) {
            $result = $this->request('GET', 'manifest', null, false, !$force);
        }
        return $result;
    }

    public function providers($force = false) {
        return $this->request('GET', 'api/v1/providers', null, false, !$force);
    }

    public function persistence($force = false) {
        return $this->request('GET', 'api/v1/persistence', null, false, !$force);
    }

    public function ask($prompt) {
        return $this->request('POST', 'api/v1/council/run', array(
            'prompt'  => sanitize_textarea_field($prompt),
            'source'  => 'wordpress',
            'user_id' => get_current_user_id(),
            'node'    => home_url('/'),
        ), true, false);
    }
}
