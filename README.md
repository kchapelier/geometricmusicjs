geometricmusicjs
================

Remix of the Geometric Music app in javascript in one weekend.

## Description

The aim of this application is to reproduce the main features of the iOs Geometric Music app using only web standard technologies in one weekend (2 days).

The development of the project will run from 2014-07-12 10:15am to 2014-07-14 01:00am CEST.

Strict conformity to the original application is not the point (its source code is not disclosed anyway), neither is a good UI (because I'm not a designer).

### Priorities :

* The audio engine is the top priority.
* Builtin sample library.
* Shapes from 1 to 8 segments.
* Different 'vector' per segments : 'silent', 'normal', 'reverse'
* Precise tuning per shape (replacing the 'down' vector, thus enabling to play a sample in reverse and down 7 semitones for example).
* Output saving as WAV
* Minimal UI : premature UI considerations are considered harmful (I just [made this up](http://modelviewculture.com/pieces/the-making-of-myths)).

### Extras (if time permits) :

* Being able to add samples in the library by microphone recording.
* More vectors : 'X repeats', 'vinyl scratch', 'vinyl stop', 'vinyl start', etc.
* Time offset per shape.
* Making it visually appealing.

## Motivations

* Challenging myself.
* Making a case for web-(and javascript)-based audio application for my employers and coworkers.
* Making a test case for the unstable [Aural.js](https://github.com/kchapelier/Aural.js).
