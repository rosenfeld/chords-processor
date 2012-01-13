Description
===========

This library formats to HTML input like this:

    It's not [G]time to make a [D]change, just re[C]lax, take it [Am7]easy
    you're still [G]young, that's your [Em]fault,
    there's so [Am]much you have to [D]know

Example
=======

Take a look at [this example](http://rosenfeld.github.com/chords-processor).

Make sure to use a recent browser with good support to HTML5. It is just an
example app and I'll won't make any effort to make it work on non-conforming
browsers. I'd advise you to use [es5-shim](https://github.com/kriskowal/es5-shim)
if you care about them.

GitHub integration
------------------

This application doesn't need a server-side environment, using just static assets.

So, it won't store any changes or load a list of songs from a database.

But the example application will allow anyone to create a repository in GitHub containing
their preferred songs in the supported format. In the future we might support other
usages of the GitHub API support for creating commits and pull requests directly from the
example application.

Note: be aware that GitHub limits its API usage to 5000 requests per hour.

Features
========

Currently those are the supported features:

- Supports title, author, artist and tone directives
- Enable inline-editing
- Has GitHub integration
- Highly customizable output
- Transposition support
- Supports normalized chords

Building from source
====================

All scripts are written in [CoffeeScript](http://coffeescript.org/).

Just install [Node.js](http://nodejs.org/) (latest version already includes npm)
and install coffeescript:

    npm install coffeescript

Then just run ./build.sh or, if you're on Windows:

    coffee -c -o js lib/

If you want to contribute, I'd suggest you to take a look at [jitter](https://github.com/TrevorBurnham/Jitter):

    npm install jitter
    jitter lib/ js/

This will watch for changes and regenerate the JavaScript after each change.

Contributions / TO-DO
====================

Not every user of this example application is a developer but the application may still be
useful for them. I'd appreciate if someone could create a screencast teaching how to send
their songs to a GitHub repository from a non-programmer perspective. Should be something
really simple for them to reproduce. I'll put the links here for each screencast in each
language in what it was created.

Adding internationalization to this project would also be much appreciated. Let me
know if you're interested on adding i18n or/and l10n support.

Authors
=======

[Rodrigo Rosenfeld Rosas](http://rosenfeld.heroku.com/en/)
