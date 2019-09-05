Changelog
=========

0.4.4 - 2019-09-05
------------------

### Fixed

* Windows: Preserve case when checking namespace/class name for autoloading.

0.4.3 - 2019-09-02
------------------

### Fixed

* Pass environment variables to the server process.

0.4.2 - 2019-05-04
------------------

### Added

* Automatically turn off xdebug for better performance.
* Option to index additional stubs.

### Fixed

* Open documents index querying performance.
* Sort completions by length to not lose (near-)exact matches when cutting long
  lists.

0.4.0 - 2018-12-30
------------------

### Added

* Type information extensions for:
  * Symfony
  * Doctrine
  * PHPUnit
  * Phony
  * Prophecy
  * Mockery
  * webmozart/assert
  * beberlei/assert
* Go to implementation.
* Go to class member's parent.
* Request cancellation.
* Dynamic configuration (restart is no longer required).
* Support `LocationLink`s - better highlighting in Peek definition/Go to
  implementation.
* Enabled some of missing phpstan rules.

### Changed

* Completions, go to (and other features) for union type now include members
  from all alternatives.
* Only use most common PHP extensions for autocompletion. Add configuration
  option to enable more.
* Filter autocompletion of classes and functions server-side for performance.
* Improve performance by not inferring types of whole file when possible.

### Fixed

* Member completions are deduplicated.
* Make `completion.autoImport` configuration key work again.
* Fix bug with completions being based on old document content.

0.3.3 - 2018-11-02
------------------

### Fixed

* Fix bug in composer path filter.

0.3.2 - 2018-11-01
------------------

### Fixed

* Fixed indexing of standard library.

0.3.1 - 2018-11-01
------------------

### Fixed

* Update phpstan to 0.10.5.
* Group indexing progress notifications (fix multiple popups).
* Fix ?nullable types display in hover popups.
* Fix URIs with `untitled:` scheme causing error responses.

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
