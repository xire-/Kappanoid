# Kappanoid

A pure JavaScript Arkanoid clone inspired by: [Juice it or lose it - a talk by Martin Jonasson & Petri Purho](https://www.youtube.com/watch?v=Fy0aCDmgnxg).
Tested in Chrome 38, Firefox 33 and Safari 8. On Windows, it has been reported that the game plays smoothly only using Internet Explorer (sigh).

### Setup
To facilitate development, the code was splitted into several JavaScript files, collected in the `src/js/parts` folder. To test the game, it is needed to merge these files into a single big file named `kappanoid.js`. This is done automagically by typing from terminal the command `make` in the folder `src/js`. After this step, just play Kappanoid by opening `src/index.html` in your favorite browser. If you don't want to build the code yourself, you can download a working version of the game [here](https://bitbucket.org/xire91/kappanoid/downloads).

### Key bindings
SPACE: insert coin / release ball from paddle / activate power-up effect / advance to next level (when the current level is complete)
Number keys 1 to 8: toggle each setting on/off
P: toggle pause on/off
D: toggle debug mode on/off

(if debug mode is active)
L: spawn debug particles
R: restart level
N: advance to next level
U: set timeScale to 1
I: set timeScale to 0.5
O: set timeScale to 0.15


# Credits

### Easing functions ###
Open source under the BSD License.

Copyright © 2001 Robert Penner
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of the author nor the names of contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

[http://www.robertpenner.com/easing/](http://www.robertpenner.com/easing/)

### Collision detection functions ###
Ericson, C. *[Real-Time Collision Detection](http://www.amazon.com/Real-Time-Collision-Detection-Interactive-Technology/dp/1558607323)*. CRC Press (December 22, 2004)

### Emulogic font ###
"Emulogic" - Truetype Font
Copyright (c) 2004 by ck! [Freaky Fonts].
All rights reserved.

[http://www.freakyfonts.de](http://www.freakyfonts.de)

### Howler.js ###
Copyright (c) 2013 James Simpson and GoldFire Studios, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[https://github.com/goldfire/howler.js](https://github.com/goldfire/howler.js)

### Juicy-breakout ###
Copyright (c) 2012 Martin Jonasson, Petri Purho

This software is provided 'as-is', without any express or implied warranty. In no event will the authors be held liable for any damages arising from the use of this software. Permission is granted to anyone to use this software for any purpose, including commercial applications, and to alter it and redistribute it freely, subject to the following restrictions:

1. The origin of this software must not be misrepresented; you must not
claim that you wrote the original software. If you use this software in a product, an acknowledgment in the product documentation would be appreciated but is not required.
2. Altered source versions must be plainly marked as such, and must not be misrepresented as being the original software.
3. This notice may not be removed or altered from any source distribution.

[https://github.com/grapefrukt/juicy-breakout](https://github.com/grapefrukt/juicy-breakout)
