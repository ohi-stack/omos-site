<?php
if (!defined('ABSPATH')) {
    exit;
}

final class OMOS_Shortcodes {
    private $client;

    private $canonical = array(
        'omos_manifest'            => 'render_manifest',
        'omos_runtime_status'      => 'render_runtime_status',
        'omos_ecosystem_cards'     => 'render_ecosystem_cards',
        'omos_bridge_builder'      => 'render_bridge_builder',
        'omos_tool_grid'           => 'render_tool_grid',
        'omos_artifact_grid'       => 'render_artifact_grid',
        'omos_docs_grid'           => 'render_docs_grid',
        'omos_open_console_button' => 'render_open_console_button',
        'omos_ohi_pipeline'        => 'render_ohi_pipeline',
        'omos_unity_dashboard'     => 'render_unity_dashboard',
    );

    private $compatibility = array(
        'omos_ask'              => 'render_ask',
        'omos_council'          => 'render_council',
        'omos_decision_history' => 'render_decision_history',
        'omos_belief_mapper'    => 'render_belief_mapper',
    );

    public function __construct(OMOS_Runtime_Client $client) {
        $this->client = $client;
    }

    public function register() {
        foreach (array_merge($this->canonical, $this->compatibility) as $tag => $method) {
            add_shortcode($tag, array($this, $method));
        }
    }

    public function canonical_registry() {
        return array_keys($this->canonical);
    }

    public function compatibility_registry() {
        return array_keys($this->compatibility);
    }

    public function status_matrix() {
        $health = $this->client->health();
        $connected = !empty($health['ok']);
        $matrix = array();

        foreach ($this->canonical as $tag => $method) {
            $registered = shortcode_exists($tag);
            $working = $registered && method_exists($this, $method);
            $matrix[$tag] = array(
                'registered' => $registered,
                'working'    => $working,
                'connected'  => $connected,
                'error'      => $working ? ($connected ? '' : $this->runtime_error($health)) : 'shortcode_handler_unavailable',
            );
        }

        return $matrix;
    }

    private function runtime_error($health) {
        return !empty($health['error']) ? (string) $health['error'] : 'runtime_not_connected';
    }

    private function shell($title, $body, $class = '') {
        return '<section class="omos-core-module ' . esc_attr($class) . '"><div class="omos-core-heading"><span>OneGodian™ • OMOS™</span><h2>' . esc_html($title) . '</h2></div>' . $body . '</section>';
    }

    private function card($title, $description, $url, $eyebrow = 'OMOS') {
        return '<article class="omos-core-card"><span class="omos-core-eyebrow">' . esc_html($eyebrow) . '</span><h3>' . esc_html($title) . '</h3><p>' . esc_html($description) . '</p><a href="' . esc_url($url) . '">Open →</a></article>';
    }

    private function metric($label, $value) {
        return '<div class="omos-core-metric"><span>' . esc_html($label) . '</span><strong>' . esc_html((string) $value) . '</strong></div>';
    }

    public function render_runtime_status() {
        $health = $this->client->health();
        $connected = !empty($health['ok']);
        $status = $connected ? 'Connected' : 'Unavailable / not verified';
        $body = '<div class="omos-core-status-row"><span class="omos-core-status ' . ($connected ? 'is-connected' : 'is-error') . '">' . esc_html($status) . '</span><a class="omos-core-button" href="' . esc_url($this->client->runtime_url()) . '">Open Runtime</a></div>';
        return $this->shell('Runtime Status', $body);
    }

    public function render_manifest() {
        $manifest = $this->client->manifest();
        $data = (!empty($manifest['ok']) && is_array($manifest['data'])) ? $manifest['data'] : array();
        $body = '<div class="omos-core-metrics">'
            . $this->metric('Runtime Version', isset($data['version']) ? $data['version'] : 'Unavailable')
            . $this->metric('Runtime Status', isset($data['status']) ? $data['status'] : 'Not verified')
            . $this->metric('Canonical Runtime', isset($data['canonicalHost']) ? $data['canonicalHost'] : $this->client->runtime_url())
            . $this->metric('Plugin Version', OMOS_CORE_TOOLS_VERSION)
            . '</div>';
        return $this->shell('OMOS Manifest', $body);
    }

    public function render_ecosystem_cards() {
        $body = '<div class="omos-core-grid">'
            . $this->card('OMOS Public', 'Public explanation, documentation, WordPress presentation and discovery.', $this->client->public_url(), 'Public')
            . $this->card('OMOS Runtime', 'Governed runtime, Council, Human Gate, Decision Records and operational workspace.', $this->client->runtime_url(), 'Runtime')
            . $this->card('OneGodian.org', 'Civil, cultural, educational and public-facing OneGodian layer.', 'https://onegodian.org', 'Ecosystem')
            . $this->card('OneGodian.com', 'Commercial products, services and customer pathways.', 'https://onegodian.com', 'Ecosystem')
            . $this->card('QuantumOHI.com', 'QuantumOHI platform and advanced intelligence interfaces.', 'https://quantumohi.com', 'Ecosystem')
            . '</div>';
        return $this->shell('OneGodian Ecosystem', $body);
    }

