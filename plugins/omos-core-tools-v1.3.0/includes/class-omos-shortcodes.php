<?php
if (!defined('ABSPATH')) {
    exit;
}

final class OMOS_Shortcodes {
    private $client;

    public function __construct(OMOS_Node_Client $client) {
        $this->client = $client;
    }

    public function register() {
        add_shortcode('omos_manifest', array($this, 'manifest'));
        add_shortcode('omos_runtime_status', array($this, 'runtime_status'));
        add_shortcode('omos_system_status', array($this, 'runtime_status'));
        add_shortcode('omos_ecosystem_cards', array($this, 'ecosystem'));
        add_shortcode('omos_tool_grid', array($this, 'tools'));
        add_shortcode('omos_artifact_grid', array($this, 'artifacts'));
        add_shortcode('omos_docs_grid', array($this, 'docs'));
        add_shortcode('omos_open_console_button', array($this, 'open_console'));
        add_shortcode('omos_bridge_builder', array($this, 'bridge_builder'));
        add_shortcode('omos_unity_dashboard', array($this, 'dashboard'));
    }

    private function error_card($message) {
        return '<div class="omos-core-card omos-core-unavailable"><strong>OMOS module unavailable</strong><p>' . esc_html($message) . '</p></div>';
    }

    private function fetch($name) {
        $result = $this->client->get($name);
        if (is_wp_error($result)) {
            return $result;
        }
        return $result['data'];
    }

    private function is_list_array($value) {
        if (!is_array($value)) {
            return false;
        }
        $index = 0;
        foreach (array_keys($value) as $key) {
            if ($key !== $index) {
                return false;
            }
            $index++;
        }
        return true;
    }

    private function items($payload, $preferred = array()) {
        if (!is_array($payload)) {
            return array();
        }
        foreach ($preferred as $key) {
            if (isset($payload[$key]) && is_array($payload[$key])) {
                return array_values($payload[$key]);
            }
        }
        if ($this->is_list_array($payload)) {
            return $payload;
        }
        if (isset($payload['data']) && is_array($payload['data'])) {
            return $this->is_list_array($payload['data']) ? $payload['data'] : array($payload['data']);
        }
        return array($payload);
    }

    private function cards($name, $keys) {
        $payload = $this->fetch($name);
        if (is_wp_error($payload)) {
            return $this->error_card($payload->get_error_message());
        }
        $items = $this->items($payload, $keys);
        if (!$items) {
            return $this->error_card('No public records are currently available from the OMOS Node.');
        }

        $html = '<div class="omos-core-grid">';
        foreach (array_slice($items, 0, 24) as $item) {
            if (!is_array($item)) {
                continue;
            }
            $title = isset($item['title']) ? $item['title'] : (isset($item['name']) ? $item['name'] : (isset($item['id']) ? $item['id'] : 'OMOS Record'));
            $description = isset($item['description']) ? $item['description'] : (isset($item['summary']) ? $item['summary'] : (isset($item['status']) ? $item['status'] : ''));
            $url = isset($item['url']) ? $item['url'] : (isset($item['href']) ? $item['href'] : '');
            $html .= '<article class="omos-core-card"><h3>' . esc_html((string) $title) . '</h3>';
            if ($description !== '') {
                $html .= '<p>' . esc_html(wp_trim_words(wp_strip_all_tags((string) $description), 32)) . '</p>';
            }
            if ($url) {
                $html .= '<p><a class="omos-core-link" href="' . esc_url($url) . '">View details</a></p>';
            }
            $html .= '</article>';
        }
        return $html . '</div>';
    }

    public function manifest() {
        $payload = $this->fetch('manifest');
        if (is_wp_error($payload)) {
            return $this->error_card($payload->get_error_message());
        }
        $version = isset($payload['version']) ? $payload['version'] : (isset($payload['runtimeVersion']) ? $payload['runtimeVersion'] : (isset($payload['omos_version']) ? $payload['omos_version'] : 'reported by node'));
        $status = isset($payload['status']) ? $payload['status'] : (isset($payload['maturity']) ? $payload['maturity'] : 'available');
        return '<div class="omos-core-card"><h3>OMOS Manifest</h3><p><strong>Node:</strong> ' . esc_html($this->client->node_url()) . '</p><p><strong>Version:</strong> ' . esc_html((string) $version) . '</p><p><strong>Status:</strong> ' . esc_html((string) $status) . '</p></div>';
    }

    public function runtime_status() {
        $status = $this->client->safe_status();
        $class = !empty($status['verified']) ? 'omos-core-ok' : 'omos-core-unavailable';
        $label = !empty($status['verified']) ? 'Reachable' : 'Needs verification';
        return '<div class="omos-core-card ' . esc_attr($class) . '"><h3>OMOS Runtime Status</h3><p><strong>' . esc_html($label) . '</strong></p><p>Node: ' . esc_html($status['node']) . '</p><p>Health and manifest are checked independently. Repository state is not deployment proof.</p></div>';
    }

    public function ecosystem() {
        return $this->cards('ecosystem', array('ecosystem', 'items', 'systems'));
    }

    public function tools() {
        return $this->cards('tools', array('tools', 'items'));
    }

    public function artifacts() {
        return $this->cards('artifacts', array('artifacts', 'items'));
    }

    public function docs() {
        return $this->cards('docs', array('docs', 'documents', 'items'));
    }

    public function open_console() {
        return '<a class="omos-core-button" href="' . esc_url(untrailingslashit($this->client->node_url()) . '/dashboard') . '">Open OMOS Console</a>';
    }

    public function bridge_builder() {
        return '<div class="omos-core-card omos-core-planned"><h3>OMOS Bridge Builder</h3><p>Planned module. It is not operational until its runtime, authorization, and verification path are separately implemented and tested.</p></div>';
    }

    public function dashboard() {
        return '<div class="omos-core-dashboard">' . $this->runtime_status() . $this->manifest() . '<div class="omos-core-actions">' . $this->open_console() . '</div></div>';
    }
}
