# Tieto theme for Drupal 8

## Build
You need [Node.js](https://nodejs.org/en/) for theme development. After you have `node` and `npm` in your Terminal:

1. Run `npm install`
2. Run `gulp` for single compile of assets.
3. Run `gulp --production` for preparing assets for production (minification, bundling, etc.)
4. Run `gulp watch` for watching on file changes, i.e. when developing stuff.

## Styleguide
See: https://drive.google.com/file/d/0B8W_7QR5lW39MXJfWWsyTUdPSms/view?ts=57c5882b

## Templates / TWIG
Templates can be found in the [`templates`](templates) folder, separated into multiple directories.

### Includes
These are template parts which can be included in any other `.twig` file. They are found in `templates/inc` folder. Use them like so:

#### With no variables

In your `THEME/templates/inc/logo.html.twig` file:

```twig
<a href="/">
	<img src="path/to/logo.jpg" alt="Site logo">
</a>
```

In your `THEME/templates/pages/page.html.twig` file:

```twig
<div class="main-content">
	{% include directory ~ '/templates/inc/logo.html.twig' %}

	{# ... #}
</div>
```

#### With TWIG variables

In your `THEME/templates/inc/logo.html.twig` file:

```twig
<a href="{{ base_url }}">
	<img src="path/to/logo.jpg" alt="Site logo">
</a>
```

In your `THEME/templates/pages/page.html.twig` file:

```twig
{# Supposing you have access to base_url variable in this file. #}
<div class="main-content">
	{% include directory ~ '/templates/inc/logo.html.twig' with base_url %}

	{# ... #}
</div>
```