    public function render_bridge_builder() {
        return $this->shell('Bridge Builder', $this->card('Connection & Adaptation Layer', 'Inspect OMOS connection architecture, MCP interoperability and developer integration surfaces.', $this->client->runtime_url('developers'), 'Connections'));
    }

    public function render_tool_grid() {
        $base = $this->client->runtime_url();
        $body = '<div class="omos-core-grid">'
            . $this->card('Ask OMOS', 'Start a governed decision or analysis run.', $base . '/ask/', 'Workspace')
            . $this->card('Belief Mapper', 'Structured belief reflection and journey-stage tooling.', $base . '/belief-mapper', 'Identity')
            . $this->card('Model Connectors', 'Review provider configuration and health state.', $base . '/models', 'Council')
            . $this->card('Reference Run', 'Review OMOS-REF-0001 production verification requirements.', $base . '/reference-run', 'Verification')
            . '</div>';
        return $this->shell('OMOS Tools', $body);
    }

    public function render_artifact_grid() {
        return $this->shell('OMOS Artifacts', $this->card('Artifacts & Evidence', 'Source documents, implementation evidence, manifests and runtime records.', $this->client->runtime_url('artifacts'), 'Evidence'));
    }

    public function render_docs_grid() {
        $base = $this->client->runtime_url();
        $body = '<div class="omos-core-grid">'
            . $this->card('Documentation', 'Public-safe and developer OMOS documentation.', $base . '/docs', 'Docs')
            . $this->card('OneGodian Protocol™', 'Definitions, identity rules, scope and interoperability.', $base . '/protocol', 'Foundation')
            . $this->card('OneGodian Algorithm™', 'Observe → Distill → Align → Select → Execute → Verify.', $base . '/algorithm', 'Foundation')
            . $this->card('O-H-I™', 'Multi-model comparison, critique and governed synthesis.', $base . '/ohi', 'Intelligence')
            . '</div>';
        return $this->shell('OMOS Documentation', $body);
    }

    public function render_open_console_button() {
        return '<a class="omos-core-button omos-core-button-primary" href="' . esc_url($this->client->runtime_url('dashboard')) . '">Open OMOS Console</a>';
    }

    public function render_ohi_pipeline() {
        return $this->shell('O-H-I Output Pipeline', $this->card('View Pipeline', 'Independent outputs → cross-review → contradictions and agreement → governed synthesis → human review.', $this->client->runtime_url('ohi-output-pipeline'), 'O-H-I'));
    }

    public function render_unity_dashboard() {
        $health = $this->client->health();
        $manifest = $this->client->manifest();
        $data = (!empty($manifest['ok']) && is_array($manifest['data'])) ? $manifest['data'] : array();
        $body = '<div class="omos-core-metrics">'
            . $this->metric('Runtime', !empty($health['ok']) ? 'Connected' : 'Not verified')
            . $this->metric('Runtime Version', isset($data['version']) ? $data['version'] : 'Unavailable')
            . $this->metric('Plugin', OMOS_CORE_TOOLS_VERSION)
            . $this->metric('Bridge Key', $this->client->bridge_key_source())
            . '</div><div class="omos-core-actions">' . $this->render_open_console_button() . '<a class="omos-core-button" href="' . esc_url($this->client->runtime_url('docs')) . '">Documentation</a></div>';
        return $this->shell('OMOS Unity Dashboard', $body, 'omos-core-dashboard');
    }

    public function render_ask() {
        if (!is_user_logged_in()) {
            return '<p class="omos-core-notice">Sign in to use Ask OMOS from WordPress.</p>';
        }
        return $this->shell('Ask OMOS', $this->card('Open Ask OMOS', 'Continue in the governed OMOS workspace.', $this->client->runtime_url('ask/'), 'Compatibility'));
    }

    public function render_council() {
        return $this->shell('OMOS Council', $this->card('Council Workspace', 'Independent model outputs, cross-review, synthesis and human review.', $this->client->runtime_url('council'), 'Compatibility'));
    }

    public function render_decision_history() {
        return $this->shell('Decision History', $this->card('Open History', 'Review persisted governed runs and Decision Records in the OMOS workspace.', $this->client->runtime_url('dashboard'), 'Compatibility'));
    }

    public function render_belief_mapper() {
        return $this->shell('Belief Mapper', $this->card('Open Belief Mapper', 'Structured reflection and journey-stage interface.', $this->client->runtime_url('belief-mapper'), 'Compatibility'));
    }
}
