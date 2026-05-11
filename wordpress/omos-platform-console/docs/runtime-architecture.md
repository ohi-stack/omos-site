# OMOS Runtime Architecture

## WordPress Layer

Responsibilities:

- public pages
- documentation
- commerce
- dashboard UI
- shortcode rendering
- import/export
- menu systems
- artifact presentation
- tools presentation
- WooCommerce integration

## Node Layer

Responsibilities:

- runtime authority
- API orchestration
- paid endpoint execution
- verification authority
- system health authority
- OMOS processing runtime
- version authority
- telemetry and logging

## Required REST Endpoints

- /wp-json/omos/v1/status
- /wp-json/omos/v1/artifacts
- /wp-json/omos/v1/tools
- /wp-json/omos/v1/verify
- /wp-json/omos/v1/dashboard
- /wp-json/omos/v1/sitemap

## Required Routes

- /omos
- /ohi
- /models
- /tools
- /artifacts
- /docs
- /shop
- /latest-news
- /dashboard
- /verify
- /registry
- /legal
- /contact
