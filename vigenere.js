// vresion: 1.0.0

function encrypt(ptext, key) {
    const base = "A".charCodeAt(0);

    ptext = ptext.replace(/[^a-zA-Z]/g, "").toUpperCase();
    key = key.replace(/[^a-zA-Z]/g, "").toUpperCase();

    if (ptext === "" || key === "") {
        return "";
    }

    var ctext = "";

    for (let i = 0; i < ptext.length; i++) {
        var pi = ptext.charCodeAt(i) - base;
        var ki = key.charCodeAt(i % key.length) - base;
        var ci = ((pi + ki) % 26) + base;
        ctext = ctext.concat(String.fromCharCode(ci));
    }

    return ctext;
}

function decrypt(ctext, key) {
    const base = "A".charCodeAt(0);

    ctext = ctext.replace(/[^a-zA-Z]/g, "").toUpperCase();
    key = key.replace(/[^a-zA-Z]/g, "").toUpperCase();

    if (ctext === "" || key === "") {
        return "";
    }

    var ptext = "";

    for (let i = 0; i < ctext.length; i++) {
        var ci = ctext.charCodeAt(i) - base;
        var ki = key.charCodeAt(i % key.length) - base;
        var pi = ((ci - ki + 26) % 26) + base;
        ptext = ptext.concat(String.fromCharCode(pi));
    }

    return ptext;
}