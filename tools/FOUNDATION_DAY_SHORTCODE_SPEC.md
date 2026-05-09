# Foundation Day Shortcode Specification

Version target: OMOS Core Tools v1.4.0
Proposed shortcode: `[omos_foundation_day]`
Recommended page: `/foundation-day/`

## Purpose

The Foundation Day page records what was built, documented, and established during the March 24–25, 2026 working session, with additional public timestamping through April 9, 2026.

## Implementation Rule

The provided full HTML document should not be pasted into WordPress as a complete `<!DOCTYPE html>` page. Inside the plugin, it should be converted into a shortcode-rendered section so it can safely run inside the active WordPress theme.

## Plugin Integration

Add a new shortcode registration:

```php
add_shortcode('omos_foundation_day', array($this, 'shortcode_foundation_day'));
```

Add a public method:

```php
public function shortcode_foundation_day($atts = array()) {
    $this->enqueue_public_assets();
    ob_start();
    ?>
    <section class="omos-foundation-day" data-omos-foundation-day>
        <!-- Foundation Day page content here -->
    </section>
    <?php
    return ob_get_clean();
}
```

## Required Asset Conversion

Move all CSS from the provided document into:

```text
/assets/omos-core-tools.css
```

Move all JavaScript from the provided document into:

```text
/assets/omos-core-tools.js
```

Use scoped selectors prefixed with:

```text
.omos-foundation-day
```

## Important Cleanup

The provided CSS uses typographic dash characters in CSS custom properties, such as:

```text
–bg
–gold
–panel
```

These must be corrected to standard CSS variables:

```text
--bg
--gold
--panel
```

The provided HTML also uses smart quotes in fonts and CSS strings. Those should be converted to standard quotes for safe plugin packaging.

## Recommended Public Page

Create a WordPress page:

```text
/foundation-day/
```

Page content:

```text
[omos_foundation_day]
```

## Admin Placement

Add to:

```text
OMOS Tools → Pages / Shortcodes
```

or:

```text
OMOS Tools → Foundation Day
```

## Production Notes

- Keep this as a public historical/narrative page.
- Do not present revenue, users, market penetration, or adoption as completed if they are not yet operational.
- Preserve the distinction between documented assets and live operational systems.
- ONEGODIAN, LLC should be described as the commercial/IP/software entity.
