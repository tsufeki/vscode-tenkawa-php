Changelog
=========

0.2.1 - 2018-07-01
------------------

### Fixed

* Compatibility with PHP 7.0.

0.2.0 - 2018-07-01
------------------

### Added

* "Find references" for global and member symbols.

### Deprecated

* PHP 7.0 support, as some of our dependencies will soon be >= 7.1 only.

### Changed

* Completion should be a bit smarter.
* Diagnostic squiggles don't span multiple lines.

### Fixed

* Completion immediately after `$`.
* Don't show hovers for `true`, `false` and `null`.
* Reindex files when closed in client, to mitigate missing changes.

0.1.0 - 2018-04-19
------------------

First release.
