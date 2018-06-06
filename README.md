# Kappanoid
A pure JavaScript Arkanoid clone inspired by [Juice it or lose it—a talk by Martin Jonasson and Petri Purho](https://www.youtube.com/watch?v=Fy0aCDmgnxg).

Play the online version [here](https://integeruser.github.io/misc/kappanoid/)!

## Setup
To facilitate development the code was split into multiple JavaScript files, to be merged in a single `kappanoid.js` using the provided `Makefile`. Then, to play the game, open `index.html` in your favorite browser.

## Key Bindings
| Key                               | Action                        |
| --------------------------------- | ----------------------------- |
| `SPACEBAR`                        | Insert coin / Release ball from paddle / Activate power-up effect / Advance to next level (when the current level is complete) |
| `1` to `8`                        | Toggle each setting on/off    |
| `P`                               | Toggle pause on/off           |
| `D`                               | Toggle debug mode on/off      |
| (If debug mode is active)         |                               |
| `L`                               | Spawn debug particles         |
| `R`                               | Restart level                 |
| `N`                               | Advance to next level         |
| `U`                               | Set time scale to 1           |
| `I`                               | Set time scale to 0.5         |
| `O`                               | Set time scale to 0.15        |

## Credits

### Easing functions ###
[http://www.robertpenner.com/easing/](http://www.robertpenner.com/easing/)

Open source under the BSD License.

Copyright © 2001 Robert Penner
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of the author nor the names of contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

### Collision detection functions ###
Ericson, Christer. *Real-time collision detection*. CRC Press, 2004.

### Emulogic font ###
[http://www.freakyfonts.de](http://www.freakyfonts.de)

"Emulogic" - Truetype Font
Copyright (c) 2004 by ck! [Freaky Fonts].
All rights reserved.

### Juicy Breakout ###
[https://github.com/grapefrukt/juicy-breakout](https://github.com/grapefrukt/juicy-breakout)

Copyright (c) 2012 Martin Jonasson, Petri Purho

This software is provided 'as-is', without any express or implied warranty. In no event will the authors be held liable for any damages arising from the use of this software. Permission is granted to anyone to use this software for any purpose, including commercial applications, and to alter it and redistribute it freely, subject to the following restrictions:

1. The origin of this software must not be misrepresented; you must not
claim that you wrote the original software. If you use this software in a product, an acknowledgment in the product documentation would be appreciated but is not required.
2. Altered source versions must be plainly marked as such, and must not be misrepresented as being the original software.
3. This notice may not be removed or altered from any source distribution.
