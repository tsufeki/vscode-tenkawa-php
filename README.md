
Tenkawa PHP Visual Studio Code extension
========================================

![Tenkawa](images/tenkawa-logo.png)

Tenkawa is a PHP language support extension for VSCode, with powerful static
analysis and type inference engine borrowed without asking from
[PHPStan][phpstan].

\[This repo contains just the glue code, actual features are implemented
in the [language server][server].\]

Still experimental, but should be usable. Any bug reports, feature requests,
suggestions, questions are welcome. Please submit them to the
[language server's tracker][issues].

[phpstan]: https://github.com/phpstan/phpstan
[server]: https://github.com/tsufeki/tenkawa-php-language-server
[issues]: https://github.com/tsufeki/tenkawa-php-language-server/issues

Installation
------------

PHP >= 7.1 with pdo_sqlite extension is required. If it isn't available in
your `$PATH` as `php`, set the `tenkawaphp.executablePath` setting.

Setting `php.suggest.basic` to `false` is recommended, as is leaving
`php.validate.enable` as `true` (Tenkawa does not report all erroneous code
yet).

Features
--------

* ✔ Autocompletion
  * ✔ Classes/functions (also with automatic import and within doc comments)
  * ✔ Class members
  * ✔ Local variables
* ✔ Diagnostics
  * ✔ Static analysis with [PHPStan][phpstan]
      (see [Known issues](#known-issues))
* ✔ Go to definition
* ✔ Go to implementation
* ✔ Hover info
* ✔ Signature help
* ✔ References
* ✔ Document symbols
* ✔ Workspace symbols
  * ✔ Classes/functions/consts
  * ✘ Class members (not yet)
* ✔ Code actions
  * ✔ Import class/function
  * ✔ Fix wrong autoloaded class/namespace name
  * ✘ More to come...
* ✔ Multi-root workspace
* ✔ Snippets
  * ✔ Class/interface/trait
* ✔ Dynamic configuration

Unimplemented (yet?):

* ✘ Go to type definition
* ✘ Go to declaration
* ✘ Document highlight
* ✘ Document link
* ✘ Code lens
* ✘ Formatting
  * ✘ document
  * ✘ range
  * ✘ on type
* ✘ Rename
* ✘ Folding range

Known issues
------------

* Many features don't work inside traits. This is caused by PHPStan's design.
* Refactors are not 100% bullet-proof.
* Performance & long indexing times.

Licence
-------

MIT. Please note that the actual language server (bundled in the dist package)
is licensed under GPL 3+.
