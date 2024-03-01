Description
===========

This library formats to HTML input like this:

    It's not [G]time to make a [D]change, just re[C]lax, take it [Am7]easy
    you're still [G]young, that's your [Em]fault,
    there's so [Am]much you have to [D]know

Example
=======

Take a look at [this example](http://rosenfeld.github.com/chords-processor).

GitHub integration
------------------

This application doesn't need a server-side environment, using just static assets.

So, it won't store any changes or load a list of songs from a database.

But the example application will allow anyone to create a repository in GitHub containing
their preferred songs in the supported format. In the future we might support other
usages of the GitHub API support for creating commits and pull requests directly from the
example application.

Note: be aware that GitHub limits its API usage to 60 requests per hour.

Features
========

Currently those are the supported features:

- Supports title, author, artist and tone directives
- Enable inline-editing
- Has GitHub integration
- Highly customizable output
- Transposition support
- Supports normalized chords

Running the tests
=================

To run all Jasmine tests, simply:

    npm test

Before submitting pull requests, besides running all tests, make sure to also
run eslint:

    npm run lint

Contributions / TO-DO
====================

Not every user of this example application is a developer but the application may still be
useful for them. I'd appreciate if someone could create a screencast teaching how to send
their songs to a GitHub repository from a non-programmer perspective. Should be something
really simple for them to reproduce. I'll put the links here for each screencast in each
language in what it was created.

Adding internationalization to this project would also be much appreciated. Let me
know if you're interested on adding i18n or/and l10n support.

Bugs
====

If you think you've found any bugs, please report them in the
[GitHub issues page](https://github.com/rosenfeld/chords-processor/issues).

Authors
=======

[Rodrigo Rosenfeld Rosas](http://rosenfeld.page)

