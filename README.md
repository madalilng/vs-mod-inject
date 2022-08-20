# # vs-mod-inject

create a mod-loader folder to VampireSurvivors\resources\app\.webpack\renderer
download all these file and move to mod-loader folder that you created

there's an example of mod in mods folder (goku and its weapon ki)

copy and replace main.bundle.js or modify main.bundle.js your own

# modify main.bundle.js

add these code to the top part of the main.bundle.js

    const { Mod } = require("./mod-loader/mod.js");
    const mod = new Mod();

then find `_0xc95609 = _0x3862c8["O"](_0xc95609);`

then add this `mod.inject(_0x3862c8);`

it should look like

    _0xc95609 = _0x3862c8["O"](_0xc95609);
    mod.inject(_0x3862c8);
    })();