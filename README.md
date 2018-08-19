
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
* ✔ Hover info
* ✔ References
* ✔ Document symbols
* ✔ Code actions
  * ✔ Import class/function
  * ✘ More to come...
* ✔ Multi-root workspace

Unimplemented (yet?):

* ✘ Go to implementation
* ✘ Go to type definition
* ✘ Signature help
* ✘ Workspace symbols
* ✘ Document highlight
* ✘ Code lens
* ✘ Formatting
  * ✘ document
  * ✘ range
  * ✘ on type
* ✘ Rename
* ✘ Dynamic configuration

Known issues
------------

* Many features don't work inside traits. This is caused by PHPStan's design.
* Refactors are not 100% bullet-proof. More comprehensive implementation needs
  PHP Parser 4 (and its support in PHPStan).
* Filtering of big lists (i.e. completions) is left entirely to the client,
  which must be able to withstand it performance-wise.
* Performance & long indexing times.

Licence
-------

MIT. Please note that the actual language server (bundled in the dist package)
is licensed under GPL 3+.
