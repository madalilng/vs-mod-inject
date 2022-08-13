# # vs-mod-inject

create a mod-loader folder to VampireSurvivors\resources\app\.webpack\renderer
download all these file and move to mod-loader folder the you created

there's an example of mod in mods folder (goku and its weapon ki)

copy and replace main.bundle.js or modify main.bundle.js your own

# modify main.bundle.js

add these code to the top part of the main.bundle.js

    const { Mod } = require("./mod-loader/mod.js");
    const mod = new Mod();
then find `_0x4aa3a4(_0x3bbdd2)`

edit this line.

from

    return ( 
        _0x1511fa[_0x3bbdd2]["call"](
        _0x13f662[_0x15cb4b(0xa81)],
        _0x13f662,
        _0x13f662[_0x15cb4b(0xa81)],
        _0x4aa3a4
    ),

to

    const  ret = (
	    _0x1511fa[_0x3bbdd2]["call"](
	    _0x13f662[_0x15cb4b(0xa81)],
	    _0x13f662,
	    _0x13f662[_0x15cb4b(0xa81)],
	    _0x4aa3a4
	),
    _0x13f662[_0x15cb4b(0xa81)]
    );
    
    return  mod.inject(
	    ret, {
		    arg1:_0x13f662[_0x15cb4b(0xa81)],
		    arg2:_0x13f662,
		    arg3:_0x13f662[_0x15cb4b(0xa81)],
		    arg4:_0x4aa3a4,
	    }
    );
