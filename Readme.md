KISSWeb
=======

KISS Web server is a very simple web server written in nodejs.

Purpose
-------

It is designed to use few external libraries (to make installation and dependency management easy and also
because it's fun to write yet-another-web-server logic).

It's main goal is to make it easy to build light and simple website for personal homepage
or minimal-viable-products (ie: building a few pages to see if a concept could be sold).

WARNING - This is an exercise in JavaScript and should not be used by anone else than me right now. Lots of things
have been rewritten for the pleasure of the exercise when it would probably make a lot more sense to use existing
libraries. - WARNING

Installation
------------

  $ npm install kissweb

Running
-------

  $ bin/kissweb <webserver port> <rootdirectory>

Pushing a new version to the NPM repository
-------------------------------------------

	$ npm publish
	
License
-------

Copyright 2012 Thomas Sarlandie 

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
