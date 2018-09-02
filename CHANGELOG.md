Changelog
=========

0.3.0 - 2018-09-02
------------------

### Removed

* Drop PHP 7.0 support.

### Added

* Signature help.
* Workspace symbols search.
* Progress notifications as a custom protocol extension.
* Add "Fix wrong autoloaded class/namespace name" code action.
* Class/interface/trait snippets.

### Changed

* Upgrade to PHPStan 0.10, with greatly improved standard library type
  information. Also allowing us to add support for anonymous classes.
* Standard library index is now prebuilt, not scanned at startup.
* Schedule tasks by priorities to improve latency on interactive requests.
* Hierarchical document symbols.
* "Go to" and hover point to constructor when in new expressions.

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
